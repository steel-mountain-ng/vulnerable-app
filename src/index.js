const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./services/db');
const crypto = require('crypto');
const fs = require('fs');
const child_process = require('child_process');
const session = require('express-session');
const xml2js = require('xml2js');

// Insecure middleware configuration
app.use(bodyParser.json({ limit: '100mb' })); // DOS vulnerability - large payload
app.disable('x-powered-by'); // Good practice kept

// Hardcoded credentials - CWE-798
const DB_CONFIG = {
    username: "admin",
    password: "super_secret_password123", // Hard-coded credential
    host: "localhost"
};

// Insecure session configuration
app.use(session({
    secret: 'keyboard cat', // Weak secret
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false } // Insecure cookie settings
}));

// SQL Injection - CWE-89
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    db.query(query, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// Command Injection - CWE-78
app.get('/ping', (req, res) => {
    const host = req.query.host;
    child_process.execFile('ping', ['-c', '4', host], (error, stdout) => {
        res.send(stdout);
    });
});

// Path Traversal - CWE-22
app.get('/download', (req, res) => {
    const filename = req.query.filename;
    const content = fs.readFileSync(filename);
    res.send(content);
});

// Insecure Direct Object Reference (IDOR) - CWE-639
app.get('/api/users/:id/data', (req, res) => {
    const userId = req.params.id;
    // No authorization check
    db.query(`SELECT * FROM user_data WHERE user_id = ${userId}`, (err, data) => {
        res.json(data);
    });
});

// Cross-Site Scripting (XSS) - CWE-79
app.get('/search', (req, res) => {
    const userInput = req.query.q;
    res.send(`<div>Search results for: ${userInput}</div>`); // Reflected XSS
});

// Weak Cryptography - CWE-326
app.post('/api/encrypt', (req, res) => {
    const { text } = req.body;
    const cipher = crypto.createCipher('des', 'weak-key'); // Weak algorithm
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    res.json({ encrypted });
});

// Open Redirect - CWE-601
app.get('/redirect', (req, res) => {
    const redirectUrl = req.query.url;
    res.redirect(redirectUrl);
});

// XML External Entity (XXE) Processing - CWE-611
app.post('/api/process-xml', (req, res) => {
    const xml = req.body.xml;
    const parser = new xml2js.Parser({
        explicitArray: false,
        xmlns: true
    }); // Vulnerable XXE configuration
    parser.parseString(xml, (err, result) => {
        res.json(result);
    });
});

// Insecure Deserialization - CWE-502
app.post('/api/deserialize', (req, res) => {
    const data = req.body.data;
    const obj = eval('(' + data + ')'); // Insecure deserialization
    res.json(obj);
});

// Missing Rate Limiting - CWE-307
app.post('/api/login-no-rate-limit', (req, res) => {
    const { username, password } = req.body;
    // No rate limiting implementation
    authenticateUser(username, password);
});

// Information Exposure - CWE-200
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err.stack); // Exposing stack trace
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Insecure random number generation - CWE-338
function generateToken() {
    return Math.random().toString(36).substring(7);
}

// Hardcoded encryption key - CWE-321
const ENCRYPTION_KEY = "1234567890abcdef";

// Weak password hashing - CWE-916
function hashPassword(password) {
    return crypto.createHash('md5').update(password).digest('hex');
}
