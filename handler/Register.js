const base64            = require('js-base64');
const _                 = require('underscore');
const errCode           = require('../config/errCode.js');
const Password          = require('../library/passport.js');

const BaseClass = require('./baseClass.js');


class Register extends BaseClass{
	constructor() {
		super();
	}
	async run(ctx, next) {
		try {
			// 检查params
			let paramsOk = this.checkParams(['email', 'password']);
			
			if (!paramsOk) {
				return next();
			}
			
			let email = String(this.param.email);
			let password = String(this.param.password);
			
			// 校验密码是否ok
			let passwordOk = this.checkPassword(password);
			if (!passwordOk) {
				return next();
			}
			
			// 校验邮箱是否ok
			let emailOk = this.checkEmail(email);
			if (!emailOk) {
				return next();
			}
			
			await this.checkEmailAvalible(email);
			
			
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
		
		var reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
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
		let re=/^\w+@[a-z0-9]+\.[a-z]+$/i;
		let result = false;
		
		if (re.test(email)) {
			result = true;
		} else {
			this.responseFail('请检查邮箱格式哦~');
		}
		
		return result;
	}
	
	async checkEmailAvalible(email) {
	
	}
}


module.exports = Register;

