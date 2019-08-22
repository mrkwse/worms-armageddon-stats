const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Weapon = sequelize.define('weapon', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
  }, {
    // options
    createdAt: false,
    updatedAt: false
  })
  return Weapon;
}
