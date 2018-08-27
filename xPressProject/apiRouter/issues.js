// Import Express and set up Router
const express = require("express");
const issuesRouter = express.Router({ mergeParams: true });

// Import sqlite and create DB from file
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

/* =================================== */
/* @ROUTE /api/series/:seriesId/issues */
/* =================================== */

// Get all issues with corresponding series id
issuesRouter.get("/", (req, res, next) => {
  db.all(
    "SELECT * FROM Issue WHERE Issue.series_id = $seriesId",
    { $seriesId: req.params.seriesId },
    (err, issues) => {
      if (err) {
        next(err);
      } else {
        res.status(200).json({ issues });
      }
    }
  );
});

// Post an issue to a series
issuesRouter.post("/", (req, res, next) => {
  // console.log(req.body);
  const name = req.body.issue.name;
  const issueNumber = req.body.issue.issueNumber;
  const publicationDate = req.body.issue.publicationDate;
  const artistId = req.body.issue.artistId;

  // console.log(
  //   "name is " +
  //     name +
  //     "\nissue is " +
  //     issueNumber +
  //     "\npub date is " +
  //     publicationDate +
  //     "\nartist id is " +
  //     artistId +
  //     "\nSeries id is " +
  //     req.params.seriesId
  // );

  // Send 400 error if required body values missing
  if (!name || !issueNumber || !publicationDate || !artistId) {
    res.sendStatus(400);
  }

  // Check artist exists
  db.get(
    "SELECT * FROM Artist WHERE Artist.id = $artistId",
    {
      $artistId: artistId
    },
    (err, artist) => {
      if (err) {
        next(err);
      } else if (artist) {
        // Insert issue
        db.run(
          "INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id) VALUES ($name, $issue, $pub, $artistId, $seriesId)",
          {
            $name: name,
            $issue: issueNumber,
            $pub: publicationDate,
            $artistId: artistId,
            $seriesId: req.params.seriesId
          },
          function(err) {
            if (err) {
              next(err);
            } else {
              // Get issue
              db.get(
                "SELECT * FROM Issue WHERE Issue.id = $lastId",
                {
                  $lastId: this.lastID
                },
                function(err, issue) {
                  res.status(201).json({ issue });
                }
              );
            }
          }
        );
      } else {
        res.sendStatus(400);
      }
    }
  );
});

/* ============================================ */
/* @ROUTE /api/series/:seriesId/issues/:issueId */
/* ============================================ */

// Set up param router to handle parameter
issuesRouter.param("issueId", (req, res, next, issueId) => {
  db.get(
    "SELECT * FROM Issue WHERE Issue.id = $issueId",
    {
      $issueId: issueId
    },
    (err, issue) => {
      // Error checking logic and assignment of issue to req if exists
      if (err) {
        next(err);
      } else if (issue) {
        // console.log(issue);
        req.issue = issue;
        next();
      } else {
        res.sendStatus(404);
      }
    }
  );
});

// Post an issue to a series
issuesRouter.put("/:issueId", (req, res, next) => {
  // console.log(req.body);
  const name = req.body.issue.name;
  const issueNumber = req.body.issue.issueNumber;
  const publicationDate = req.body.issue.publicationDate;
  const artistId = req.body.issue.artistId;

  // console.log(
  //   "name is " +
  //     name +
  //     "\nissue is " +
  //     issueNumber +
  //     "\npub date is " +
  //     publicationDate +
  //     "\nartist id is " +
  //     artistId +
  //     "\nSeries id is " +
  //     req.params.seriesId
  // );

  // Send 400 error if required body values missing
  if (!name || !issueNumber || !publicationDate || !artistId) {
    res.sendStatus(400);
  }

  // Check artist exists
  db.get(
    "SELECT * FROM Artist WHERE Artist.id = $artistId",
    {
      $artistId: artistId
    },
    (err, artist) => {
      if (err) {
        next(err);
      } else if (artist) {
        // console.log(req.params);
        // Update issue
        db.run(
          "UPDATE Issue SET name = $name, issue_number = $issue, publication_date = $pub, artist_id = $artistId, series_id = $seriesId WHERE Issue.id = $issueId",
          {
            $name: name,
            $issue: issueNumber,
            $pub: publicationDate,
            $artistId: artistId,
            $seriesId: req.params.seriesId,
            $issueId: req.params.issueId
          },
          function(err) {
            if (err) {
              next(err);
            } else {
              // Get issue
              db.get(
                "SELECT * FROM Issue WHERE Issue.id = $issueId",
                {
                  $issueId: req.params.issueId
                },
                function(err, issue) {
                  // console.log(issue);
                  res.status(200).json({ issue });
                }
              );
            }
          }
        );
      } else {
        res.sendStatus(400);
      }
    }
  );
});

issuesRouter.delete("/:issueId", (req, res, next) => {
  db.get(
    "SELECT * FROM Issue WHERE Issue.id = $issueId",
    {
      $issueId: req.params.issueId
    },
    (err, issue) => {
      if (err) {
        next(err);
      } else if (issue) {
        db.run(
          "DELETE FROM Issue WHERE Issue.id = $issueId",
          {
            $issueId: issue.id
          },
          err => {
            if (err) {
              next(err);
            }
            res.sendStatus(204);
          }
        );
      } else {
        res.sendStatus(404);
      }
    }
  );
});

module.exports = issuesRouter;
