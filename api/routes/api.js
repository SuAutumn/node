exports.user = (req, res, next) => {
  let userId = req.params.id;
  if (!userId) return res.send(404)
  res.json({
    name: 'zhangp'
  })
}

exports.image = (req, res, next) => {
  res.json({
    src: `http://${req.host}:3000/static/media/1.jpg`
  })
}