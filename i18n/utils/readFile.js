const fs = require("fs");

/**
 * 비동기적으로 JSON 파일을 읽고 파싱하여 반환하는 함수
 * @param {string} filePath - JSON 파일의 경로
 * @returns {Promise<any>} JSON 파일의 내용을 파싱한 객체
 */
function readJsonFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(new Error("Failed to read the file: " + err.message));
      } else {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (parseError) {
          reject(new Error("Error parsing JSON data: " + parseError.message));
        }
      }
    });
  });
}

module.exports = {
  readJsonFile,
};
