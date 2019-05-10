const userModel = require('../lib/mysql.js');
const moment = require('moment');
const escapeHTML = require('../middlewares/helper').htmlEscape;
const getPosts = require('../middlewares/helper').getAllPost;
const getPostComment = require('../middlewares/helper').getAllComment;
let postId;

exports.postTopic = async(ctx, next) => {
    let { title, content } = ctx.request.body;
    title = escapeHTML(title);
    content = escapeHTML(content);
    if(title != '' && content != ''){
        const createTime = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log('正在提交...');
        if(ctx.request.body) {
            let result = await userModel.insertPost([title, content, createTime, createTime, ctx.session.id, ctx.session.username]);
            if(result.affectedRows >= 1) {
                console.log('添加文章成功...');
                ctx.body = {
                    "code": 0,
                    "message": 'success',
                    "data": {
                        "id": result.insertId,
                        "title": title,
                        "content": content,
                        "author": ctx.session.username,
                        "logtime": createTime
                    }
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

// 删除主题贴子
exports.deletePost = async(ctx, next)=>{
    // 首先判断是否是登录状态
    let sessionPropertyNames = Object.getOwnPropertyNames(ctx.session);
    if(sessionPropertyNames.length !== 0) {
        let postId = ctx.params.id, allow;
        let result = await userModel.findPostDataById(postId);
        if(result[0].username == ctx.session.username) {
            allow = true;
        } else {
            allow = false;
        }
        // 允许删除
        if(allow) {
            let deleteResult = await userModel.deletePostById(postId);
            if(deleteResult) {
                ctx.body = {
                    "code": 0,
                    "message": 'success',
                    "data": {result}
                }
                console.log(ctx.body);
            } else {
                ctx.body = {
                    "code": 500,
                    "message": 'delete fail',
                    "data": []
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

// 获取某一篇主题
exports.getOneTopic = async(ctx, next)=>{
    let postId = ctx.params.id;
    let result = await userModel.findPostDataById(postId);
    if(result) {
        ctx.body = {
            "code": 0,
            "message": 'success',
            "data": {
                "id": result[0].id,
                "title": result[0].title,
                "content": result[0].content,
                "author": result[0].username,
                "logtime": result[0].update_time
            }
        }
        console.log(ctx.body);
    } else {
        ctx.body = {
            "code": 500,
            "message": 'fail',
            "data": []
        }
        console.log(ctx.body);
    }

    // 更新pv值
    await userModel.updatePostPv(postId);

    result.sort((obj1, obj2) => {
        return obj2.update_time - obj1.update_time;
    });

    let postComment = await getPostComment(postId);

    await ctx.render('../views/oneposts', {
        session: ctx.session,
        posts: result,
        comments: postComment
    })
}

// 获取多篇主题
exports.getSomeTopics = async(ctx, next)=>{
    if(ctx.query.author == undefined) {
        // author默认值
        ctx.query.author = 'all';
    }
    if(ctx.query.page == undefined) {
        // page默认值
        ctx.query.page = '1';
    }
    if(ctx.query.size == undefined) {
        // size默认值
        ctx.query.size = '10';
    }

    let author = ctx.query.author, page = ctx.query.page, size = ctx.query.size, res;

    if(author == 'all') {
        res = await userModel.findAllPost();
        if(res) {
            ctx.body = {
                "code": 0,
                "message": 'success',
                "data": {
                    "count": res.length,
                    "raw": res
                }
            }
            console.log(ctx.body);
        } else {
            ctx.body = {
                "code": 500,
                "message": 'fail ',
                "data": []
            }
            console.log(ctx.body);
        }
    } else {
        res = await userModel.findPostDataByName(author);
        if(res) {
            ctx.body = {
                "code": 0,
                "message": 'success',
                "data": {
                    "count": res.length,
                    "raw": res
                }
            }
            console.log(ctx.body);
        } else {
            ctx.body = {
                "code": 500,
                "message": 'fail',
                "data": []
            }
        }
    }

    res.sort((obj1, obj2) => {
        return obj2.update_time - obj1.update_time;
    });

    await ctx.render('../views/allposts', {
        session: ctx.session,
        posts: res,
        currentPage: page,
        pageSize: size 
    }) 
}

// 修改主题
exports.getModifyOneTopic = async(ctx, next)=>{
    // 首先判断是否是某个用户的登录状态
    postId = ctx.query.postId;
    let sessionPropertyNames = Object.getOwnPropertyNames(ctx.session);
    if(sessionPropertyNames.length !== 0) {
        await ctx.render('../views/editpost', {
            session: ctx.session,
            post: ctx.query
        })
    }
}

exports.postModifyOneTopic = async(ctx, next) => {
    let { newTitle, newContent } = ctx.request.body;
    newTitle = escapeHTML(newTitle);
    newContent = escapeHTML(newContent);
    let allowEdit, res;
    let result = await userModel.findPostDataById(parseInt(postId));
    if(result && result[0].username == ctx.session.username) {
        allowEdit = true;
    } else {
        allowEdit = false;
    }

    if(allowEdit) {
        const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        result = await userModel.updatePost([newTitle, newContent, updateTime, postId]);
        if(result) {
            ctx.body = {
                "code": 0,
                "message": 'success',
                "data": {
                    "id":  postId,
                    "title": newTitle,
                    "content": newContent,
                    "author": ctx.session.username,
                    "logtime": updateTime
                }
            }
            console.log(ctx.body);
        } else {
            console.log('修改失败...');
            ctx.body = {
                "code": 500,
                "message": 'fail'
            }
            console.log(ctx.body);
        }
    }

    res = await getPosts();

    await ctx.render('../views/allposts', {
        session: ctx.session,
        posts: res,
        pageSize: 10,
        currentPage: (res.length / 10) > parseInt(res.length / 10) ? parseInt(res.length / 10) + 1 : parseInt(res.length / 10)
    })
}

