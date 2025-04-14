const sqlite3 = require('sqlite3').verbose();
const { join } = require('path');

const dbPath = join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

const createSubmissionTableQuery = `
  CREATE TABLE IF NOT EXISTS submission (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userid TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    imageurl TEXT NOT NULL
  );
`

const createVoteTableQuery = `
  CREATE TABLE IF NOT EXISTS vote (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submissionid INTEGER NOT NULL,
    userid TEXT NOT NULL,
    FOREIGN KEY (submissionid) REFERENCES submission(id)
  );
`

db.run(createSubmissionTableQuery, function (err) {
    if (err) {
        console.error('Error creating table: ' + err.message);
    } else {
        console.log('Table created or already exists.');
    }
});

db.run(createVoteTableQuery, function (err) {
    if (err) {
        console.error('Error creating table: ' + err.message);
    } else {
        console.log('Table created or already exists.');
    }
});

db.close((err) => {
    if (err) {
        console.error('Error closing database: ' + err.message);
    } else {
        console.log('Database connection closed.');
    }
});
