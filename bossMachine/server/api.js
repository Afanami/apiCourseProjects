const db = require("./db.js");
const express = require("express");
const apiRouter = express.Router();

// PRETEXT UWU
/* For all /api/minions and /api/ideas routes, any POST or PUT requests will send their new/updated resources in the request body. POST request bodies will not have an id property, you will have to set it based on the next id in sequence. */

/* =================== */
/* @ROUTE /api/minions */
/* =================== */

// Check if minion exists and return an array of all minions
apiRouter.get("/minions", (req, res, next) => {
  const minions = db.getAllFromDatabase("minions");
  minions !== null ? res.status(200).send(minions) : res.status(404);
  next();
});

// Create a new minion and save it to the database
apiRouter.post("/minions", (req, res, next) => {
  // console.log(req);
  // let minions = db.getAllFromDatabase("minions");
  // db.addToDatabase("minions", minions) !== null
  //   ? res.status(201).send(db.addToDatabase("minions", minions))
  //   : res.status(404);
  next();
});

/* ============================= */
/* @ROUTE /api/minions/:minionId */
/* ============================= */

// Get a single minion by id
apiRouter.get("/minions/:minionId", (req, res, next) => {
  const minionId = req.params.minionId;
  const minionAtId = db.getFromDatabaseById("minions", minionId);
  isNaN(Number(minionId)) || minionAtId === null || !minionAtId
    ? res.status(404)
    : res.status(200).send(minionAtId);
  next();
});

// Update a single minion by id
apiRouter.put("/minions/:minionId", (req, res, next) => {
  const minionToUpdate = req.params.minionId;
  console.log(`minion to update id: ${minionToUpdate}`);
  if (
    isNaN(Number(minionToUpdate)) ||
    minionToUpdate === null ||
    !minionToUpdate
  ) {
    res.status(404);
  } else {
    const updateMinionDB = db.updateInstanceInDatabase(
      "minions",
      minionToUpdate
    );
    res.status(200).send(updateMinionDB);
  }

  next();
});

// Delete a single minion by id
apiRouter.delete("/minions/:minionId", (req, res, next) => {
  const minionId = req.params.minionId;
  const deletedMinion = db.deleteFromDatabasebyId("minions", minionId);
  isNaN(Number(minionId)) || deletedMinion === null || !deletedMinion
    ? res.status(404)
    : res.status(204).send(deletedMinion);
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
  const ideas = db.getAllFromDatabase("ideas");
  ideas !== null ? res.status(200).send(ideas) : res.status(404);
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
apiRouter.get("/ideas/:ideaId", (req, res, next) => {
  const ideaId = req.params.ideaId;
  const ideaAtId = db.getFromDatabaseById("ideas", ideaId);
  isNaN(Number(ideaId)) || ideaAtId === null || !ideaAtId
    ? res.status(404)
    : res.status(200).send(ideaAtId);
  next();
});

// Update a single idea by id
apiRouter.put("/ideas/:ideaId", (req, res, next) => {
  next();
});

// Delete a single idea by id
apiRouter.delete("/ideas/:ideaId", (req, res, next) => {
  const ideaId = req.params.ideaId;
  const deletedIdea = db.deleteFromDatabasebyId("ideas", ideaId);
  isNaN(Number(ideaId)) || deletedIdea === null || !deletedIdea
    ? res.status(404)
    : res.status(204).send(deletedIdea);
  next();
});

/* ==================== */
/* @ROUTE /api/meetings */
/* ==================== */

// Get an array of all meetings
apiRouter.get("/meetings", (req, res, next) => {
  const meetings = db.getAllFromDatabase("meetings");
  meetings !== null ? res.status(200).send(meetings) : res.status(404);
  next();
});

// PRETEXT UWU
/* For this route no request body is necessary, as meetings are generated
automatically by the server upon request. Use the provided createMeeting function exported frmo db.js to create a new meeting object. */
// Create a new meeting and save it to the database
apiRouter.post("/meetings", (req, res, next) => {
  const newMeeting = db.createMeeting();
  const addMeeting = db.addToDatabase("meetings", newMeeting);
  addMeeting ? res.status(201).send(addMeeting) : res.status(404);
  next();
});

// Create a new meeting and save it to the database
apiRouter.delete("/meetings", (req, res, next) => {
  const deleteMeetings = db.deleteAllFromDatabase("meetings");
  res.status(204).send(deleteMeetings);
});

module.exports = apiRouter;
