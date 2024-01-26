const express = require('express');
const axios = require('axios');
const redis = require('redis');
const app = express();
const PORT = 3000;
const usersURI = 'https://jsonplaceholder.typicode.com/users';
const albumsURI = 'https://jsonplaceholder.typicode.com/albums';
const { getOrSetCache } = require('./util');

const redisClient = redis.createClient();

// Express middleware to parse requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// fetch-data API endpoint
app.get('/fetch-data', async (req, res) => {
  try {
    // With helper function, get the users from cache otherwise fetch from API
    const users = await getOrSetCache(redisClient, 'allUsers', async () => {
      const { data } = await axios.get(usersURI);
      return data;
    });

    return res.status(200).json(users);
  } catch (err) {
    console.error(`Error fetching data, ${err}`);
    return res.status(500).json({ message: 'Error with fetching data' });
  }
});

/*
process-data API endpoint: fetches the most updated data for all users and albums. It will then associate all albums
to the respective user, store each user in Redis for future queries, and returns the update user object to the client.
*/
app.get('/process-data', async (req, res) => {
  try {
    // Fetch all updated users and albums
    const { data: allUsers } = await axios.get(usersURI, (err, result) => {
      if (err) {
        console.error('Error fetching all users: ', err);
        throw err;
      } else {
        return result;
      }
    });

    const { data: allAlbums } = await axios.get(albumsURI, (err, result) => {
      if (err) {
        console.error('Error fetching all albums: ', err);
        throw err;
      } else {
        return result;
      }
    });

    const allUsersArr = [];
    const usersHash = {};

    // Store all users in a hashmap
    for (const users of allUsers) {
      const userId = `userId${users.id}`;
      delete users.id;
      usersHash[userId] = users;
    }

    // Associate all albums with the respective users
    for (const album of allAlbums) {
      const userId = `userId${album.userId}`;
      delete album.userId;
      if (userId in usersHash) {
        usersHash[userId]['albums'] = usersHash[userId]['albums'] || [];
        usersHash[userId]['albums'].push(album);
      } else {
        console.error('A user could not be found for this album');
        throw new Error(
          'An album could not be associated with an existing user'
        );
      }
    }

    /* 
    Store each updated user with their albums into Redis for future access. Return an array of
    all updated users to the client.
    */
    for (const [userId, userDetails] of Object.entries(usersHash)) {
      allUsersArr.push({ [userId]: userDetails });

      redisClient.set(userId, JSON.stringify(userDetails), (err, result) => {
        if (err) {
          console.error(`Error storing ${userId}`);
        } else {
          console.log(`Successfully store ${userId}`);
        }
      });
    }

    return res.status(200).json(allUsersArr);
  } catch (err) {
    console.error(`Error processing data, ${err}`);
    return res.status(500).json({ message: 'Error with processing data' });
  }
});

// Catch-all route handler for any requests to an unknown route
app.use((req, res) =>
  res.status(404).send("This is not the page you're looking for...")
);

app.listen(PORT, (err) => {
  if (err) {
    console.error(`Error while connecting to server: ${err}`);
    process.exit(1);
  } else {
    console.log(`Listening on PORT ${PORT}`);
  }
});

// Event listener for server errors
app.on('error', (err) => {
  console.error(`Server encountered an error: ${err}`);
});

redisClient
  .connect()
  .then(() => {
    console.log('Connected to Redis');
    redisClient.on('error', (err) => console.log('Redis Client Error: ', err));
  })
  .catch((err) => {
    console.error('Error connecting to Redis:', err);
  });
