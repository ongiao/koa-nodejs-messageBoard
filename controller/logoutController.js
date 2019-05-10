const userModel = require('../lib/mysql.js');
const getPosts = require('../middlewares/helper').getAllPost;

exports.getLogout = async(ctx, next)=>{
    // let res;
    if(ctx.session) {
        ctx.session = null;
        console.log('退出登录成功...');
        ctx.body = {
            "code": 0,
            "message": 'success',
            "data": ctx.session
        }
        console.log(ctx.body);
    } else {
        console.log('退出登录失败...');
        ctx.body = {
            "code": 500,
            "message": 'fail',
            "data": ctx.session
        }
        console.log(ctx.body);
    }

    let res = await getPosts();

    await ctx.render('../views/allposts', {
        session: {},
        posts: res,
        pageSize: 10,
        currentPage: (res.length / 10) > parseInt(res.length / 10) ? parseInt(res.length / 10) + 1 : parseInt(res.length / 10)
    })
};