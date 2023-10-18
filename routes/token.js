const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { verifyToken } = require("../middlewares/authJWT");
const refresh = require("./auth/refresh");
const auth = require("../utils/auth");
const { setRedisItem } = require("../utils/redis");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // jwt.sign() 메소드: 토큰 발급
    const { username, password } = req.body;
    const accessToken = jwt.sign(
      { name: username, pw: password },
      process.env.JWT_SECRET,
      {
        expiresIn: "100000ms",
      }
    );
    const refreshToken = auth.refresh();
    console.log("refreshToken::: ", refreshToken);
    await setRedisItem(username, refreshToken);
    return res.status(201).json({
      code: 201,
      message: "토큰이 발급되었습니다.",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "서버 에러",
    });
  }
});

router.get("/verify", verifyToken, (req, res) => {
  res.json(req.decoded);
});

router.post("/refresh", refresh);

router.get("/dashboard", verifyToken, async (req, res) => {
  const refreshToken = req.headers["refreshtoken"];
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split("Bearer ")[1];
  const isRefreshVerify = await auth.refreshVerify(refreshToken, "suuny");
  console.log("isRefreshVerify >> ", isRefreshVerify);
  if (isRefreshVerify) {
    return res.json({
      code: 200,
      message: "dashboard data 보냄",
      dashboard: {
        title: "test title",
        "content:": "test content",
      },
      accessToken,
      refreshToken,
    });
  } else {
    return res.status(419).json({
      code: 419,
      message: "토큰이 만료되었습니다.",
    });
  }
});

module.exports = router;
