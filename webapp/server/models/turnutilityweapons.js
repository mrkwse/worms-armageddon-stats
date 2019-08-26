const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const TurnUtilityWeapon = sequelize.define('turnutilityweapon', {
    utilityWeaponFireTimeInS: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    numberOfFires: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    // Timeout set on throwables
    jetPackFuel: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  }, {
    // options
    createdAt: false,
    updatedAt: false
  })
  return TurnUtilityWeapon;
}
