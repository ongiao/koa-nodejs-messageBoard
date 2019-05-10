const router = require('koa-router')();
const userModel = require('../lib/mysql.js');
const moment = require('moment');
const escapeHTML = require('../middlewares/helper').htmlEscape;
const controller = require('../controller/commentController');

router.get('/addComment', controller.getcomment);
router.post('/addComment', controller.addcomment);

module.exports = router