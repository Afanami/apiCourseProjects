// Import express files and routers
const express = require("express");
const timesheetsRouter = express.Router({ mergeParams: true });

// Import sqlite and create DB from file
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

const employeeParamCheck = require("./employeeParamCheck");

/* ============================================= */
/* @ROUTE /api/employees/:employeeId/timesheets/ */
/* ============================================= */

// Get all issues with corresponding series id
timesheetsRouter.get("/", (req, res, next) => {
  db.all(
    "SELECT * FROM Timesheet WHERE Timesheet.employee_id = $employeeId",
    { $employeeId: req.params.employeeId },
    (err, timesheets) => {
      if (err) {
        next(err);
      } else {
        res.status(200).json({ timesheets });
      }
    }
  );
});

// Post a timesheet to an employee
timesheetsRouter.post("/", employeeParamCheck, (req, res, next) => {
  const hours = req.body.timesheet.hours;
  const rate = req.body.timesheet.rate;
  const date = req.body.timesheet.date;
  const employeeId = req.params.employeeId;

  // Send 400 error if required body values missing
  if (!hours || !rate || !date) {
    res.sendStatus(400);
  }

  db.run(
    `INSERT INTO Timesheet (hours, rate, date, employee_id) VALUES (${hours}, ${rate}, ${date}, ${employeeId})`,
    function(err) {
      if (err) {
        next(err);
      } else {
        // Get issue
        db.get(
          "SELECT * FROM Timesheet WHERE Timesheet.id = $lastId",
          {
            $lastId: this.lastID
          },
          function(err, timesheet) {
            res.status(201).json({ timesheet });
          }
        );
      }
    }
  );
});

/* ========================================================= */
/* @ROUTE /api/employees/:employeeId/timesheets/:timesheetId */
/* ========================================================= */

// Set up param router to handle parameter
timesheetsRouter.param(
  "timesheetId",
  employeeParamCheck,
  (req, res, next, timesheetId) => {
    db.get(
      `SELECT * FROM Timesheet WHERE Timesheet.id = ${timesheetId}`,
      (err, timesheet) => {
        // Error checking logic and assignment of timesheet to req if exists
        if (err) {
          next(err);
        } else if (timesheet) {
          req.timesheet = timesheet;
          next();
        } else {
          res.sendStatus(404);
        }
      }
    );
  }
);

// Post a timesheet to an employee
timesheetsRouter.put("/:timesheetId", (req, res, next) => {
  // console.log(
  //   "I am body = " +
  //     JSON.stringify(req.body) +
  //     "\nI am params = " +
  //     JSON.stringify(req.params)
  // );
  const hours = req.body.timesheet.hours;
  const rate = req.body.timesheet.rate;
  const date = req.body.timesheet.date;
  const employeeId = req.params.employeeId;
  const timesheetId = req.params.timesheetId;

  // Send 400 error if required body values missing
  if (!hours || !rate || !date) {
    res.sendStatus(400);
  }

  // Update timesheet
  db.run(
    `UPDATE Timesheet SET hours = ${hours}, rate = ${rate}, date = ${date}, employee_id = ${employeeId} WHERE Timesheet.id = ${timesheetId}`,
    function(err) {
      if (err) {
        next(err);
      } else {
        // Get timesheet
        db.get(
          `SELECT * FROM Timesheet WHERE Timesheet.id = ${timesheetId}`,
          function(err, timesheet) {
            res.status(200).json({ timesheet });
          }
        );
      }
    }
  );
});

// Delete timesheet
timesheetsRouter.delete("/:timesheetId", (req, res, next) => {
  const timesheetId = req.params.timesheetId;

  db.run(`DELETE FROM Timesheet WHERE Timesheet.id = ${timesheetId}`, err => {
    if (err) {
      next(err);
    }
    res.sendStatus(204);
  });
});

module.exports = timesheetsRouter;
