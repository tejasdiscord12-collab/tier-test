const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS players (
      ign TEXT PRIMARY KEY,
      tier TEXT DEFAULT 'Unranked',
      wins INTEGER DEFAULT 0,
      kills INTEGER DEFAULT 0,
      beds_broken INTEGER DEFAULT 0,
      rank TEXT DEFAULT 'Player',
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Add a sample player if the table is empty
  db.get("SELECT COUNT(*) as count FROM players", (err, row) => {
    if (row.count === 0) {
      db.run("INSERT INTO players (ign, tier, wins, kills, beds_broken, rank) VALUES (?, ?, ?, ?, ?, ?)", 
        ['Tejas', 'God', 1000, 5000, 2000, 'Admin']
      );
    }
  });

  console.log('Database initialized at', dbPath);
});

module.exports = db;
