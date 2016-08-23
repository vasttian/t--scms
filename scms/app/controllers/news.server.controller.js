var mongoose = require('mongoose');
var News = mongoose.model('News');
var redisClient = require('../../config/redis');

const REDIS_NEWS_PREFIX = 'news_';

var getNewsFromMongo = function(id, cb){
  console.log('run getNewsFromMongo');
  News
  .findOne({_id: id})
  .exec(function(err, doc){
    if(doc) {
      console.log('save mongo doc to redis');
      redisClient.set(REDIS_NEWS_PREFIX + id, JSON.stringify(doc));
    }
    return cb(err, doc);
  });
};
var getNewsFromRedis = function(id, cb){
  console.log('run getNewsFromRedis');
  redisClient.get(REDIS_NEWS_PREFIX + id, function(err, v){
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
  // 新闻的创建
  create: function(req, res, next){
    var news = new News(req.body);
    news.save(function(err){
      if(err) return next(err);

      return res.json(news);
    });
  },

  // 获取列表
  list: function(req, res, next){
    // 对于这两个参数，还需要思考，如果用户传入负数怎么办
    var pagesize = parseInt(req.query.pagesize, 10) || 10;
    var pagestart = parseInt(req.query.pagestart, 10) || 1;

    News
    .find()
    // 搜索时，跳过的条数
    .skip( (pagestart - 1) * pagesize )
    // 获取的结果集条数
    .limit( pagesize)
    .exec(function(err, docs){
      if(err) return next(err);

      return res.json(docs);
    });
  },

  // 处理路由参数
  getById: function(req, res, next, id){
    if(!id) return next(new Error('News not Found'));
    getNewsFromRedis(id, function(err, doc){
      if(err) return next(err);

      if(!doc) {
        getNewsFromMongo(id, function(err, doc){
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
};