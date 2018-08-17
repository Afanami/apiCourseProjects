const checkMillionDollarIdea = (req, res, next) => {
  const numWeeks = req.body.numWeeks;
  const weeklyRevenue = req.body.weeklyRevenue;
  const millionDollarIdea = numWeeks * weeklyRevenue;

  if (numWeeks && weeklyRevenue && millionDollarIdea >= 1000000) {
    next();
  } else {
    res.sendStatus(400);
  }
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
