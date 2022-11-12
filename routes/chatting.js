var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.query.chat == 1) {
    res.send(req.query.chat + '번 채팅방에 입장하였습니다.')
  } else {
    res.send('해당 채팅방은 \n없는 채팅방입니다.')
  }
});

module.exports = router;
