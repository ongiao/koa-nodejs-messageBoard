const router = require('koa-router')();

router.get('/testlogin', async(ctx, next)=>{
    let sessionPropertyNames = Object.getOwnPropertyNames(ctx.session);
    if(sessionPropertyNames.length !== 0) {
        console.log('当前用户处于登录状态');
        ctx.body = {
            "code": 0,
            "message": 'success',
            "data": {
                "isLogin": true,
                "username": ctx.session.username
            }
        }
        console.log(ctx.body);
    } else {
        ctx.body = {
            "code": 500,
            "message": 'fail',
            "data": {
                "isLogin": false,
                "username": null
            }
        }
        console.log(ctx.body);
    }
  })

module.exports = router