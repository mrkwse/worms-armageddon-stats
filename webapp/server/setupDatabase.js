
module.exports = (db) => {
  const GameFactory = require('./models/games')(db);
  const TeamFactory = require('./models/teams')(db);
  const WormFactory = require('./models/worms')(db);
  const AwardFactory = require('./models/awards')(db);
  const GameAwardFactory = require('./models/gameawards')(db)
  const GameTeamFactory = require('./models/gameteams')(db)
  const UtilityWeaponFactory = require('./models/utilityweapons')(db)
  const WeaponFactory = require('./models/weapons')(db)
  const TurnFactory = require('./models/turns')(db)
  const TurnDamageFactory = require('./models/turndamages')(db)
  const TurnUtilityWeaponFactory = require('./models/turnutilityweapons')(db)

  const disallowNullOptions = {
    foreignKey: {
      allowNull: false
    }
  }
  const allowNullOptions = {
    foreignKey: {
      allowNull: true
    }
  }

  // Adds teamId to worms table
  TeamFactory.hasMany(WormFactory, disallowNullOptions)
  WormFactory.belongsTo(TeamFactory)

  // Add gameId, awardId, teamId to gameawards table
  GameFactory.hasMany(GameAwardFactory, disallowNullOptions)
  GameAwardFactory.belongsTo(GameFactory)
  TeamFactory.hasMany(GameAwardFactory, disallowNullOptions)
  GameAwardFactory.belongsTo(TeamFactory)
  AwardFactory.hasMany(GameAwardFactory, disallowNullOptions)
  GameAwardFactory.belongsTo(AwardFactory)
  WormFactory.hasMany(GameAwardFactory, allowNullOptions)
  GameAwardFactory.belongsTo(WormFactory)

  // Add gameId, teamId to gameteams table
  GameFactory.hasMany(GameTeamFactory, disallowNullOptions)
  GameTeamFactory.belongsTo(GameFactory)
  TeamFactory.hasMany(GameTeamFactory, disallowNullOptions)
  GameTeamFactory.belongsTo(TeamFactory)

  // Add weaponId, gameteamsId to turns table
  WeaponFactory.hasMany(TurnFactory, allowNullOptions)
  TurnFactory.belongsTo(WeaponFactory)
  GameTeamFactory.hasMany(TurnFactory, disallowNullOptions)
  TurnFactory.belongsTo(GameTeamFactory)

  // Add turnId, teamId to turndamages table
  TurnFactory.hasMany(TurnDamageFactory, disallowNullOptions)
  TurnDamageFactory.belongsTo(TurnFactory)
  TeamFactory.hasMany(TurnDamageFactory, disallowNullOptions)
  TurnDamageFactory.belongsTo(TeamFactory)

  // Add turnId, utilityWeaponId to turnutilityweapons table
  TurnFactory.hasMany(TurnUtilityWeaponFactory, disallowNullOptions)
  TurnUtilityWeaponFactory.belongsTo(TurnFactory)
  UtilityWeaponFactory.hasMany(TurnUtilityWeaponFactory, disallowNullOptions)
  TurnUtilityWeaponFactory.belongsTo(UtilityWeaponFactory)


  // Update columns, deleting any data in columns that get changed
  return db.sync({alter: true})
}
