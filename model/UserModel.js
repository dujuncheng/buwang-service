const SqlString = require('sqlstring');
const _ = require('underscore');
const xss = require('xss');

const mysql = require('../common/mysql.js');
const dbConf = require('../config/db.js');
const BaseModel = require('./BaseModel.js');


class UserModel extends BaseModel {
  constructor() {
    super();
  }

  static instance() {
    const clazz = 'UserModel';
    if (!UserModel.instances[clazz]) {
      UserModel.instances[clazz] = new this();
    }
    return UserModel.instances[clazz];
  }

  filter(str) {
    if (_.isUndefined(str)) {
      return false;
    }
    let result = str;

    result = filteremoji(result);
    result = SqlString.format(result);
    result = xss(result);

    return result;
  }

  /**
	 *
	 * @param selector { id: 12, email: '23231' }
	 * @param field
	 * @returns {Promise<T>} 返回的是一个数组
	 */
  async getUserBy(where, field = [
    'id',
    'email',
    'password',
    'nickname',
    'avatar',
    'status',
  ]) {
    try {
      const fields = this.arrToString(field);

      const sql = `SELECT ${fields} FROM user_table WHERE ${where}`;

      const res = await mysql.runSql(sql, dbConf.dbName);
      return res;
    } catch (e) {
      console.log(e);
    }
  }

  /**
	 * 往表里面插入一张表
	 * @param email
	 * @param password
	 * @param nickname
	 * @param avatar
	 * @param status
	 * @returns {Promise<void>}
	 */
  async insertUser({
    email, password, nickname = '', avatar = '', status = '',
  }) {
    const fieldStr = dbConf.userTableField.join(',');

    const now = Math.round(Date.now() / 1000);

    const valueArr = [];
    valueArr.push(0);
    valueArr.push(email);
    valueArr.push(password);
    valueArr.push(nickname);
    valueArr.push(avatar);
    valueArr.push(status);
    valueArr.push(now);
    valueArr.push(now);


    const sql = `INSERT INTO user_table (${fieldStr}) VALUES (?,?,?,?,?,?,?,?)`;
    const result = await mysql.bindSql(sql, valueArr, dbConf.dbName);
    return result;
  }

  /**
	 * 获取用户的列表
	 * @param field
	 * @param where
	 * @param pageNum
	 * @param pageSize
	 * @returns {Promise<T>}
	 */
  async getUserArr(field, where, pageNum, pageSize) {
    const whereStr = this.objToString(where);
    const fieldStr = this.arrToString(field);

    let sql = `SELECT ${fieldStr} FROM user_table ${whereStr ? `WHERE${whereStr}` : ''} `;

    // 如果传入分页,
    if (pageNum !== undefined && pageSize !== undefined) {
      const start = pageNum - 1 < 0 ? 0 : pageNum - 1;
      sql += `LIMIT ${start * pageSize}, ${pageSize}`;
    }
    const res = await mysql.runSql(sql, dbConf.dbName)
      .catch((err) => {
        console.log(err);
      });
    return res;
  }
}

UserModel.instances = {};

module.exports = UserModel;
