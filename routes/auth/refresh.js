const { sign, verify, refreshVerify } = require("../../utils/auth");
const jwt = require("jsonwebtoken");

const refresh = async (req, res) => {
  const { authorization, refreshtoken } = req.headers;
  console.log("authorization ::: ", authorization);
  console.log("refreshToken ::: ", refreshtoken);
  // access token과 refresh token의 존재 유무 체크
  if (authorization && refreshtoken) {
    const authToken = authorization.split("Bearer ")[1];
    const refreshToken = refreshtoken;

    // access token 검증 -> expired여야 함.
    const authResult = verify(authToken);

    console.log("authResult>>> ", authResult);

    if (authResult.code === 200) {
      return res.status(400).send({
        code: 400,
        message: "액세스 토큰이 아직 만료되지 않았습니다.",
      });
    }

    // access token 디코딩하여 user의 정보를 가져옴
    const decoded = jwt.decode(authToken);

    console.log("decoded >>>> ", decoded);

    // 디코딩 결과가 없는 경우
    if (decoded === null) {
      return res.status(401).send({
        code: 401,
        message: "유효하지 않은 토큰입니다.",
      });
    }

    // access token의 decoding 된 값에서 유저의 name을 가져와 refresh token을 검증
    const refreshResult = refreshVerify(refreshToken, decoded.name);

    // 재발급을 위해서는 access token이 만료되어 있어야 함
    if (authResult.code === 419) {
      // 1. access token이 만료되고, refresh token도 만료 된 경우 => 새로 로그인
      if (refreshResult.code === 401) {
        res.status(401).send({
          code: 401,
          message: "유효하지 않은 refresh token입니다.",
        });
      } else {
        // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
        const newAccessToken = sign(decoded);

        res.status(201).send({
          // 새로 발급한 access token과 원래 있던 refresh token 모두 반환
          code: 201,
          message: "토큰이 발급되었습니다.",
          accessToken: newAccessToken,
          refreshToken,
        });
      }
    } else {
      // 3. access token이 만료되지 않은경우 => refresh 할 필요가 없음
      return res.status(200).send({
        code: 200,
        message: "액세스 토큰이 아직 만료되지 않았습니다.",
      });
    }
  } else {
    // access token 또는 refresh token이 헤더에 없는 경우
    return res.status(400).send({
      code: 400,
      message: "액세스 토큰 또는 리플레시 토큰이 존재하지 않습니다.",
    });
  }
};

module.exports = refresh;
