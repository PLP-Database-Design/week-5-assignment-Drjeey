require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();

// Database connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database');
});

app.use(express.json());

// Endpoint 1: Retrieve all patients
app.get('/patients', (req, res) => {
  const query = `SELECT patient_id, first_name, last_name, date_of_birth FROM patients`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

// Endpoint 2: Retrieve all providers
app.get('/providers', (req, res) => {
  const query = `SELECT first_name, last_name, provider_specialty FROM providers`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

// Endpoint 3: Filter patients by First Name
app.get('/patients/filter', (req, res) => {
  const { first_name } = req.query;
  const query = `SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?`;
  db.query(query, [first_name], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

// Endpoint 4: Retrieve all providers by Specialty
app.get('/providers/specialty', (req, res) => {
  const { provider_specialty } = req.query;
  const query = `SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?`;
  db.query(query, [provider_specialty], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
