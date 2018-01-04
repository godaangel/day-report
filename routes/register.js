var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
    res.send("我是register")
});

module.exports = router;