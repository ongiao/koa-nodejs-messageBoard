const router = require('koa-router')();
const userModel = require('../lib/mysql.js');
const md5 = require('md5')
const controller = require('../controller/loginController');


router.get('/login', controller.getLogin);
router.post('/login', controller.postLogin);

module.exports = router