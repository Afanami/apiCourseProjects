// Import Express and set up Router
const express = require("express");
const artistsRouter = express.Router();

// Import sqlite and create DB from file
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

/* ==================== */
/* @ROUTE /api/artists/ */
/* ==================== */

// Query database and get all employed artists
artistsRouter.get("/", (req, res, next) => {
  db.all(
    "SELECT * FROM Artist WHERE Artist.is_currently_employed = 1",
    (err, artists) => {
      if (err) {
        next(err);
      } else {
        res.status(200).json({ artists });
      }
    }
  );
});

// Create artist and insert into database
artistsRouter.post("/", (req, res, next) => {
  const name = req.body.artist.name;
  const dateOfBirth = req.body.artist.dateOfBirth;
  const biography = req.body.artist.biography;

  // Send 400 error if required body values missing
  if (!name || !dateOfBirth || !biography) {
    res.sendStatus(400);
  }

  let isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed;
  // Set employment status if does not exist
  if (!isCurrentlyEmployed) {
    isCurrentlyEmployed = 1;
  }

  console.log(
    `Name is ${name}, \nDOB is ${dateOfBirth}, \nBiography is ${biography}, \nEmployment Status is ${isCurrentlyEmployed}`
  );

  db.run(
    "INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed) VALUES ($name, $dob, $bio, $employed)",
    {
      $name: name,
      $dob: dateOfBirth,
      $bio: biography,
      $employed: isCurrentlyEmployed
    },
    function(err) {
      if (err) {
        next(err);
      } else {
        // Check artist inserted correctly
        db.get(
          "SELECT * FROM Artist WHERE Artist.id = $lastId",
          {
            $lastId: this.lastID
          },
          function(err, artist) {
            res.status(201).json({ artist });
          }
        );
      }
    }
  );
});

/* ============================= */
/* @ROUTE /api/artists/:artistId */
/* ============================= */

// Set up param router to handle parameter
artistsRouter.param("artistId", (req, res, next, artistId) => {
  db.get(
    "SELECT * FROM Artist WHERE Artist.id = $artistId",
    {
      $artistId: artistId
    },
    (err, artist) => {
      // Error checking logic and assignment of artist to req if exists
      if (err) {
        next(err);
      } else if (artist) {
        req.artist = artist;
        next();
      } else {
        res.sendStatus(404);
      }
    }
  );
});

// Retrieve artist after param route checks validity of artist
artistsRouter.get("/:artistId", (req, res, next) => {
  res.status(200).json({ artist: req.artist });
});

// app.get("/:artistId", (req, res, next) => {});
// app.put("/:artistId", (req, res, next) => {});
// app.delete("/:artistId", (req, res, next) => {});

module.exports = artistsRouter;
