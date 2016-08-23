// module.exports = {
//   create: function(req, res, next){
//     if(!req.query.title || !req.query.content) {
//       return next(new Error("params error"));
//     }
//     console.log('req.models:', req.models);
//     req.models.post.create({title: req.query.title, content: req.query.content}, function(err, doc){
//       if(err) return next(err);

//       return res.json(doc);
//     });
//   }
// }
// 
// 
var redisClient = require('../../config/redis');

const REDIS_NEWS_PREFIX = 'news_';

var getNewsFromMongo = function(req, id, cb) {
  console.log('run getNewsFromMongo');
  // console.log('find_id1:',id);
  req.models.post.findOne({id: id}).exec(function(err, doc) {
    if(doc) {
      console.log('save mongo doc to redis');
      redisClient.set(REDIS_NEWS_PREFIX + id, JSON.stringify(doc));
    }
    return cb(err, doc);
  });
};
var getNewsFromRedis = function(req, id, cb) {
  console.log('run getNewsFromRedis');
  redisClient.get(REDIS_NEWS_PREFIX + id, function(err, v) {
    if(err) return cb(err, null);
    if(!v) {
      console.log('doc not in redis');
      return cb(null, null);
    }
    try {
      v = JSON.parse(v);
    } catch(e) {
      return cb(e, null);
    }
    console.log('get doc from redis');
    return cb(err, v);
  });
};

module.exports = {
  create: function(req, res, next){
    var message = {
      // createTime: 'shenzhen123',
      title: req.body.title,
      content: req.body.content
    }
    //console.log('req.models:', req.models);
    console.log('message:', message);
    req.models.post.create(message, function(err, doc){
      if(err) return next(err);
      return res.json(doc);
    });
  },

  // 获取列表
  list: function(req, res, next){
    
    req.models.post.find().exec(function(err, docs){
      if(err) return next(err);
       console.log("docs:",docs);
      return res.json(docs);
    });
  },
  // 处理路由参数
  getById: function(req, res, next, id){
    console.log('getById:',id);
    if(!id) return next(new Error('News not Found'));
    getNewsFromRedis(req, id, function(err, doc){
      if(err) return next(err);

      if(!doc) {
          // console.log('req1',req.body);
        getNewsFromMongo(req, id, function(err, doc){
          if(err) return next(err);

          if(!doc) {
            return next(new Error('News not Found'));
          }
          req.news = doc;
          return next();
        })
      } else {
        req.news = doc;
        return next();
      }
    })
  },
  // 获取新闻详情
  get: function(req, res, next) {
    return res.json(req.news);
  }
  
}

