const router = require('koa-router')();
const userModel = require('../lib/mysql.js');
const md5 = require('md5')
const getPosts = require('../middlewares/helper').getAllPost;
const constNum = require('../middlewares/helper').getConstNum;

let secretString = constNum();

exports.getLogin = async(ctx, next)=>{
    await ctx.render('../views/login', {
        session: ctx.session,
    })
};

exports.postLogin = async(ctx, next) => {
    let { username, password } = ctx.request.body;

    // 判断用户名是否已经存在
    let result = await userModel.findDataByName(username);
    if(result.length && username === result[0]['username'] && md5(password + secretString) === result[0]['password']) {
        ctx.session = {
            username: result[0]['username'],
            id: result[0]['id'] 
        }
        ctx.body = {
            "code": 0,
            "message": 'success',
            "data": result
        }
        console.log('登录成功...')
        console.log(ctx.body);
    } else {
        ctx.body = {
            "code": 500,
            "message": 'Incorrect username or password',
            "data": result
        }
        console.log('登录失败...');
        console.log(ctx.body);
    }

    let res = await getPosts();

    await ctx.render('../views/allposts', {
        session: ctx.session,
        posts: res,
        pageSize: 10,
        currentPage: (res.length / 10) > parseInt(res.length / 10) ? parseInt(res.length / 10) + 1 : parseInt(res.length / 10)
    })

}
