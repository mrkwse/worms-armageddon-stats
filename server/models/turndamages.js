const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const TurnDamage = sequelize.define('turndamage', {
    damage: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    kills: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
  }, {
    // options
    createdAt: false,
    updatedAt: false
  })
  return TurnDamage;
}
