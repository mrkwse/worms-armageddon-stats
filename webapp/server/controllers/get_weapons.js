const Sequelize = require('sequelize');
const Op = Sequelize.Op

module.exports = (db) => (req, res) => {
  let gameIds = req.query.gameId || [];
  if (typeof gameIds == 'string') gameIds = [gameIds];
  gameIds = gameIds.map((gameId) => parseInt(gameId));

  let gameWhere = {}
  if(gameIds) {
    gameWhere.id = {
        [Op.or]: gameIds
    }
  }

  let playerIds = req.query.playerId || [];
  if (typeof playerIds == 'string') playerIds = [playerIds];
  playerIds = playerIds.map((playerId) => parseInt(playerId));

  let playerWhere = {}
  if(playerIds) {
    playerWhere = {
      id: {
        [Op.or]: playerIds
      },
    }
  }

  let startDate;
  let endDate;

  if(req.query.startDate) {
    // E.g. startDate=2019-08-26T09:17:53.000Z
    startDate = new Date(req.query.startDate);
    console.log(startDate);
  }

  if(req.query.endDate) {
    // E.g. endDate=2019-08-26T19:17:53.000Z
    endDate = new Date(req.query.endDate);
    console.log(endDate);
  }

  if(startDate && endDate){
    gameWhere.date = {
      [Op.and]: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      }
    }
  } else if(startDate) {
    gameWhere.date = {
      [Op.and]: {
        [Op.gte]: startDate,
      }
    }
  } else if(endDate) {
    gameWhere.date = {
      [Op.and]: {
        [Op.lte]: endDate,
      }
    }
  }

  db.models.team.findAll({
    attributes: [
      'id',
      'name',
      [db.fn('sum', db.col('gameteams.roundCount')), 'totalRoundCount']
    ],
    order: [['name', 'ASC']],
    where: playerWhere,
    group: ['team.id'],
    include: [{
      model: db.models.gameteam,
      attributes: [],
      required: true,
      include: [{
        model: db.models.game,
        attributes: [],
        required: true,
        where: gameWhere,
      }]
    }]
  })
    .then((teams) => {
      return Promise.all(teams.map((team) => {
        return Promise.all([
          db.models.turn.findAll({
            attributes: [
              [db.col('weapon.name'), 'Weapon'],
              [db.fn('count', db.col('turn.numberOfFires')), 'TurnsUsed'],
              [db.fn('sum', db.col('turn.numberOfFires')), 'NumberOfFires'],
            ],
            group: ['weapon.name'],
            where: {
              "weaponId": {
                [Op.not]: null,
              }
            },
            include: [{
              attributes: [],
              model: db.models.weapon
            },{
              model: db.models.gameteam,
              attributes: [],
              required: true,
              include: [{
                model: db.models.game,
                attributes: [],
                required: true,
                where: gameWhere,
              },{
                model: db.models.team,
                attributes: [],
                required: true,
                where: {
                  id: team.id
                }
              }]
            }]
          }),
          team,
        ])
      }))
    })
  // db.models.turn.findAll({
  //   attributes: [
  //     [db.col('gameteam->team.name'), "TeamName"],
  //     [db.col('gameteam.roundCount'), "RoundCount"],
  //     [db.col('weapon.name'), 'Weapon'],
  //     [db.fn('sum', db.col('turn.numberOfFires')), 'Fires']
  //   ],
  //   group: ['gameteam->team.id', 'weapon.name', 'gameteam.roundCount'],
  //   where: {
  //     "weaponId": {
  //       [Op.not]: null,
  //     }
  //   },
  //   include: [{
  //     attributes: [],
  //     model: db.models.weapon
  //   },{
  //     model: db.models.gameteam,
  //     attributes: [],
  //     required: true,
  //     include: [{
  //       model: db.models.team,
  //       attributes: [],
  //     }]
  //   }]
  // })
    // .then((results) => {
    //   const teams = {};
    //   results.forEach((result) => {
    //     const dataValues = result.dataValues;
    //       if(!(teams[dataValues.TeamName])) {
    //       teams[dataValues.TeamName] = {
    //         roundCount: dataValues.RoundCount,
    //         weapons: [],
    //       }
    //     }
    //     teams[dataValues.TeamName].weapons.push({
    //       name: dataValues.Weapon,
    //       fires: dataValues.Fires,
    //     })
    //   })
    //   return teams
    // })

  // db.models.game.findAll({
  //   where: {
  //     id: 151,
  //     //'gameteams->team.name': "Todd"
  //   },
  //   attributes: ['gameteams.id', [db.fn('sum', db.col('gameteams.roundCount')), 'Fires']],
  //   group: ['game.id', 'gameteams.id'],
  //   //
  //   include: [{
  //     model: db.models.gameteam,
  //     // include: [{
  //     //   model: db.models.team,
  //     //   // where: {
  //     //   //   'name': "Todd"
  //     //   // }
  //     // },{
  //     //   model: db.models.turn,
  //     //   include: [{
  //     //     model: db.models.weapon
  //     //   }]
  //     // }]
  //   }]
  // })
    .then((model) => {
        res.json({
          data: model,
          query: {
            startDate,
            endDate,
            gameIds,
            playerIds,
          }
        })
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).send("Internal Server Error");
    })


}
