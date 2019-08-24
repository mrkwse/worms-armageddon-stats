const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Turn = sequelize.define('turn', {
    turnNumber: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    roundNumber: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    turnStartTime: {
      type: Sequelize.DATE,
      allowNull: false
    },
    turnTimeInS: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    retreatTimeInS: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    changeoverTimeInS: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    lossOfControl: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    inSuddenDeath: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    weaponFireTime: {
      type: Sequelize.DATE,
      allowNull: false
    },
    numberOfFires: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    // Timeout set on throwables
    weaponTimeout: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  }, {
    // options
    createdAt: false,
    updatedAt: false
  })
  return Turn;
}
