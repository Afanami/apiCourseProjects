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

// app.post("/", (req, res, next) => {});

/* ============================= */
/* @ROUTE /api/artists/:artistId */
/* ============================= */

artistsRouter.param("artistId", (req, res, next, artistId) => {
  db.get(
    "SELECT * FROM Artist WHERE Artist.id = $artistId",
    {
      $artistId: artistId
    },
    (err, artist) => {
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

artistsRouter.get("/:artistId", (req, res, next) => {
  res.status(200).json({ artist: req.artist });
});

// app.get("/:artistId", (req, res, next) => {});
// app.put("/:artistId", (req, res, next) => {});
// app.delete("/:artistId", (req, res, next) => {});

module.exports = artistsRouter;
