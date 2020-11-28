// dotenv loads parameters (port and database config) from .env
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// respond to requests on `/api/users`
app.get('/api/users', (req, res) => {
  // send an SQL query to get all users
  connection.query('SELECT * FROM user', (err, results) => {
    if (err) {
      // If an error has occurred, then the client is informed of the error
      res.status(500).json({
        error: err.message,
        sql: err.sql,
      });
    } else {
      // If everything went well, we send the result of the SQL query as JSON
      res.json(results);
    }
  });
});

app.post('/api/users', (req, res) => {
  const { email, password, name } = req.body;
  connection.query(
    'INSERT INTO user(email, password, name) VALUES(?, ?, ?)',
    [email, password, name],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error saving a User');
      } else {
        res.status(200).send('Successfully saved');
      }
    }
  );
});

app.listen(process.env.PORT, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  }

  console.log(`Server is listening on ${process.env.PORT}`);
});
