const Password = require('../library/password.js');
const CONST = require('../common/const.js');
const getSession = require('../library/session.js');

const BaseClass = require('./baseClass.js');


class Register extends BaseClass {
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

      // 检查邮箱是否被注册过
      const emailAvailible = await this.checkEmailAvalible(email);
      if (!emailAvailible) {
        return next();
      }

      const result = await this.registerUser(email, password);

      if (!result) {
        return next();
      }

      this.responseSuccess('注册成功咯');
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
	 * 检查邮箱是否被注册过
	 * @param email
	 * @returns {Promise<boolean>}
	 */
  async checkEmailAvalible(email) {
    let result = false;
    const where = `email = '${email}' AND (status = 1 OR status = 2)`;

    const arr = await this.UserModel.getUserBy(where);

    if (arr && arr.length > 0) {
      result = false;
      this.responseFail('抱歉哦该邮箱已经被注册过拉~');
    } else {
      result = true;
    }

    return result;
  }

  /**
	 * 注册
	 * @param email
	 * @param password
	 * @returns {Promise<void>}
	 */
  async registerUser(email, password) {
    // 1. 密码加密
    const hash = await Password.getHash(password, CONST.SALT_LENGTH);
    if (!hash) {
      this.responseFail('注册失败，密码有问题哦');
      return false;
    }

    // 2. 写入表中
    const result = await this.UserModel.insertUser({
      email,
      password: hash,
      status: 1,
    });

    if (!result || !result.insertId) {
      this.responseFail('注册失败，写入表中失败');
      return false;
    }
    const uid = result.insertId;
    // 3. 写入cookie
    await getSession().setLogin(uid, this.ctx);

    return true;
  }
}


module.exports = Register;
