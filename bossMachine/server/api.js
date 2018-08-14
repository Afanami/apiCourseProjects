const db = require("./db.js");
const express = require("express");
const apiRouter = express.Router();

apiRouter.delete("/meetings", (res, req, next) => {
  db.deleteAllFromDatabase("meetings");
});

module.exports = apiRouter;
