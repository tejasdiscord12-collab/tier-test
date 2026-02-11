require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'tier-tester-secret-key';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';

app.use(cors());
app.use(express.json());

// Middleware to protect admin routes
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const router = express.Router();

// --- Player Routes ---
router.get('/players', (req, res) => {
    db.all("SELECT * FROM players ORDER BY wins DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.get('/players/top', (req, res) => {
    db.all("SELECT * FROM players ORDER BY wins DESC LIMIT 5", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.get('/players/search/:ign', (req, res) => {
    const ign = req.params.ign;
    db.get("SELECT * FROM players WHERE ign LIKE ?", [`%${ign}%`], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: 'Player not found' });
        res.json(row);
    });
});

router.get('/players/:ign', (req, res) => {
    db.get("SELECT * FROM players WHERE LOWER(ign) = LOWER(?)", [req.params.ign], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: 'Player not found' });
        res.json(row);
    });
});

// --- Admin Routes ---
router.post('/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASS) {
        const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '2h' });
        return res.json({ token });
    }
    res.status(401).json({ message: 'Invalid password' });
});

router.post('/admin/players', authenticateToken, (req, res) => {
    const { ign, tier, wins, kills, beds_broken, rank } = req.body;

    const query = `
    INSERT INTO players (ign, tier, wins, kills, beds_broken, rank, last_updated)
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(ign) DO UPDATE SET
      tier = excluded.tier,
      wins = excluded.wins,
      kills = excluded.kills,
      beds_broken = excluded.beds_broken,
      rank = excluded.rank,
      last_updated = CURRENT_TIMESTAMP
  `;

    db.run(query, [ign, tier, wins, kills, beds_broken, rank], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Player updated successfully', ign });
    });
});

router.delete('/admin/players/:ign', authenticateToken, (req, res) => {
    db.run("DELETE FROM players WHERE ign = ?", [req.params.ign], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Player deleted' });
    });
});

// Mount the router on both /api and / to be extra safe with proxies
app.use('/api', router);
app.use(router);

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://127.0.0.1:${PORT}`);
    });
}

module.exports = app;
