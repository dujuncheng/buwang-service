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
	 * @returns {Promise<T>} 返回的是一个数组
	 */
	async getUserBy(where, field = [
		'id',
		'email',
		'password',
		'nickname',
		'avatar',
		'status'
	]) {
		try {
			let fields = this.arrToString(field);
			
			let sql = `SELECT ${fields} FROM user_table WHERE ${where}`;
			
			let res = await mysql.runSql(sql, dbConf.dbName)
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
	async insertUser({email, password, nickname = '', avatar = '', status = ''}) {
		let fieldStr = dbConf.userTableField.join(',');
		
		let now = Math.round(Date.now() / 1000);
		
		let valueArr = [];
		valueArr.push(0);
		valueArr.push(email);
		valueArr.push(password);
		valueArr.push(nickname);
		valueArr.push(avatar);
		valueArr.push(status);
		valueArr.push(now);
		valueArr.push(now);
		
		
		const sql = `INSERT INTO user_table (${fieldStr}) VALUES (?,?,?,?,?,?,?,?)`;
		let result = await mysql.bindSql(sql, valueArr, dbConf.dbName);
		return result;
	}
}

UserModel.instances = {};

module.exports = UserModel;
