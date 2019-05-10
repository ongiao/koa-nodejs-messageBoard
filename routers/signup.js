const router = require('koa-router')();
const userModel = require('../lib/mysql.js');
const md5 = require('md5')
// const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const moment = require('moment');
const controller = require('../controller/signupController');

router.get('/signup', controller.getSignup);
router.post('/signup', controller.postSignup);

module.exports = router