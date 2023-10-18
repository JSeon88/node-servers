var express = require("express");
const usersRouter = require("./users/login");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/users", usersRouter);

module.exports = router;
