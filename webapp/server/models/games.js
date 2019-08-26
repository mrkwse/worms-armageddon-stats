const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Game = sequelize.define('game', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    // Date on which match was played
    date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    filepath: {
      type: Sequelize.STRING,
      allowNull: false
    },
    gameCompleted: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    gameWentToSuddenDeath: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    suddenDeathTimeInS: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    totalDamage: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    totalKills: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    totalTimeInS: {
      type: Sequelize.FLOAT,
      allowNull: false
    }
  }, {
    // options
    createdAt: false,
    updatedAt: false
  })
  return Game;
}
