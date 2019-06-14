const SqlString                         = require('sqlstring');
const _                                 = require('underscore');
const xss                               = require('xss');

const mysql                             = require('../common/mysql.js');
const dbConf                            = require('../config/db.js');
const BaseModel                         = require('./BaseModel.js');


class UserModel extends BaseModel{
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
	 * @returns {Promise<T>}
	 */
	async getUserBy(selector, field = [
		id,
		email,
		password,
		nickname,
		avatar,
		status
	]) {
		let where = this.makeSelector(selector);
		let sql = `SELECT  FROM user_table WHERE ${where}`;
		
		let res = await mysql.runSql(sql, dbConf.dbName)
		.catch((err) => {
			console.log(err);
		});
		return res;
	}
}

UserModel.instances = {};

module.exports = UserModel;
