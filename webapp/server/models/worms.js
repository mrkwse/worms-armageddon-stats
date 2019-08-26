const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Worm = sequelize.define('worm', {
    furtherAwardDetail: {
      type: Sequelize.STRING,
      allowNull: false
    },
  }, {
    // options
    createdAt: false,
    updatedAt: false
  })
  return Worm;
}
