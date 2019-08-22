const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Team = sequelize.define('team', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
  }, {
    // options
    createdAt: false,
    updatedAt: false
  })
  return Team;
}
