// Import express files and routers
const express = require("express");
const employeeRouter = express.Router();

// Import sqlite and create DB from file
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

// Mount timesheetsRouter to /api/employees
// @ROUTE /api/employees/:employeeId/timesheets
const timesheetsRouter = require("./timesheets");
employeeRouter.use("/:employeeId/timesheets", timesheetsRouter);

module.exports = employeeRouter;
