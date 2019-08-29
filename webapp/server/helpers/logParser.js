const fs = require('fs')

const utilityWeaponNames = [
  "Jet Pack",
  "Low Gravity",
  "Fast Walk",
  "Laser Sight",
  "Ninja Rope",
  "Parachute",
  "Select Worm"
]

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const loadLog = (logFilePath) => {
  const fs = require('fs');
  const array = fs.readFileSync(logFilePath).toString().split("\n");
  return array.map((line) => line.replace(/\r/g,""))
}

const timeToS = (time) => {
  const timeParts = time.split(":")
  return parseFloat(timeParts[2])+parseInt(timeParts[1]*60)+parseInt(timeParts[0]*60*60)
}

const getDate = (event) => {
  return event.split(" ").slice(-3).join(" ")
}

const getTeams = (teamEvents, lanGame) => {
  const teams = [];
  teamEvents.forEach((teamEvent) => {
    const colour = teamEvent.split(':')[0]
    let name;
    if(lanGame) {
      // Green: "tom" as "Super BREAKING" [Local Player] [Host]
      name = teamEvent.split('"').slice(3,-1).join('"')
    } else {
      // Red:  "1-UP"
      name = teamEvent.split('"').slice(1,-1).join('"')
    }
    teams.push({
      name,
      colour, // Not used atm
    })
  })
  return teams;
}

const getGameTeams = (teamModels, teamTimeEvents, winnerEvents, lanGame) => {
  const gameTeams = [];
  let matchFailed = false
  let teamMissing = false
  teamTimeEvents.forEach((teamTimeEvent) => {
    let pattern;
    if(lanGame) {
      // Super BREAKING (tom):   Turn: 00:00:00.00, Retreat: 00:00:00.00, Total: 00:00:00.00, Turn count: 0
      pattern = /^(.*) \(.*\):[ ]*Turn: (.*), Retreat: (.*), Total: (.*), Turn count: (.*)$/;
    } else {
      // 1-UP: Turn: 00:00:00.00, Retreat: 00:00:00.00, Total: 00:00:00.00, Turn count: 1
      pattern = /^(.*):[ ]*Turn: (.*), Retreat: (.*), Total: (.*), Turn count: (.*)$/;
    }
    const match = pattern.exec(teamTimeEvent)
    if(match === null || match.length !== 6) {
      console.log(teamTimeEvent)
      console.log(match)
      matchFailed = true
      return
    }
    const [_, name, turn, retreat, total, count] = match;
    const teamModel = teamModels.find((teamModel) => teamModel.name === name)
    if(teamModel === undefined) {
      teamMissing = true
      return
    }
    gameTeams.push({
      name,
      teamId: teamModel.id,
      turnTime: turn,
      retreatTime: retreat,
      totalTime: total,
      roundCount: count,
      winner: false,
    })
  })
  if(matchFailed){
    return Promise.reject(new Error("Failed to match team time pattern"))
  }
  if(teamMissing){
    return Promise.reject(new Error("Team missing in team time"))
  }
  winnerEvents.forEach((winnerEvent) => {
    const pattern = /(.*) wins the (?:round|match)(?:\.|\!)?/
    const match = pattern.exec(winnerEvent)
    if(match && match.length === 2){
      const winnerTeamName = match[1];
      const gameTeam = gameTeams.find((gameTeam) => gameTeam.name === winnerTeamName)
      if(!gameTeam) {
        return Promise.reject(new Error("Winner not found in gameTeams array"))
      }
      gameTeam.winner = true
    }
  })
  return gameTeams;
}

