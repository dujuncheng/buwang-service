const Password = require('../library/password.js');
const CONST = require('../common/const.js');
const getSession = require('../library/session.js');

const BaseClass = require('./baseClass.js');


class Login extends BaseClass {
  constructor() {
    super({ needLogin: false });
  }

  async run(ctx, next) {
    try {
      // 检查params
      const paramsOk = this.checkParams(['email', 'password']);

      if (!paramsOk) {
        return next();
      }

      const email = String(this.param.email);
      const password = String(this.param.password);

      // 校验密码是否ok
      const passwordOk = this.checkPassword(password);
      if (!passwordOk) {
        return next();
      }

      // 校验邮箱是否ok
      const emailOk = this.checkEmail(email);
      if (!emailOk) {
        return next();
      }

      // 检查邮箱 和 密码是否可以对上
      const userinfo = await this.validPassword(email, password);
      if (!userinfo) {
        return next();
      }

      const uid = userinfo.id;
      await getSession().setLogin(uid, this.ctx);

      this.responseSuccess('登录成功咯');
    } catch (e) {
      this.responseFail(e.message || '网络错误', 0);
      return next();
    }
  }

  /**
	 * 校验密码
	 * @param password
	 * @returns {boolean}
	 */
  checkPassword(password) {
    if (password.length < 6) {
      this.responseFail('密码的长度需要大于6哦');
      return false;
    }

    if (password.length > 32) {
      this.responseFail('密码的长度要小于32位哦');
      return false;
    }

    const reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
    if (!reg.test(password)) {
      this.responseFail('密码必须包含至少一位数字和一位字母哦');
      return false;
    }

    return true;
  }

  /**
	 * 校验邮箱
	 * @param email
	 * @returns {boolean}
	 */
  checkEmail(email) {
    const re = /^\w+@[a-z0-9]+\.[a-z]+$/i;
    let result = false;

    if (re.test(email)) {
      result = true;
    } else {
      this.responseFail('请检查邮箱格式哦~');
    }

    return result;
  }

  /**
	 * 验证用户的密码是否有效
	 * @param email
	 * @returns {Promise<boolean>}
	 */
  async validPassword(email, password) {
    // 1. 从数据库中拿到数据
    const where = `email = '${email}' AND (status = 1 OR status = 2)`;
    const arr = await this.UserModel.getUserBy(where);

    if (!arr || arr.length !== 1 || !arr[0]) {
      this.responseFail('该邮箱未注册, 您请先注册呢', CONST.ERROR_CODE.NOT_REGISTER);
      return false;
    }

    const userinfo = arr[0];
    const hashPassword = userinfo.password;

    // 2. 检查密码是否ok
    const passwordOk = await Password.check(password, hashPassword);

    if (!passwordOk) {
      this.responseFail('邮箱或者密码错误');
      return false;
    }

    return userinfo;
  }
}


module.exports = Login;
