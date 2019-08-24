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
    totalDamage: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    totalKills: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    // Time in seconds
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
