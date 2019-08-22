const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Award = sequelize.define('award', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
  }, {
    // options
    createdAt: false,
    updatedAt: false
  })
  return Award;
}
