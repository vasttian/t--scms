var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  //集合的id
  identity: 'post',
  //使用的连接数
  connection: 'mongo',
  //是否强制模式
  schema: true,
  //适配器
  attributes: {
    title: {type: 'string'},
    content: {type: 'string'}
  }
});