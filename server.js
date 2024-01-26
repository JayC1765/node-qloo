const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Express middleware to parse requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// fetch-data API endpoint
app.get('/fetch-data', (req, res) => {
  try {
    axios.get('https://jsonplaceholder.typicode.com/users').then((response) => {
      const { data } = response;
      return res.status(200).json(data);
    });
  } catch (err) {
    if (err) {
      console.error(`Error fetching data, ${err}`);
    }
  }
});

// catch-all route handler for any requests to an unknown route
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
