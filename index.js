const Koa                   = require('koa');
const bodyParser            = require('koa-body');
const Router                = require('koa-router');
const cors                  = require('koa2-cors');

// node原生不支持
const mysql = require('./common/mysql.js');
const route = require('./route/index.js')

async function serverinit () {


    mysql.init();
    const app = new Koa();

    app.use(bodyParser());
    app.use(cors());
    var router = new Router();
    router.all('/learn_review', route);

    app.use(router.routes()).use(router.allowedMethods());

    app.listen(8991);
}


serverinit();

