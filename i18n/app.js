const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { readJsonFile } = require("./utils/readFile");

const port = 3000;

// CORS 미들웨어를 모든 요청에 적용
app.use(cors());

app.get("/", (_, res) => {
  res.send("hello world");
});

/** 전체 다국어 */
app.get("/all", async (_, res) => {
  // try {
  //   // 파일 읽기
  //   const jsonData = await readJsonFile(
  //     path.join(__dirname, "locale/all.json")
  //   );
  //   // 응답 객체에 jsonData 포함시켜 보내기
  //   return res.status(200).json({
  //     isSuccessful: true,
  //     resultCode: 20000,
  //     resultMessage: {},
  //     data: jsonData,
  //   });
  // } catch (parseError) {
  //   console.error(parseError);
  //   return res.status(500).json({
  //     isSuccessful: false,
  //     resultCode: 50000,
  //     resultMessage: {},
  //   });
  // }

  res.sendFile(path.join(__dirname, "locale/all.json"));
});

/** 한국어 */
app.get("/ko", async (_, res) => {
  // try {
  //   // 파일 읽기
  //   const jsonData = await readJsonFile(path.join(__dirname, "locale/ko.json"));
  //   // 응답 객체에 jsonData 포함시켜 보내기
  //   return res.status(200).json({
  //     isSuccessful: true,
  //     resultCode: 20000,
  //     resultMessage: {},
  //     data: jsonData,
  //   });
  // } catch (parseError) {
  //   console.error(parseError);
  //   return res.status(500).json({
  //     isSuccessful: false,
  //     resultCode: 50000,
  //     resultMessage: {},
  //   });
  // }
  res.sendFile(path.join(__dirname, "locale/ko.json"));
});

/** 영어 */
app.get("/en", async (_, res) => {
  // try {
  //   // 파일 읽기
  //   const jsonData = await readJsonFile(path.join(__dirname, "locale/en.json"));
  //   // 응답 객체에 jsonData 포함시켜 보내기
  //   return res.status(200).json({
  //     isSuccessful: true,
  //     resultCode: 20000,
  //     resultMessage: {},
  //     data: jsonData,
  //   });
  // } catch (parseError) {
  //   console.error(parseError);
  //   return res.status(500).json({
  //     isSuccessful: false,
  //     resultCode: 50000,
  //     resultMessage: {},
  //   });
  // }
  res.sendFile(path.join(__dirname, "locale/en.json"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