module.exports = (db) => (logFilePath, finalFilePath, originalFileName) => {
  console.log(`Parsing: ${logFilePath}`)
  const events = loadLog(logFilePath)
  const spaceIndices = []
  events.forEach((event, index) => {
    if(event === "") {
      spaceIndices.push(index);
    }
  })
  let lanGame = false
  const data = {}
  return Promise.resolve()
    .then(() => {
      // Extract details for game table
      let date;
      if(!events[0].includes("Game Started at ")) {
        lanGame = true
        date = getDate(events[1])
      } else {
        date = getDate(events[0])
      }
      return db.models.game.create({
        name: originalFileName,
        date: date,
        filepath: finalFilePath,
        gameCompleted: false,
        gameWentToSuddenDeath: false,
        suddenDeathTimeInS: 0,
        totalDamage: 0,
        totalKills: 0,
        totalTimeInS: 0,
      })
        .then((gameModel) => {
          data.game = gameModel;
        })
    })
    .then(() => {
      // Extract details for team table
      const teamEvents = events.slice(spaceIndices[0]+1, spaceIndices[1])
      return getTeams(teamEvents, lanGame)
    })
    .then((teams) => {
      return Promise.all(teams.map((team) => {
        return db.models.team.findOrCreate({
          where: {
            name: team.name
          },
          defaults: {
            name: team.name
          }
        });
      }))
        .then((teamModels) => {
          data.teams = [].concat(...teamModels.map((tm) => tm[0]));
        })
    })
    .then(() => {
      // Extract details for gameteam table
      const teamTimeEvents = events.slice(spaceIndices[2]+2, spaceIndices[3])
      const winnerEvents = events.slice(spaceIndices[5]+1)

      return getGameTeams(data.teams, teamTimeEvents, winnerEvents, lanGame)
    })
    .then((gameTeams) => {
      return Promise.all(gameTeams.map((gameTeam) => {
        return db.models.gameteam.create({
          gameId: data.game.id,
          teamId: gameTeam.teamId,
          turnTimeInS: timeToS(gameTeam.turnTime),
          retreatTimeInS: timeToS(gameTeam.retreatTime),
          totalTimeInS: timeToS(gameTeam.totalTime),
          roundCount: gameTeam.roundCount,
          winner: gameTeam.winner,
        });
      }))
        .then((gameTeamModels) => {
          data.gameteams = [].concat(...gameTeamModels);
        })
    })
    .then(() => {
      // Extract turn details
      let startTurnIndex = 0
      let firstStart = true
      const turnArrays = []
      const turnEvents = events.slice(spaceIndices[1]+1, spaceIndices[2])
      turnEvents.forEach((turnEvent, index) => {
        const pattern = /starts turn/
        const match = pattern.exec(turnEvent)
        if(match) {
          if(firstStart) {
            firstStart = false
          } else {
            turnArrays.push(
              turnEvents.slice(startTurnIndex, index)
            )
            startTurnIndex = index
          }
        }
      })
      if(firstStart === false) {
        turnArrays.push(
          turnEvents.slice(startTurnIndex, turnEvents.length - 1)
        )
      }
      if(turnEvents[turnEvents.length-1].includes("Game Ends - Round Finished")) {
        data.game.gameCompleted = true;
      }
      data.game.totalTimeInS = timeToS(turnEvents[turnEvents.length-1].substring(1, 12))
      return Promise.all([
        turnArrays,
        data.game.save(),
      ])
    })
    .then(([turnArrays]) => {
      let suddenDeath = false
      let suddenDeathTimeInS;
      let totalKills = 0;
      let totalDamage = 0;
      let turnNumber = 0;
      let roundNumber = 1;
      let playersInRound = []
      return Promise.all(turnArrays.map((turnEvents) => {
        const utilityWeapons = []
        const weapons = []
        let turnStartTime;
        let turnTeam = "";
        let turnEndViaLossOfControl = false;
        let turnTime;
        let retreatTime;
        let changeoverTime;
        const damageArray = []
        turnNumber = turnNumber + 1
        turnEvents.forEach((turnEvent) => {
          // Get Turn Start
          let turnStartPattern;
          if(lanGame) {
            // [00:01:22.10] ��� !"�$%^&*())_-=+` (tom) starts turn
            turnStartPattern = /^\[(.*)\] ��� (.*) \(.*\) starts turn$/
          } else {
            // [00:00:02.24] ��� 1-UP starts turn
            turnStartPattern = /^\[(.*)\] ��� (.*) starts turn$/
          }
          const turnStartMatch = turnStartPattern.exec(turnEvent)
          if(turnStartMatch && turnStartMatch.length === 3) {
            turnStartTime = timeToS(turnStartMatch[1])
            turnTeam = turnStartMatch[2]
            if(playersInRound.includes(turnTeam)) {
              roundNumber = roundNumber + 1
              playersInRound = [turnTeam]
            } else {
              playersInRound.push(turnTeam)
            }
          }

          // Get Weapons
          // [00:00:13.50] ��� 1-UP fires Low Gravity
          const weaponPattern = /^\[(.*)\] .* fires ([^\(]*)(?: \(([0-9]*) sec(?:, min bounce)?\))?$/
          const weaponMatch = weaponPattern.exec(turnEvent)
          if(weaponMatch && weaponMatch.length === 4) {
            const weaponTime = weaponMatch[1]
            const weaponName = weaponMatch[2]
            const weaponTimeout = weaponMatch[3]
            const weapon = utilityWeapons.find(uw => uw.name === weaponName)
            if(weapon) {
              weapon.fires = weapon.fires + 1
            } else {
              utilityWeapons.push({
                name: weaponName,
                fires: 1,
                time: timeToS(weaponTime),
                timeout: weaponTimeout === undefined ? null : parseInt(weaponTimeout)
              })
            }
          }

          // Get Jet Pack Fuel
          // [00:00:10.32] ��� 1-UP used 11 units of Jet Pack fuel
          const fuelPattern = /used ([0-9]*)(?: \([0-9]\))? units of Jet Pack fuel$/
          const fuelMatch = fuelPattern.exec(turnEvent)
          if(fuelMatch && fuelMatch.length === 2) {
            const jetPackWeapon = utilityWeapons.find(uw => uw.name === "Jet Pack")
            jetPackWeapon.fuelUsed = fuelMatch[1]
          }

          // Get Sudden Death
          // [00:19:02.66] ��� Sudden Death
          const suddenDeathPattern = /^\[(.*)\] ��� Sudden Death$/
          const suddenDeathMatch = suddenDeathPattern.exec(turnEvent)
          if(suddenDeathMatch && suddenDeathMatch.length === 2) {
            suddenDeath = true
            suddenDeathTimeInS = timeToS(suddenDeathMatch[1])
          }

          // Get turn time, retreat time, changeover time, turn end via loss of control
          let endTurnPattern;
          if(lanGame) {
            // [00:00:54.82] ��� Super BREAKING (tom) ends turn; time used: 43.60 sec turn, 3.00 sec retreat
            endTurnPattern = new RegExp("\\[(.*)\\] ��� "+ escapeRegExp(turnTeam) + " \\(.*\\) (.*); time used: (.*) sec turn, (.*) sec retreat$");
          } else {
            // [00:18:58.60] ��� 2-UP loses turn due to loss of control; time used: 10.96 sec turn, 0.00 sec retreat
            endTurnPattern = new RegExp("\\[(.*)\\] ��� "+ escapeRegExp(turnTeam) + " (.*); time used: (.*) sec turn, (.*) sec retreat$");
          }

          const endTurnMatch = endTurnPattern.exec(turnEvent)
          if(endTurnMatch && endTurnMatch.length === 5) {
            if(endTurnMatch[2] === "loses turn due to loss of control") {
              turnEndViaLossOfControl = true
            }
            turnTime = parseFloat(endTurnMatch[3])
            retreatTime = parseFloat(endTurnMatch[4])
            changeoverTime = (timeToS(endTurnMatch[1]) - turnStartTime) - turnTime - retreatTime
          }

          // Get damage and kills
          // [00:01:30.82] ��� Damage dealt: 26 to 1-UP
          const damagePattern = /^\[(.*)\] ��� Damage dealt: (.*)$/
          const damageMatch = damagePattern.exec(turnEvent)
          if(damageMatch && damageMatch.length === 3) {
            const damageStringArray = damageMatch[2].split(", ").reverse()
            damageStringArray.forEach((damageString, index, array) => {
              let damageSubPattern;
              if(lanGame) {
                damageSubPattern = /^([0-9]*)(?: \(([0-9]*) kills?\))? to (.*) \(.*\)$/
              } else {
                damageSubPattern = /^([0-9]*)(?: \(([0-9]*) kills?\))? to (.*)$/
              }
              const damageSubMatch = damageSubPattern.exec(damageString)
              if(damageSubMatch && damageSubMatch.length === 4) {
                const kills = damageSubMatch[2] === undefined ? 0 : parseInt(damageSubMatch[2])
                const damage = parseInt(damageSubMatch[1])
                totalKills = totalKills + kills
                totalDamage = totalDamage + damage
                damageArray.push({
                  damage: damage,
                  kills: kills,
                  team: damageSubMatch[3],
                })
              } else {
                // Not parsed correctly. Someone must of used a ', ' in their name.
                array[index] = array[index] + damageString
              }
            })
          }

        })

        if(utilityWeapons.length > 0) {
          if(!utilityWeaponNames.includes(utilityWeapons[utilityWeapons.length -1].name)) {
            weapons.push(utilityWeapons.pop());
          }
        }

        const turnNumberLocal = turnNumber
        const roundNumberLocal = roundNumber

        const promises = []
        data.weapons = []
        data.utilityweapons = []
        data.turns = []
        data.turndamages = []
        data.turnutilityweapons = []

        return Promise.resolve()
          .then(() => {
            return Promise.all(
              weapons.map((weapon) => {
                return db.models.weapon.findOrCreate({
                  where: {
                    name: weapon.name
                  },
                  defaults: {
                    name: weapon.name
                  }
                })
                  .then(([weaponModel]) => {
                    weapon.model = weaponModel
                    if(!data.weapons.find(w => w.name === weaponModel.name)) {
                      data.weapons.push(weaponModel)
                    }
                  })
              })
            )
          })
          .then(() => {
              return Promise.all(
                utilityWeapons.map((utilityWeapon) => {
                  return db.models.utilityweapon.findOrCreate({
                    where: {
                      name: utilityWeapon.name
                    },
                    defaults: {
                      name: utilityWeapon.name
                    }
                  })
                    .then(([utilityWeaponModel]) => {
                      utilityWeapon.model = utilityWeaponModel
                      if(!data.utilityweapons.find(w => w.name === utilityWeaponModel.name)) {
                        data.utilityweapons.push(utilityWeaponModel)
                      }
                    })
                })
              )
          })
          .then(() => {
            const teamModel = data.teams.find((teamModel) => teamModel.name === turnTeam)
            const gameTeamModel = data.gameteams.find((gameTeamModel) => gameTeamModel.teamId === teamModel.id)

            const weaponFired = (weapons.length > 0 && weapons[0].model)
            return db.models.turn.create({
              weaponId: weaponFired ? weapons[0].model.id : null,
              gameteamId: gameTeamModel.id,
              turnNumber: turnNumberLocal,
              roundNumber: roundNumberLocal,
              turnStartTimeInS: turnStartTime,
              turnTimeInS: turnTime,
              retreatTimeInS: retreatTime,
              changeoverTimeInS: changeoverTime,
              lossOfControl: turnEndViaLossOfControl,
              inSuddenDeath: suddenDeath,
              weaponFireTimeInS: weaponFired ? weapons[0].time : null,
              numberOfFires: weaponFired ? weapons[0].fires : null,
              weaponTimeout: weaponFired ? weapons[0].timeout : null,
            })
              .then((turnModel) => {
                data.turns.push(turnModel)
                return turnModel;
              })
          })
          .then((turnModel) => {
            return Promise.all(damageArray.map((damageObj) => {
              const teamModel = data.teams.find((teamModel) => teamModel.name === damageObj.team)

              return db.models.turndamage.create({
                damage: damageObj.damage,
                kills: damageObj.kills,
                turnId: turnModel.id,
                teamId: teamModel.id,
              })
                .then((turndamageModel) => {
                  data.turndamages.push(turndamageModel)
                })
            }))
              .then(() => {
                return turnModel
              })
          })
          .then((turnModel) => {
            return Promise.all(
              utilityWeapons.map((utilityWeapon) => {
                return db.models.turnutilityweapon.create({
                  utilityWeaponFireTimeInS: utilityWeapon.time,
                  numberOfFires: utilityWeapon.fires,
                  jetPackFuel: utilityWeapon.fuelUsed,
                  turnId: turnModel.id,
                  utilityweaponId: utilityWeapon.model.id
                })
                  .then((turnutilityweaponModel) => {
                    data.turnutilityweapons.push(turnutilityweaponModel)
                  })
              })
            )

          })
      }))
        .then(() => {
          data.game.gameWentToSuddenDeath = suddenDeath;
          data.game.suddenDeathTimeInS = suddenDeathTimeInS;
          data.game.totalDamage = totalDamage
          data.game.totalKills = totalKills
          return data.game.save()
        })
    })
    .then(() => {
      // TODO: Awards parsing
    })
    .then(() => {
      console.log(`Finished Parsing: ${logFilePath}`)
      fs.renameSync(logFilePath,finalFilePath)
    })
    // .then(() => {
    //   console.log("DONE")
    //   console.log("Game:", data.game.dataValues)
    //   console.log("Teams:", data.teams.map((a) => a.dataValues))
    //   console.log("GameTeams:", data.gameteams.map((a) => a.dataValues))
    //   console.log("weapons:", data.weapons.map((a) => a.dataValues))
    //   console.log("UtilityWeapons:", data.utilityweapons.map((a) => a.dataValues))
    //   console.log("Turns:", data.turns.map((a) => a.dataValues))
    //   console.log("TurnDamages:", data.turndamages.map((a) => a.dataValues))
    //   console.log("TurnUtilityWeapons:", data.turnutilityweapons.map((a) => a.dataValues))
    // })

}
