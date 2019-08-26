const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const fileUpload = require('express-fileupload');
const Sequelize = require('sequelize');
const fs = require('fs');

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

const logParser = require('./helpers/logParser')(db)

app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/game/:game_id/', require("./controllers/get_game.js")(db))
app.get('/game/', require("./controllers/get_games.js")(db))

app.use(fileUpload({
  safeFileNames: /\\/g,
  preserveExtension: true,
  limits: { fileSize: 1 * 1024 * 1024 }, // Limit to 1mb upload
}));
app.post('/upload_log', require("./controllers/upload.js")(logParser));


// Setup database and associations
require('./setupDatabase')(db)
  .then(() => {
    const logsToParse = fs.readdirSync('./logs/toparse/');
    const promiseSerial = funcs =>
      funcs.reduce((promise, func) =>
        promise.then(result =>
          func()),
          Promise.resolve())

    const promiseChain = promiseSerial(logsToParse.map((logToParse) => {
      if(logToParse.split('.').pop() === "log"){
        return () => {
          return Promise.resolve()
            .then(() => {
              return logParser(`./logs/toparse/${logToParse}`, `./logs/parsed/${logToParse}`,logToParse)
            })
        };
      };
      return () => {};
    }))
    return promiseChain;
  })
  .then(() => {
    const port = process.env.PORT || 8080
    app.listen(port);

    console.log('App is listening on port ' + port);
  })
  .catch((err) => {
    console.log('Server Failed to start:', err);
  })
