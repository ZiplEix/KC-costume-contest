const sqlite3 = require('sqlite3').verbose();
const { join } = require('path');
const fs = require('fs');

// const dbDir = join(__dirname, 'db');
const dbDir = join('/', 'data');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}

const dbPath = join(dbDir, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.run("PRAGMA foreign_keys = ON;");

const createSubmissionTableQuery = `
  CREATE TABLE IF NOT EXISTS submission (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    imageurl TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`;

const createVoteTableQuery = `
  CREATE TABLE IF NOT EXISTS vote (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submissionid INTEGER NOT NULL,
    userid TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submissionid) REFERENCES submission(id) ON DELETE CASCADE
  );
`;

db.serialize(() => {
    db.run(createSubmissionTableQuery, function (err) {
        if (err) {
            console.error('Error creating submission table: ' + err.message);
        } else {
            console.log('Submission table created or already exists.');
        }
    });

    db.run(createVoteTableQuery, function (err) {
        if (err) {
            console.error('Error creating vote table: ' + err.message);
        } else {
            console.log('Vote table created or already exists.');
        }
    });
});

db.close((err) => {
    if (err) {
        console.error('Error closing database: ' + err.message);
    } else {
        console.log('Database connection closed.');
    }
});
