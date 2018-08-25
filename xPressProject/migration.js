const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS Strip`);
  db.run(
    `CREATE TABLE Strip (id INT PRIMARY KEY, head TEXT NOT NULL, body TEXT NOT NULL, background TEXT NOT NULL, bubble_type TEXT NOT NULL, bubble_text TEXT NOT NULL DEFAULT "", caption TEXT NOT NULL DEFAULT "");`
  );
});
