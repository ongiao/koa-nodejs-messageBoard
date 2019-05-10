const router = require('koa-router')();
const controller = require('../controller/topicController');

// 发表主题
router.post('/addtopic', controller.postTopic);

// 删除主题
router.del('/deletetopic/:id', controller.deletePost);

// 获取某一篇文章
router.get('/gettopic/:id', controller.getOneTopic);

// 重定向到首页
router.get('/', async ctx => {
    ctx.redirect('/gettopics?author=all')
})

// 获取所有主题
router.get('/gettopics', controller.getSomeTopics);

// 修改主题
router.get('/modifytopic', controller.getModifyOneTopic);
router.post('/modifytopic', controller.postModifyOneTopic);

module.exports = router
