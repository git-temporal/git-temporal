const express = require('express');
const app = express();
const port = 11966;

// @ts-ignore
app.get('/git-temporal/history', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
