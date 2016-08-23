module.exports = {
  create: function(req, res, next){
    if(!req.query.title || !req.query.content) {
      return next(new Error("params error"));
    }
    console.log('req.models:', req.models);
    req.models.post.create({title: req.query.title, content: req.query.content}, function(err, doc){
      if(err) return next(err);

      return res.json(doc);
    });
  }
}