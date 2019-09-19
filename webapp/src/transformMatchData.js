export default (match) => {
    let turnsByTeam = {}
        match.gameteams.forEach((team) => {
            turnsByTeam[team.team.id] = {
                name: team.team.name,
                turn: [],
                round: [],
                absoluteStart: [],
                absoluteTurnEnd: [],
                totalDamage: [],
                enemyDamage: [],
                friendlyDamage: [],
                kills: [],
                numberOfFires: [],
                ropesFired: [],
            }

            team.turns.forEach((turn) => {
                turnsByTeam[team.team.id].turn.push(turn.turnNumber)
                turnsByTeam[team.team.id].round.push(turn.roundNumber)
                turnsByTeam[team.team.id].absoluteStart.push(turn.turnStartTimeInS)
                turnsByTeam[team.team.id].absoluteTurnEnd.push(turn.turnStartTimeInS + turn.turnTimeInS)

                turnsByTeam[team.team.id].totalDamage.push(turn.turndamages.reduce((acc, curr) => acc += curr.damage, 0))
                turnsByTeam[team.team.id].enemyDamage.push(turn.turndamages.reduce((acc, curr) => acc += curr.teamId !== team.team.id ? curr.damage : 0, 0))
                turnsByTeam[team.team.id].friendlyDamage.push(turn.turndamages.reduce((acc, curr) => acc += curr.teamId === team.team.id ? curr.damage : 0, 0))
                turnsByTeam[team.team.id].kills.push(turn.turndamages.reduce((acc, curr) => acc += curr.kills, 0))
                turnsByTeam[team.team.id].numberOfFires.push(turn.numberOfFires)
                turnsByTeam[team.team.id].ropesFired.push(turn.turnutilityweapons.reduce((acc, curr) => acc += curr.utilityweaponId == 1 ? acc += curr.numberOfFires : 0, 0)) 
            })
        })

    return turnsByTeam
}