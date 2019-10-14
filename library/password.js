const bcrypt = require('bcrypt');

class Password {
  /**
	 * 对用户的密码加密
	 * @param password      用户填写的密码
	 * @param saltRounds    salt
	 * @returns {Promise<string>}
	 */
  static async getHash(password, saltRounds) {
    let result = '';
    try {
      result = await bcrypt.hash(password, saltRounds);
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  /**
	 * 检查用户的密码是否ok
	 * @param password
	 * @param passwordHash
	 * @returns {Promise<boolean>}
	 */
  static async check(password, passwordHash) {
    let result = false;
    try {
      result = await bcrypt.compare(password, passwordHash);
    } catch (e) {
      console.log(e);
    }
    return result;
  }
}

module.exports = Password;
