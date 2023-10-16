const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { verifyToken } = require("../middlewares");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // jwt.sign() 메소드: 토큰 발급
    const { username, password } = req.body;
    const token = jwt.sign(
      { user: username, pw: password },
      process.env.JWT_SECRET,
      {
        expiresIn: 60,
      }
    );

    return res.json({
      code: 200,
      message: "토큰이 발급되었습니다.",
      token,
    });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({
      code: 500,
      message: "서버 에러",
    });
  }
});

router.get("/verify", verifyToken, (req, res) => {
  res.json(req.decoded);
});

module.exports = router;
