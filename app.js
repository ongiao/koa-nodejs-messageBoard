const Koa = require('koa');
const path = require('path')
const bodyParser = require('koa-bodyparser');
const session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session');
const config = require('./config/default.js');
const views = require('koa-views')
const staticCache = require('koa-static-cache')
const app = new Koa()


// session存储配置
const sessionMysqlConfig = {
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  host: config.database.HOST,
}

// 配置session中间件
app.use(session({
  // session cookie name and store key prefix
  key: 'USER_SID',
  // session store, to store your session data with MySQL.
  store: new MysqlStore(sessionMysqlConfig),
  cookie: ctx => ({
    maxAge: ctx.session.user ? 30 * 24 * 60 * 60 : 0
  })
}))

// 缓存
app.use(staticCache(path.join(__dirname, './public'), { dynamic: true }, {
  maxAge: 365 * 24 * 60 * 60
}))
// app.use(staticCache(path.join(__dirname, './images'), { dynamic: true }, {
//   maxAge: 365 * 24 * 60 * 60
// }))

// 配置服务端模板渲染引擎中间件
app.use(views(path.join(__dirname, './views'), {
  extension: 'ejs'
}))
app.use(bodyParser({
  formLimit: '1mb'
}))

//  路由
app.use(require('./routers/login.js').routes())

app.use(require('./routers/signup.js').routes())

app.use(require('./routers/testlogin.js').routes())

app.use(require('./routers/logout.js').routes())

app.use(require('./routers/topic.js').routes())

app.use(require('./routers/addComment.js').routes())


app.listen(3000, () => {
  console.log(`listening on port ${config.port}`)
})