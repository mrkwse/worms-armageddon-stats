module.exports = (db) => (req, res) => {
  db.models.game.findAll({
    where: {
      id: req.params.game_id,
    },
    include: [{
      model: db.models.gameteam,
      include: [{
        model: db.models.team
      },{
        model: db.models.turn,
        include: [{
          model: db.models.weapon
        },{
          model: db.models.turndamage,
          include: [{
            model: db.models.team
          }]
        },{
          model: db.models.turnutilityweapon,
          include: [{
            model: db.models.utilityweapon
          }]
        }]
      }]
    }]
  })
    .then((model) => {
      if(model.length > 0) {
        model[0].gameteams = model[0].gameteams.sort((a,b) => {
          if(a.teamId < b.teamId) {
            return -1
          }
          if(a.teamId > b.teamId) {
            return 1
          }
          return 0
        })
        model[0].gameteams.forEach((gt) => {
          gt.turns = gt.turns.sort((a,b) => {
            if(a.roundNumber < b.roundNumber) {
              return -1
            }
            if(a.roundNumber > b.roundNumber) {
              return 1
            }
            return 0
          })
        })
        res.json(model)
      } else {
        res.status(400).send("Not Found")
      }
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).send("Internal Server Error");
    })


}
