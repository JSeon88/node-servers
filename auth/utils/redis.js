const redis = require("redis");
require("dotenv").config();

// redis[s]://[[username][:password]@][host][:port][/db-number]
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
  legacyMode: true, // 반드시 설정 !!
});

redisClient.on("connect", () => {
  console.info("Redis connected!");
});
redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});
redisClient.connect().then(); // redis v4 연결 (비동기)

const setRedisItem = async (key, value) => {
  await redisClient.v4.set(key, JSON.stringify(value));
  console.log("레디스 끝");
};

const getRedisItem = async (key) => {
  console.log("들어왔어???", key);

  // await redisClient.v4.get(req, (error, data) => {
  //   console.log("data >>>> ", data);
  //   if (error) {
  //     console.log("에러로 빠짐?");
  //     res.status(400).send({
  //       code: 400,
  //       message: error,
  //     });
  //   }
  //   if (data !== null) {
  //     console.log("data from redis!");
  //     return JSON.parse(data);
  //   } else next();
  // });
  let data = null;
  try {
    data = await redisClient.v4.get(key);
    console.log("데이터 가져오기 끝 ", data);
  } catch (err) {
    console.log(err);
  }

  return data;
};

module.exports = {
  redisClient,
  setRedisItem,
  getRedisItem,
};
