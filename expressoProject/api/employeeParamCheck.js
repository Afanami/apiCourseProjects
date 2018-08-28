// Import sqlite and create DB from file
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

const employeeParamCheck = (req, res, next, employeeId) => {
  db.get(
    `SELECT * FROM Employee WHERE Employee.id = ${employeeId}`,
    (err, employee) => {
      // Error checking logic and assignment of employee to req if exists
      if (err) {
        next(err);
      } else if (employee) {
        req.employee = employee;
        next();
      } else {
        res.sendStatus(404);
      }
    }
  );
};

module.exports = employeeParamCheck;
