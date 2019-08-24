const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const GameAward = sequelize.define('gameaward', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
  }, {
    // options
    createdAt: false,
    updatedAt: false
  })
  return GameAward;
}
