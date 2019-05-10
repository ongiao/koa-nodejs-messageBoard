const userModel = require('../lib/mysql.js');
const md5 = require('md5')
const moment = require('moment');
const getPosts = require('../middlewares/helper').getAllPost;
const constNum = require('../middlewares/helper').getConstNum;

let secretString = constNum();
console.log(secretString);

exports.getSignup = async(ctx, next)=>{
    await ctx.render('../views/signup', {
        session: ctx.session,
    })
}

exports.postSignup = async(ctx, next) => {
    let { username, password } = ctx.request.body;
    // 判断用户名及密码是否为空
    if(username != '' && password != '') {
        // 判断用户名是否已经存在
        let result = await userModel.findUserCountByName(username);
        if(result[0].count >= 1) {
            // 用户存在
            console.log('注册失败，用户已存在...');
            ctx.body = {
                "code": 500,
                "message": 'fail',
                "data": {result}
            }
            console.log(ctx.body);
        } else {
            // 判用户名格式，只允许大小写字母、数字及中文，且最少要2个字符
            let usernameReg = /[a-zA-Z0-9\\u4E00-\\u9FA5]{2,}/;
            // 判断密码的格式，只能为数字和大小写字母组合，不少于6位，不多于10位
            let passwordReg = /[0-9a-zA-Z]{6,10}/;
            if(passwordReg.test(password) && usernameReg.test(username)) {
                let result =await userModel.insertUserData([username, md5(password + secretString), moment().format('YYYY-MM-DD HH:mm:ss')]);
                console.log('注册成功...');
                ctx.session = null;
                ctx.session = {
                    username: username,
                    id: result.insertId 
                }
                ctx.body = {
                    "code": 0,
                    "message": 'success',
                    "data": {result}
                }
                console.log(ctx.body);
            }
            else {
                console.log('注册失败，用户名或者密码格式不正确');
                ctx.body = {
                    "code": 500,
                    "message": 'password format error',
                    "data": {}
                }
                console.log(ctx.body);
            }
        }
    }

    let res = await getPosts();

    await ctx.render('../views/allposts', {
        session: ctx.session,
        posts: res,
        pageSize: 10,
        currentPage: (res.length / 10) > parseInt(res.length / 10) ? parseInt(res.length / 10) + 1 : parseInt(res.length / 10)
    })
}