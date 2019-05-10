var mysql = require('mysql');
var config = require('../config/default.js');


var pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    port: config.database.PORT
});

let query = (sql, values) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                reject(err);
            } else {
                connection.query(sql, values, (err, rows) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                })
            }
        });
    });
};

// 用户表
let tbl_user =
    `create table if not exists tbl_user(
    id int(10) unsigned not null auto_increment primary key,
    username varchar(100) not null comment "用户名",
    password varchar(100) not null comment "密码",
    user_create_time datetime not null comment "用户创建时间",
    user_type int(10) unsigned not null default 0 comment "用户类型，普通用户0，管理员100"
    );`

// 主题贴子表
let tbl_post = 
`create table if not exists tbl_post(
    id int(10) unsigned not null auto_increment primary key,
    title varchar(50) not null comment "文章标题",
    content text not null comment "文章内容",
    create_time datetime not null comment "文章创建时间",
    update_time datetime not null comment "文章更新时间",
    uid int(10) unsigned not null comment "文章发表用户id",
    username varchar(100) not null comment "文章发表用户名字",
    pv VARCHAR(40) NOT NULL DEFAULT '0' comment "文章浏览量",
    status int(10) unsigned not null default 0 comment "状态码，0为正常，1为已删除"
);`

// 评论表
let tbl_comment = 
`create table if not exists tbl_comment(
    id int(10) unsigned not null auto_increment primary key,
    comment_type int(10) unsigned not null comment "评论类型，0针对贴子，1针对评论",
    post_id int(10) unsigned not null default 0 comment "当comment_type为1时生效，针对的贴子id",
    comment_id int(10) unsigned not null default 0 comment "当comment_type为0时生效，针对评论Id",
    content text not null comment "评论内容",
    from_id int(10) unsigned not null comment "评论用户的id",
    username varchar(100) NOT NULL COMMENT '评论用户名字',
    create_time datetime not null comment "评论创建时间",
    status int(10) unsigned not null default 0 comment "状态码，0为正常，1为已删除"
);`

let createTable = function(sql) {
    return query(sql, []);
}

//建表
createTable(tbl_user);
createTable(tbl_post);
createTable(tbl_comment);

//注册用户
let insertUserData = (value) => {
    let _sql = "insert into tbl_user set username=?,password=?,user_create_time=?;";
    return query(_sql, value);
}

// 通过名字查找出用户的个数，来判断用户是否存在
let findUserCountByName = (name) => {
    let _sql = `select count(*) as count from tbl_user where username=?;`;
    return query(_sql, name);
}

// 登录功能：通过名字查找是否有该用户
let findDataByName =  ( name ) => {
    // 这种写法存在sql注入问题
    // let _sql = `select * from tbl_user where username="${name}";`
    let _sql = `select * from tbl_user where username=?;`
    return query( _sql, name)
}

// 更新浏览量
let updatePostPv = ( value ) => {
    let _sql = "update tbl_post set pv= pv + 1 where id=?"
    return query( _sql, value )
  }

// 发表文章
let insertPost = ( value ) => {
    let _sql = "insert into tbl_post set title=?,content=?,create_time=?,update_time=?,uid=?,username=?;";
    return query( _sql, value )
}

// 修该贴子标题或内容
let updatePost = (values) => {
    let _sql = `update tbl_post set title=?,content=?,update_time=? where id=?;`;
    return query(_sql,values)
}

// 查询所有文章
let findAllPost = () => {
    let _sql = `select * from tbl_post where status=0;`
    return query( _sql)
}

// 通过用户名查找贴子信息
let findPostDataByName = ( name ) => {
    // let _sql = `select * from tbl_post where username="${name}" and status=0;`
    let _sql = `select * from tbl_post where username=? and status=0;`
    return query( _sql, name)
}

// 按分页大小查询文章
let findPostByPage = ( page ) => {
    let _sql = ` select * from tbl_post where status=0 limit ${(page-1)*10},10;`
    return query( _sql)
  }

// 通过贴子id查找对应的贴子信息
let findPostDataById =  ( postId ) => {
    // let _sql = `select * from tbl_post where id="${id} and status=0";`
    let _sql = `select * from tbl_post where status=0 and id=?;`
    return query( _sql, postId)
}

// 通过贴子id（逻辑）删除贴子
let deletePostById = (id) => {
    // let _sql = `delete from tbl_post where id = ${id}`
    // let _sql = `update tbl_post set status = 1 where id = ${id};`;
    let _sql = `update tbl_post set status=1 where id=?;`;
    return query(_sql, id)
}

// 插入评论
let insertComment = (value) => {
    let _sql = "insert into tbl_comment set comment_type=?,post_id=?,comment_id=?,content=?,from_id=?,username=?,create_time=?;";
    return query(_sql, value)
}

// 获取某篇主题的所有评论
let getPostAllComment = (postId) => {
    let _sql = `select * from tbl_comment where status=0 and post_id=?;`;
    return query(_sql, postId)
}



module.exports = {
    query,
    createTable,
    insertUserData,
    findUserCountByName,
    findDataByName,
    insertPost,
    findPostDataById,
    deletePostById,
    updatePost,
    findAllPost,
    findPostByPage,
    findPostDataByName,
    updatePostPv,
    insertComment,
    getPostAllComment
};