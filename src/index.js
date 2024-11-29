
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./services/db'); // Mock database service

app.use(bodyParser.json());

// Example Route with SQL Injection Vulnerability
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`; // Vulnerable
    db.query(query, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// Example Route with Unvalidated Redirect
app.get('/redirect', (req, res) => {
    const redirectTo = req.query.url;
    res.redirect(redirectTo); // Vulnerable to open redirects
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
