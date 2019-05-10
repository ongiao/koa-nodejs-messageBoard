const userModel = require('../lib/mysql.js');
const moment = require('moment');
const escapeHTML = require('../middlewares/helper').htmlEscape;
const getPosts = require('../middlewares/helper').getAllPost;
const getPostComment = require('../middlewares/helper').getAllComment;
let postId;

exports.getcomment = async(ctx, next) => {
    postId = ctx.query.postId;
    let sessionPropertyNames = Object.getOwnPropertyNames(ctx.session);
    if(sessionPropertyNames.length !== 0) {
        await ctx.render('../views/addComment', {
            session: ctx.session,
            post: ctx.query
        })
    }
}

exports.addcomment = async(ctx, next) => {
    let { commentContent } = ctx.request.body, res;
    commentContent = escapeHTML(commentContent);
    if(commentContent != ''){
        const createTime = moment().format('YYYY-MM-DD HH:mm:ss');
        if(ctx.request.body) {
            let result = await userModel.insertComment([0, postId, 0,  commentContent, ctx.session.id, ctx.session.username, createTime])
            if(result) {
                ctx.body = {
                    "code": 0,
                    "message": 'success',
                    "data": {
                        "id": result.insertId,
                        "content": commentContent,
                        "author": ctx.session.username,
                        "logtime": createTime
                    }
                } 
                console.log(ctx.body);
            } else {
                ctx.body = {
                    "code": 500,
                    "message": 'comment added fail',
                    "data": []
                } 
                console.log(ctx.body);
            }
        }  
    }

    res = await getPosts();
    let postComment = await getPostComment(postId);
    await ctx.render('../views/oneposts', {
        session: ctx.session,
        posts: res,
        pageSize: 10,
        comments: postComment,
        currentPage: (res.length / 10) > parseInt(res.length / 10) ? parseInt(res.length / 10) + 1 : parseInt(res.length / 10)
    })
}