module.exports = (db) => (req, res) => {
  db.models.game.findAll({
    order: [['date', 'ASC'],]
  })
    .then((games) => {
      res.json(games.map(game => ({
        id: game.id,
        name: game.name,
        date: game.date
      })))
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).send("Internal Server Error");
    })


}
