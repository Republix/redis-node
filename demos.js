const redis = require('redis');
const client = redis.createClient(); //默认连接localhost:6379，具体配置参数可以参考文档https://github.com/NodeRedis/node_redis

/**
 * 1、字符串数据类型
 */

var res = client.set('name', 'abczhijia', (err, data) => {
    console.log('err: ', err, ' data: ', data);
}); // err:  null  data:  OK，res的值是true

client.get('name',  (err, data) => {
    console.log('err: ', err, ' data: ', data);
}); // err:  null  data:  abczhijia

const cb = (err, data) => {
    console.log('err: ', err, ' data: ', data, ' data type: ', typeof data);
}


client.set('age', 20, cb); //err:  null  data:  OK  data type:  string
client.get('age', cb); //err:  null  data:  20  data type:  string


/**
 * 2、列表数据类型
 */

//从右侧推入
client.rpush('friends', 'mike', 'jhon', cb); //err:  null  data:  2  data type:  number
client.lrange('friends', 0, -1, cb); //err:  null  data:  [ 'mike', 'jhon' ]  data type:  object

//从左侧推入
client.lpush('friends', 'sam', 'bob', cb); //err:  null  data:  4  data type:  number
client.lrange('friends', 0, -1, cb); // err:  null  data:  [ 'bob', 'sam', 'mike', 'jhon' ]  data type:  object

//从右侧弹出
client.rpop('friends', cb); //err:  null  data:  jhon  data type:  string
//从左侧弹出
client.lpop('friends', cb); //err:  null  data:  bob  data type:  string
//打印看看发生了啥
client.lrange('friends', 0, -1, cb); // err:  null  data:  [ 'sam', 'mike' ]  data type:  object

//查看索引位置的值
client.lindex('friends', 0, cb); //err:  null  data:  sam  data type:  string

//对列表进行裁剪
client.rpush('friends', 'tom', 'bryant', cb)// err:  null  data:  4  data type:  number
client.ltrim('friends', 1, 2, cb); //err:  null  data:  OK  data type:  string
client.lrange('friends', 0, -1, cb); //err:  null  data:  [ 'mike', 'tom' ]  data type:  object

/**
 * 3、集合数据类型
 */

//往集合ids中加几个元素
client.sadd('ids', 1, 2, cb);  //err:  null  data:  2  data type:  number
//查看集合元素
client.smembers('ids', cb); //err:  null  data:  [ '1', '2' ]  data type:  object
//从集合中删除元素
client.srem('ids', 2, cb); // err:  null  data:  1  data type:  number
//看看发生了啥
client.smembers('ids', cb); //err:  null  data:  [ '1' ]  data type:  object
//看看集合有多少个元素
client.scard('ids', cb); //err:  null  data:  1  data type:  number
//再加几个元素进去
client.sadd('ids', 3, 5, 8, 9); //
//判断元素是否在集合内
client.sismember('ids', 8, cb); // err:  null  data:  1  data type:  number
client.sismember('ids', 80, cb); //err:  null  data:  0  data type:  number


/**
 *4、散列数据类型 
 */

//往散列上添加多组键值对
client.hmset('phone', 'price', 5888, 'name', 'iphonex', cb); //err:  null  data:  OK  data type:  string
//查看多个键的值
client.hmget('phone', 'price', 'name', cb); //err:  null  data:  [ '5888', 'iphonex' ]  data type:  object
//查看键值对的数量
client.hlen('phone', cb); //err:  null  data:  2  data type:  number
//删掉其中一个键值对
client.hdel('phone', 'price', cb); //err:  null  data:  1  data type:  number
//看看price是否还在？
client.hmget('phone', 'price', cb); //err:  null  data:  [ null ]  data type:  object,原来只留下了null
//再加几个属性
client.hmset('phone', 'vendor', 'apple', 'madein', 'china', cb);
//取出所有的键值对
client.hgetall('phone', cb); //err:  null  data:  { name: 'iphonex', vendor: 'apple', madein: 'china' }  data type:  object
//取出所有的键
client.hkeys('phone', cb); //err:  null  data:  [ 'name', 'vendor', 'madein' ]  data type:  object
//取出所有的值
client.hvals('phone', cb); //err:  null  data:  [ 'iphonex', 'apple', 'china' ]  data type:  object
//判断键是否存在
client.hexists('phone', 'name', cb); //err:  null  data:  1  data type:  number
client.hexists('phone', 'price', cb); //err:  null  data:  0  data type:  number