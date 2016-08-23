var NewsController = require('../controllers/news.server.controller');

var PostController = require('../controllers/post.server.controller');

module.exports = function(app){
  
  app.route('/news')
    .get(PostController.list)
    .post(PostController.create);


  // app.route('/news')
  //   .get(NewsController.list)
    //.post(NewsController.create);

  // app.route('/news/:nid')
  //   .get(NewsController.get);
  app.route('/news/:nid')
    .get(PostController.get);

  // app.param('nid', NewsController.getById);
  app.param('nid', PostController.getById);


module.exports = function(app){
  app.route('/news')
    .get(NewsController.list)
    .post(NewsController.create);

  app.route('/news/:nid')
    .get(NewsController.get);

  app.param('nid', NewsController.getById);
};