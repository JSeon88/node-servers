const jwt = require("../../utils/auth");
const { redisClient } = require("../../utils/redis");

const login = async (req, res) => {
  const { username, password } = req.body;

  const payload = {
    // access token에 들어갈 payload
    id: user.id,
    name: user.username,
    pw: user.password,
  };

  if (user) {
    if (password === 1234) {
      const accessToken = jwt.sign(payload);
      const refreshToken = jwt.refresh();

      redisClient.set(username, refreshToken);

      res.status(201).send({
        code: 201,
        data: {
          accessToken,
          refreshToken,
        },
      });
      return;
    } else {
      res.status(401).send({
        code: 401,
        message: "유효하지 않은 비밀번호입니다.",
      });
      return;
    }
  }
  res.status(401).send({
    code: 401,
    message: "user 정보가 존재하지 않습니다.",
  });
};

module.exports = login;
