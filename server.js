const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(PORT, (err) => {
  if (err) {
    console.error(`Error while connecting to server: ${err}`);
    process.exit(1);
  } else {
    console.log(`Listening on PORT ${PORT}`);
  }
});
