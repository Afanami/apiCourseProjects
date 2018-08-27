// Import Express and set up Router
const express = require("express");
const seriesRouter = express.Router();

// Import sqlite and create DB from file
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

/* =================== */
/* @ROUTE /api/series/ */
/* =================== */

// Query database and get all series
seriesRouter.get("/", (req, res, next) => {
  db.all("SELECT * FROM Series", (err, series) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({ series });
    }
  });
});

// Create series and insert into database
seriesRouter.post("/", (req, res, next) => {
  const name = req.body.series.name;
  const description = req.body.series.description;

  // Send 400 error if required body values missing
  if (!name || !description) {
    res.sendStatus(400);
  }

  db.run(
    "INSERT INTO Series (name, description) VALUES ($name, $desc)",
    {
      $name: name,
      $desc: description
    },
    function(err) {
      if (err) {
        next(err);
      } else {
        // Check series inserted correctly
        db.get(
          "SELECT * FROM Series WHERE Series.id = $lastId",
          {
            $lastId: this.lastID
          },
          function(err, series) {
            res.status(201).json({ series });
          }
        );
      }
    }
  );
});

/* ============================ */
/* @ROUTE /api/series/:seriesId */
/* ============================ */

// Set up param router to handle parameter
seriesRouter.param("seriesId", (req, res, next, seriesId) => {
  db.get(
    "SELECT * FROM Series WHERE Series.id = $seriesId",
    {
      $seriesId: seriesId
    },
    (err, series) => {
      // Error checking logic and assignment of series to req if exists
      if (err) {
        next(err);
      } else if (series) {
        req.series = series;
        next();
      } else {
        res.sendStatus(404);
      }
    }
  );
});

// Retrieve series after param route checks validity of series
seriesRouter.get("/:seriesId", (req, res, next) => {
  res.status(200).json({ series: req.series });
});

// Update series after param route checks validity of series
seriesRouter.put("/:seriesId", (req, res, next) => {
  const name = req.body.series.name;
  const description = req.body.series.description;

  // Send 400 error if required body values missing
  if (!name || !description) {
    res.sendStatus(400);
  }

  // Update series based on id
  db.run(
    "UPDATE Series SET name = $name, description = $desc WHERE Series.id = $seriesId",
    {
      $name: name,
      $desc: description,
      $seriesId: req.params.seriesId
    },
    err => {
      if (err) {
        next(err);
      } else {
        // Get updated series and send as json
        db.get(
          "SELECT * FROM Series WHERE Series.id = $seriesId",
          {
            $seriesId: req.params.seriesId
          },
          (err, series) => {
            res.status(200).json({ series });
          }
        );
      }
    }
  );
});

// Delete series from database
seriesRouter.delete("/:seriesId", (req, res, next) => {
  const seriesId = req.params.seriesId;

  // Get series to check exists
  db.get(
    `SELECT * FROM Series WHERE Series.id = ${seriesId}`,
    (err, series) => {
      // Error checking logic and checking if exists
      if (err) {
        next(err);
      } else if (series) {
        // If exists check to see if any issues attached to series
        db.get(
          `SELECT * FROM Issue WHERE Issue.series_id = ${seriesId}`,
          (err, issue) => {
            // Error checking logic and check if issue exists on series
            if (err) {
              next(err);
            } else if (issue) {
              // Cant delete if issue exists
              res.sendStatus(400);
            } else {
              // Delete series if no issue exists
              db.run(
                `DELETE FROM Series WHERE Series.id = ${seriesId}`,
                err => {
                  if (err) {
                    next(err);
                  }
                  // Send proper response code
                  res.sendStatus(204);
                }
              );
            }
          }
        );
      } else {
        // Series doesn't exist
        res.sendStatus(404);
      }
    }
  );
});

const issuesRouter = require("./issues");
seriesRouter.use("/:seriesId/issues", issuesRouter);

module.exports = seriesRouter;
