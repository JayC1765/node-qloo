const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

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

app.listen(PORT, (err) => {
  if (err) {
    console.error(`Error while connecting to server: ${err}`);
    process.exit(1);
  } else {
    console.log(`Listening on PORT ${PORT}`);
  }
});
