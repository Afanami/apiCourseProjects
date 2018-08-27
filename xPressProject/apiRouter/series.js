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

// seriesRouter.delete("/:seriesId", (req, res, next) => {
//   next();
// });

// // Delete series from database
// seriesRouter.delete("/:seriesId", (req, res, next) => {
//   // Set employed to 0 to series based on id
//   db.run(
//     "UPDATE Artist SET is_currently_employed = 0 WHERE Artist.id = $artistId",
//     {
//       $artistId: req.params.artistId
//     },
//     err => {
//       if (err) {
//         next(err);
//       } else {
//         // Get updated artist and send as json
//         db.get(
//           "SELECT * FROM Artist WHERE Artist.id = $artistId",
//           {
//             $artistId: req.params.artistId
//           },
//           (err, artist) => {
//             res.status(200).json({ artist });
//           }
//         );
//       }
//     }
//   );
// });

const issuesRouter = require("./issues");
seriesRouter.use("/:seriesId/issues", issuesRouter);

module.exports = seriesRouter;
