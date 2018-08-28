// Import express files and routers
const express = require("express");
const menuRouter = express.Router();

// Import sqlite and create DB from file
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

// Mount menuItemsRouter
// @ROUTE /api/menu/:menuId/menu-items
const menuItemsRouter = require("./menu-items");
menuRouter.use("/:menuId/menu-items", menuItemsRouter);

module.exports = menuRouter;
