const db = require("./db.js");
const checkMillionDollarIdea = require("./checkMillionDollarIdea.js");
const express = require("express");
const apiRouter = express.Router();

let workId = 0;

// PRETEXT UWU
/* For all /api/minions and /api/ideas routes, any POST or PUT requests will send their new/updated resources in the request body. POST request bodies will not have an id property, you will have to set it based on the next id in sequence. */

/* =================== */
/* @ROUTE /api/minions */
/* =================== */

// Check if minion exists and return an array of all minions
apiRouter.get("/minions", (req, res, next) => {
  const minions = db.getAllFromDatabase("minions");
  minions !== null ? res.status(200).send(minions) : res.sendStatus(404);
});

// Create a new minion and save it to the database
apiRouter.post("/minions", (req, res, next) => {
  const newMinion = db.addToDatabase("minions", req.body);
  newMinion !== null ? res.status(201).send(newMinion) : res.sendStatus(404);
});

/* ============================= */
/* @ROUTE /api/minions/:minionId */
/* ============================= */

// Get a single minion by id
apiRouter.get("/minions/:minionId", (req, res, next) => {
  const minionId = req.params.minionId;
  const minionAtId = db.getFromDatabaseById("minions", minionId);
  isNaN(Number(minionId)) || minionAtId === null || !minionAtId
    ? res.sendStatus(404)
    : res.status(200).send(minionAtId);
});

// Update a single minion by id
apiRouter.put("/minions/:minionId", (req, res, next) => {
  const minionToUpdate = req.params.minionId;
  const minionExists = db.getFromDatabaseById("minions", minionToUpdate);
  if (isNaN(Number(minionToUpdate)) || minionExists === null || !minionExists) {
    res.sendStatus(404);
  } else {
    db.updateInstanceInDatabase("minions", req.body);
    const getUpdatedMinion = db.getFromDatabaseById("minions", minionToUpdate);
    req.body = getUpdatedMinion;
    res.status(200).send(req.body);
  }
});

// Delete a single minion by id
apiRouter.delete("/minions/:minionId", (req, res, next) => {
  const minionId = req.params.minionId;
  const deletedMinion = db.deleteFromDatabasebyId("minions", minionId);
  isNaN(Number(minionId)) || deletedMinion === null || !deletedMinion
    ? res.sendStatus(404)
    : res.status(204).send(deletedMinion);
});

/* ========== */
/* BONUS MEME */
/* ========== */
// /* ================================== */
// /* @ROUTE /api/minions/:minionId/work */
// /* ================================== */

// Get an array of all work for specified minion
apiRouter.get("/minions/:minionId/work", (req, res, next) => {
  const minionId = req.params.minionId;
  const minionExists = db.getFromDatabaseById("minions", minionId);
  let work = db.getAllFromDatabase("work");
  let workById = [];
  work.map(work => {
    if (work.minionId === minionId) {
      workById.push(work);
    }
  });

  isNaN(Number(minionId)) || workById === null || !minionExists
    ? res.sendStatus(404)
    : res.status(200).send(workById);
});

// Create a new work object and save it to the database
apiRouter.post("/minions/:minionId/work", (req, res, next) => {
  const newWork = req.body;
  newWork.minionId = req.params.minionId;
  const workExists = db.addToDatabase("work", newWork);
  workExists !== null ? res.status(201).send(req.body) : res.sendStatus(404);
});

// /* ========================================== */
// /* @ROUTE /api/minions/:minionId/work/:workId */
// /* ========================================== */

// Update a single work by id
apiRouter.put("/minions/:minionId/work/:workId", (req, res, next) => {
  const workId = req.params.workId;
  const minionId = req.params.minionId;
  const workExists = db.getFromDatabaseById("work", workId);
  const minionExists = db.getFromDatabaseById("minions", minionId);

  if (
    isNaN(Number(workId)) ||
    workExists === null ||
    !workExists ||
    minionExists === null ||
    !minionExists
  ) {
    res.sendStatus(404);
  } else if (workExists.minionId !== minionId) {
    console.log(
      `else if work exists minion id: ${
        workExists.minionId
      } minion id: ${minionId}`
    );
    res.sendStatus(400);
  } else {
    db.updateInstanceInDatabase("work", req.body);
    const getUpdatedWork = db.getFromDatabaseById("work", workId);
    req.body = getUpdatedWork;
    res.status(200).send(req.body);
  }
});

