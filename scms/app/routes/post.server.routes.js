var PostController = require('../controllers/post.server.controller');

module.exports = function(app){
  app.route('/post/create')
     .get(PostController.create);
};