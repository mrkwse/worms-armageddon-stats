const loadLog = (logFilePath) => {
  const fs = require('fs');
  return fs.readFileSync(logFilePath).toString().split("\r\n");
}

const timeToS = (time) => {
  const timeParts = time.split(":")
  return parseFloat(timeParts[2])+parseInt(timeParts[1]*60)+parseInt(timeParts[0]*60*60)
}

const getDate = (event) => {
  // TODO: Parse timezone (Assume GMT atm)
  // Parses 'Game Started at 2019-08-16 20:34:51 GMT'
  return event.split(" ").slice(-3).join(" ")
}

const getTeams = (teamEvents) => {
  const teams = [];
  teamEvents.forEach((teamEvent) => {
    const colour = teamEvent.split(':')[0]
    const name = teamEvent.split('"').slice(1,-1).join('"')
    teams.push({
      name,
      colour, // Not used atm
    })
  })
  return teams;
}

const getGameTeams = (teamModels, teamTimeEvents, winnerEvent) => {
  const gameTeams = [];
  //const pattern = /^(.*): Turn: (.*), Retreat: (.*), Total: (.*), Turn count: (.*)$/g;
  let matchFailed = false
  let teamMissing = false
  teamTimeEvents.forEach((teamTimeEvent) => {
    const pattern = /^(.*): Turn: (.*), Retreat: (.*), Total: (.*), Turn count: (.*)$/;
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
  if(winnerEvent !== "The round was drawn.") {
    const pattern = /(.*) wins the round./
    const match = pattern.exec(winnerEvent)
    if(!match || match.length !== 2){
      console.log(winnerEvent)
      console.log(match)
      return Promise.reject(new Error("Invalid Winner Statement"))
    }
    const winnerTeamName = match[1];
    const gameTeam = gameTeams.find((gameTeam) => gameTeam.name === winnerTeamName)
    if(!gameTeam) {
      return Promise.reject(new Error("Winner not found in gameTeams array"))
    }
    gameTeam.winner = true
  }
  return gameTeams;
}

module.exports = (db) => (logFilePath, originalFileName) => {
  const events = loadLog(logFilePath)
  const spaceIndices = []
  events.forEach((event, index) => {
    if(event === "") {
      spaceIndices.push(index);
    }
  })
  const data = {}
  Promise.resolve()
    .then(() => {
      // Extract details for game table
      const date = getDate(events[0])
      console.log(db.models)

      return db.models.game.create({
        name: originalFileName,
        date: date,
        filepath: logFilePath,
        gameCompleted: false,
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
      return getTeams(teamEvents)
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
          data.teams = [].concat(...teamModels);
        })
    })
    .then(() => {
      // Extract details for gameteam table
      const teamTimeEvents = events.slice(spaceIndices[2]+2, spaceIndices[3])
      const winnerEvent = events.slice(spaceIndices[5]+1, spaceIndices[5]+2)[0]

      const gameTeams = getGameTeams(data.teams, teamTimeEvents, winnerEvent)

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
      const turnArrays = []
      const turnEvents = events.slice(spaceIndices[1]+1, spaceIndices[2])
      turnEvents.forEach((turnEvent, index) => {
        const pattern = /starts turn/
        const match = pattern.exec(turnEvent)
        if(match) {
          if(startTurnIndex !== index){
            turnArrays.push(
              turnEvents.slice(startTurnIndex, index)
            )
          }
          startTurnIndex = index
        }
      })
      if(startTurnIndex !== turnEvents.length - 1) {
        turnArrays.push(
          turnEvents.slice(startTurnIndex, turnEvents.length - 1)
        )
         if(turnEvents[turnEvents.length-1].includes("Game Ends - Round Finished")) {
           data.game.gameCompleted = true;
           return Promise.all([
             turnEvents,
             data.game.save(),
           ])
         }
      }
      return Promise.all([
        turnEvents
      ])
    })
    .then(([turnEvents]) => {
      // Extract Award details

    })

  console.log(events)
}
