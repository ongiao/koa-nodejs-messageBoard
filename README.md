# **基于koa+node+mysql的留言板**

### 非登陆用户只能查看已发表的文章，**已注册登录的用户可以发表、修改和删除文章，发表评论。**

## 数据库：

| Tables_in_nodesql    |
|---|---|
| tbl_comment          |
| tbl_post             |
| tbl_user             |

### tbl_comment是评论表，tbl_post是文章表，tbl_user是用户表，下面是表字段设计：

## tbl_comment表：
|字段名|字段说明|
|---|---|
|`id`|自增主键|
|`comment_type`|评论类型，0针对贴子，1针对评论|
|`post_id`|当comment_type为1时生效，针对的贴子id|
|`comment_id`|当comment_type为0时生效，针对评论Id|
|`content`|评论内容|
|`from_id`|评论用户的id|
|`username`|评论用户名字|
|`create_time`|评论创建时间|
|`status`|状态码，0为正常，1为已删除|

## tbl_post表：             
|字段名|字段说明|
|---|---|
|`id`|自增主键|
|`title`|文章标题|
|`content`|文章内容|
|`create_time`|文章创建时间|
|`update_time`|文章更新时间|
|`uid`|文章发表用户id|
|`username`|文章发表用户名字|
|`pv`|文章浏览量|
|`status`|状态码，0为正常，1为已删除|

## tbl_post表：             
|字段名|字段说明|
|---|---|
|`id`|自增主键|
|`username`|用户名|
|`password`|密码|
|`user_create_time`|用户创建时间|
|`user_type`|用户类型，普通用户0，管理员100|

## 运行步骤：

### 首先需要在config/default.js和lib/mysql.js中修改自己的数据库信息：

`config/default.js`
```
// 修改成自己的数据库信息
const config = {
    port: 3000,
    database: {
        DATABASE: 'nodesql',
        USERNAME: '用户名',
        PASSWORD: '用户密码',
        PORT: '3306',
        HOST: 'localhost'
    }
}

```

`lib/mysql.js`
```
var pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    port: config.database.PORT
});
```

### 配置完成后，在自己数据库中创建名为`nodesql`的数据库

### 创建完成后，在终端的项目路径下执行：
```
$ npm install 
```
然后
```
node app.js
```
即可启动项目。

![GitHub Logo](/public/4.png)# koa-nodejs-messageBoard
