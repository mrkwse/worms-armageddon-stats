const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const UtilityWeapon = sequelize.define('utilityweapon', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
  }, {
    // options
    createdAt: false,
    updatedAt: false
  })
  return UtilityWeapon;
}
