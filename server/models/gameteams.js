const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const GameTeam = sequelize.define('gameteam', {
    winner: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    retreatTimeInS: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    turnTimeInS: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    totalTimeInS: {
      type: Sequelize.INTEGER,
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
