const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const fileUpload = require('express-fileupload');
const Sequelize = require('sequelize');

const config = require('../config.json');
const app = express();

// Option 1: Passing parameters separately
const db = new Sequelize(config.db_name, config.db_username, config.db_password, {
  host: 'localhost',
  port: config.db_port,
  dialect: 'postgres',
  logging: false
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

const logParser = require('./helpers/logParser')(db)

logParser("./uploaded_logs/3e0b8bba-6ae9-42a3-832e-de2df2296731.log", "Custom File").then(() => {console.log("DONES")})

app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use(fileUpload({
  safeFileNames: /\\/g,
  preserveExtension: true,
  limits: { fileSize: 1 * 1024 * 1024 }, // Limit to 1mb upload
}));
app.post('/upload_log', require("./controllers/upload.js")(logParser));

const port = process.env.PORT || 8080
app.listen(port);

console.log('App is listening on port ' + port);
