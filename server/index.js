const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();

const Sequelize = require('sequelize');
const config = require('../config.json');

// Option 1: Passing parameters separately
const db = new Sequelize(config.db_name, config.db_username, config.db_password, {
  host: 'localhost',
  port: config.db_port,
  dialect: 'postgres'
});

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Setup database and associations 
require('./setupDatabase')(db)

app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 8080
app.listen(port);

console.log('App is listening on port ' + port);
