const jwt = require("jsonwebtoken");
const { getRedisItem } = require("./redis");
require("dotenv").config();

const secret = process.env.JWT_SECRET;

module.exports = {
  sign: (user) => {
    const { name, pw } = user;
    // access token 발급
    const payload = {
      // access token에 들어갈 payload
      name,
      pw,
    };

    return jwt.sign(payload, secret, {
      expiresIn: "100000ms", // 유효기간
    });
  },
  verify: (token) => {
    // access token 검증
    let decoded = null;

    try {
      decoded = jwt.verify(token.trim(), process.env.JWT_SECRET);
      return {
        code: 201,
        name: decoded.user,
        pw: decoded.pw,
      };
    } catch (error) {
      // 인증 실패
      if (error.name === "TokenExpiredError") {
        return {
          code: 419,
          message: "토큰이 만료되었습니다.",
        };
      } else {
        return {
          code: 401,
          message: "유효하지 않은 토큰입니다.",
        };
      }
    }
  },
  refresh: () => {
    console.log("refresh 시작");
    console.log("secret::: ", secret);
    // refresh token 발급
    return jwt.sign({}, secret, {
      // refresh token은 payload 없이 발급
      expiresIn: "500000ms",
    });
  },
  refreshVerify: async (token, username) => {
    console.log("refresh verify start..!");
    console.log("username :: ", username);
    try {
      // refresh token 가져오기
      console.log("redis에서 데이터 가져오기 시작..!");
      const redisRefreshToken = await getRedisItem(username);
      console.log("redis refresh token data ::", String(redisRefreshToken));
      console.log("token data ::", String(token));
      console.log(token === JSON.parse(redisRefreshToken));

      if (token === JSON.parse(redisRefreshToken)) {
        console.log("들어옴");
        try {
          jwt.verify(token, secret);
          return true;
        } catch (err) {
          return false;
        }
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  },
};
