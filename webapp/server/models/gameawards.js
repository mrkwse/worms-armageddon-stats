const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const GameAward = sequelize.define('gameaward', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    // gameId: {
    //   type: Sequelize.UUID,
    //   references: {
    //       model: 'games',
    //       key: 'id',
    //   },
    //   allowNull: false
    // },
    // awardId: {
    //   type: Sequelize.UUID,
    //   references: {
    //       model: 'awards',
    //       key: 'id',
    //   },
    //   allowNull: false
    // },
    // teamId: {
    //   type: Sequelize.UUID,
    //   references: {
    //       model: 'teams',
    //       key: 'id',
    //   },
    //   allowNull: false
    // },
    // wormId: {
    //   type: Sequelize.UUID,
    //   references: {
    //       model: 'worms',
    //       key: 'id',
    //   },
    //   allowNull: true
    // }
  }, {
    // options
    createdAt: false,
    updatedAt: false
  })
  return GameAward;
}
