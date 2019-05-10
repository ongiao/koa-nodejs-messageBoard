const router = require('koa-router')();
const userModel = require('../lib/mysql.js');
const controller = require('../controller/logoutController');

router.get('/logout', controller.getLogout);

module.exports = router