const base64            = require('js-base64');
const _                 = require('underscore');
const errCode           = require('../config/errCode.js');

const BaseClass = require('./baseClass.js');


class Login extends BaseClass{
	constructor() {
		super();
	}
	async run(ctx, next) {
		try {
			// 检查params
			let paramsOk = this.checkParams(['note_id', 'catalog_id']);
			if (!paramsOk) {
				return next();
			}
			
			
		} catch (e) {
			this.responseFail(e.message || '网络错误', 0);
			return next();
		}
	}
}


module.exports = Login;