// Delete a single work by id
apiRouter.delete("/minions/:minionId/work/:workId", (req, res, next) => {
  const workId = req.params.workId;
  const workExists = db.getFromDatabaseById("work", workId);
  const deleteWork = db.deleteFromDatabasebyId("work", workId);

  workExists ? res.status(204).send(deleteWork) : res.sendStatus(404);
});
/* ========== */
/* BONUS MEME */
/* ========== */

/* ================= */
/* @ROUTE /api/ideas */
/* ================= */

// Get an array of all ideas
apiRouter.get("/ideas", (req, res, next) => {
  const ideas = db.getAllFromDatabase("ideas");
  ideas !== null ? res.status(200).send(ideas) : res.sendStatus(404);
});

// Create a new idea and save it to the database
apiRouter.post("/ideas", checkMillionDollarIdea, (req, res, next) => {
  const ideasArray = db.getAllFromDatabase("ideas");

  req.body.id = ideasArray.length;

  const newIdea = db.addToDatabase("ideas", req.body);
  newIdea !== null ? res.status(201).send(newIdea) : res.sendStatus(404);
});

/* ========================= */
/* @ROUTE /api/ideas/:ideaId */
/* ========================= */

// Get a single idea by id
apiRouter.get("/ideas/:ideaId", (req, res, next) => {
  const ideaId = req.params.ideaId;
  const ideaExists = db.getFromDatabaseById("ideas", ideaId);
  isNaN(Number(ideaId)) || ideaExists === null || !ideaExists
    ? res.sendStatus(404)
    : res.status(200).send(ideaExists);
});

// Update a single idea by id
apiRouter.put("/ideas/:ideaId", checkMillionDollarIdea, (req, res, next) => {
  const ideaId = req.params.ideaId;
  const ideaExists = db.getFromDatabaseById("ideas", ideaId);
  if (isNaN(Number(ideaId)) || ideaExists === null || !ideaExists) {
    res.sendStatus(404);
  } else {
    db.updateInstanceInDatabase("ideas", req.body);
    const getUpdatedIdea = db.getFromDatabaseById("ideas", ideaId);
    req.body = getUpdatedIdea;
    res.status(200).send(req.body);
  }
});

// Delete a single idea by id
apiRouter.delete("/ideas/:ideaId", (req, res, next) => {
  const ideaId = req.params.ideaId;
  const deletedIdea = db.deleteFromDatabasebyId("ideas", ideaId);
  isNaN(Number(ideaId)) || deletedIdea === null || !deletedIdea
    ? res.sendStatus(404)
    : res.status(204).send(deletedIdea);
});

/* ==================== */
/* @ROUTE /api/meetings */
/* ==================== */

// Get an array of all meetings
apiRouter.get("/meetings", (req, res, next) => {
  const meetings = db.getAllFromDatabase("meetings");
  meetings !== null ? res.status(200).send(meetings) : res.sendStatus(404);
});

// PRETEXT UWU
/* For this route no request body is necessary, as meetings are generated
automatically by the server upon request. Use the provided createMeeting function exported frmo db.js to create a new meeting object. */
// Create a new meeting and save it to the database
apiRouter.post("/meetings", (req, res, next) => {
  const newMeeting = db.createMeeting();
  const addMeeting = db.addToDatabase("meetings", newMeeting);
  addMeeting ? res.status(201).send(addMeeting) : res.sendStatus(404);
});

// Create a new meeting and save it to the database
apiRouter.delete("/meetings", (req, res, next) => {
  const deleteMeetings = db.deleteAllFromDatabase("meetings");
  res.status(204).send(deleteMeetings);
});

module.exports = apiRouter;
