const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const GameTeam = sequelize.define('gameteam', {
    winner: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    retreatTimeInS: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    turnTimeInS: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    totalTimeInS: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    roundCount: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    // options
    createdAt: false,
    updatedAt: false
  })
  return GameTeam;
}
