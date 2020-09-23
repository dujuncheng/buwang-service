const { Base64 } = require('js-base64');
const { getRedis } = require('../common/redis.js');
const CONST = require('../common/const.js');
const Util = require('../common/util.js');

class Session {
  constructor() {

  }

  /**
	 * 从redis中拿到 session 对应的uid
	 * @returns {Promise<boolean>}
	 */
  async cacheGet(sessionStr) {
    const cache = getRedis();
    let uid = false;

    const cacheUid = await cache.get(`nana_notebook_${sessionStr}`);
    if (cacheUid) {
      uid = Number(cacheUid);
    }

    return uid;
  }

  /**
	 * 拿到cookie中的值
	 * @param ctx
	 * @returns {boolean}
	 */
  getCookie(ctx) {
    let session = false;
    const xsession = ctx.cookies.get('_x_session');
    if (xsession) {
      session = xsession;
    }

    return session;
  }

  /**
	 * 对cookie 中的值，进行处理 1. base64 2. 分割
	 * @param ctx
	 * @returns {boolean}
	 */
  getSession(ctx) {
    let result = false;
    let xsession = this.getCookie(ctx);

    try {
      xsession = Base64.decode(xsession);
    } catch (e) {
      return result;
    }

    const strArr = xsession.split('_');

    if (strArr && Array.isArray(strArr) && strArr[1]) {
      result = strArr[1];
    }

    return result;
  }


  /**
	 *
	 * 1. 存入redis
	 * 2. 写入 cookie 中
	 * @param uid
	 * @returns {*}
	 */
  async setLogin(uid, ctx) {
    uid = String(uid);

    const cache = getRedis();

    const session1 = this.makeSessionStr();
    const session2 = this.makeSessionStr();


    // 1. 存入redis
    const cacheUid = await cache.set(`nana_notebook_${session2}`, uid, 'EX', CONST.SESSION_LAST);

    // 2. 写入到 cookie 中
    const cookie = `${session1}_${session2}`;
    const encode = Base64.encode(cookie);
    const option = {
      maxAge: CONST.SESSION_LAST,
      overwrite: true,
      httpOnly: false,
	    sameSite: 'none',
	    secure: true,
    };
    ctx.set('x_session', encode);
    ctx.cookies.set('_x_session', encode, option);
  }

  makeSessionStr() {
    const now = new Date().getTime();
    const random = Util.getRandomNum(0, 20);

    return `${now}${random}`;
  }

  /**
	 * 检查是否登录
	 * return false | 21312312
	 * @returns {Promise<void>}
	 */
  async checkLogin(ctx, next) {
    const session = this.getSession(ctx);
    // 是否存在session
    if (!session || session.length === 0) {
      ctx.body = {
        success: false,
        err_code: CONST.ERROR_CODE.NOT_LOGIN,
        message: '无效的会话, 请登录',
      };
      return next();
    }

    const uid = await this.cacheGet(session);
    return Number(uid);
  }
}

let sessionClient = new Session();

const getSession = () => {
  if (!sessionClient) {
    sessionClient = new Session();
  }
  return sessionClient;
};

module.exports = getSession;
