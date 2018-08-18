const db = require("./db.js");

const checkMillionDollarIdea = (req, res, next) => {
  if (req.params && req.params.ideaId) {
    if (isNaN(req.params.ideaId)) return res.sendStatus(404);
    if (!db.getFromDatabaseById("ideas", req.params.ideaId))
      return res.sendStatus(404);
  }
  const numWeeks = req.body.numWeeks;
  const weeklyRevenue = req.body.weeklyRevenue;
  const millionDollarIdea = numWeeks * weeklyRevenue;

  if (!numWeeks && !weeklyRevenue) {
    res.sendStatus(400);
  } else if (isNaN(numWeeks) || isNaN(weeklyRevenue)) {
    res.sendStatus(400);
  } else if (millionDollarIdea >= 1000000) {
    next();
  } else {
    res.sendStatus(400);
  }
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
