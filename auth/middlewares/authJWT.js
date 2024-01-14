const jwt = require("jsonwebtoken");
const { redisClient } = require("../utils/redis");

exports.verifyToken = (req, res, next) => {
  // 인증 완료
  try {
    let authHeader = req.headers["authorization"];
    console.log("authHeader >>>", authHeader);
    let token = authHeader && authHeader.split("Bearer ")[1];
    console.log(token);
    req.decoded = jwt.verify(token.trim(), process.env.JWT_SECRET);
    return next();
  } catch (error) {
    // 인증 실패
    if (error.name === "TokenExpiredError") {
      return res.status(419).json({
        code: 419,
        message: "토큰이 만료되었습니다.",
      });
    } else {
      return res.status(401).json({
        code: 401,
        message: "유효하지 않은 토큰입니다.",
      });
    }
  }
};
