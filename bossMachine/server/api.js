const db = require("./db.js");
const express = require("express");
const apiRouter = express.Router();

// PRETEXT UWU
/* For all /api/minions and /api/ideas routes, any POST or PUT requests will send their new/updated resources in the request body. POST request bodies will not have an id property, you will have to set it based on the next id in sequence. */

/* =================== */
/* @ROUTE /api/minions */
/* =================== */

// Get an array of all minions
apiRouter.get("/minions", (req, res, next) => {
  next();
});

// Create a new minion and save it to the database
apiRouter.post("/minions", (req, res, next) => {
  next();
});

/* ============================= */
/* @ROUTE /api/minions/:minionId */
/* ============================= */

// Get a single minion by id
apiRouter.get("/minions/:minionId", (req, res, next) => {
  next();
});

// Update a single minion by id
apiRouter.put("/minions/:minionId", (req, res, next) => {
  next();
});

// Delete a single minion by id
apiRouter.delete("/minions/:minionId", (req, res, next) => {
  next();
});

/* ========== */
/* BONUS MEME */
/* ========== */
// /* ================================== */
// /* @ROUTE /api/minions/:minionId/work */
// /* ================================== */

// // Get an array of all work for specified minion
// apiRouter.get("/minions/:minionId/work", (req, res, next) => {});

// // Create a new work object and save it to the database
// apiRouter.post("/minions/:minionId/work", (req, res, next) => {});

// /* ========================================== */
// /* @ROUTE /api/minions/:minionId/work/:workId */
// /* ========================================== */

// // Update a single work by id
// apiRouter.put("/minions/:minionId/work/:workId", (req, res, next) => {});

// // Delete a single work by id
// apiRouter.delete("/minions/:minionId/work/:workId", (req, res, next) => {});
/* ========== */
/* BONUS MEME */
/* ========== */

/* ================= */
/* @ROUTE /api/ideas */
/* ================= */

// Get an array of all ideas
apiRouter.get("/ideas", (req, res, next) => {
  next();
});

// Create a new idea and save it to the database
apiRouter.post("/ideas", (req, res, next) => {
  next();
});

/* ========================= */
/* @ROUTE /api/ideas/:ideaId */
/* ========================= */

// Get a single idea by id
apiRouter.get("/ideas/ideaId", (req, res, next) => {
  next();
});

// Update a single idea by id
apiRouter.put("/ideas/ideaId", (req, res, next) => {
  next();
});

// Delete a single idea by id
apiRouter.delete("/ideas/ideaId", (req, res, next) => {
  next();
});

/* ==================== */
/* @ROUTE /api/meetings */
/* ==================== */

// Get an array of all meetings
apiRouter.get("/meetings", (req, res, next) => {
  next();
});

// PRETEXT UWU
/* For this route no request body is necessary, as meetings are generated
automatically by the server upon request. Use the provided createMeeting function exported frmo db.js to create a new meeting object. */
// Create a new meeting and save it to the database
apiRouter.post("/meetings", (req, res, next) => {
  next();
});

// Create a new meeting and save it to the database
apiRouter.delete("/meetings", (req, res, next) => {
  db.deleteAllFromDatabase("meetings");
});

module.exports = apiRouter;
