// Import express files and routers
const express = require("express");
const menuItemsRouter = express.Router({ mergeParams: true });

// Import sqlite and create DB from file
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

module.exports = menuItemsRouter;
