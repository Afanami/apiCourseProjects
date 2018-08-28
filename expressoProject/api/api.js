// Import express files and routers
const express = require("express");
const apiRouter = express.Router();

const employeesRouter = require("./employees");
const menuRouter = require("./menu");

// Mount routes to /api
// @ROUTES /api/employees & /api/menu
apiRouter.use("/employees", employeesRouter);
apiRouter.use("/menu", menuRouter);

module.exports = apiRouter;
