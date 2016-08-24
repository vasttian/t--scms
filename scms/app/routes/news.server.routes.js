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
  
  //参数只有通过验证才能继续
  app.param('nid', PostController.getById);
  app.param('did', PostController.getDelId);

  app.route('/news/:nid')
     .get(PostController.get);
  app.route('/deletenews/:did')
     .get(PostController.delete);
  // app.param('nid', NewsController.getById);
};