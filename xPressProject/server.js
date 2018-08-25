const express = require("express");
const app = express();

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Listening on server port ${PORT}`);
});

module.exports = app;
