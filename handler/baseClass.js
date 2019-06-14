const NoteModel                  = require('../model/NoteModel.js');
const CatalogModel               = require('../model/catalogModel.js');
const UserModel                  = require('../model/UserModel.js');
const errCode                    = require("../config/errCode");
const _                          = require('underscore');
const getSession                 = require('../library/session.js');


class BaseClass {
    constructor() {
        this.ctx = '';
        this.param = {};
        this.NoteModel = NoteModel.instance();
        this.CatalogModel = CatalogModel.instance();
        this.UserModel = UserModel.instance();
    }
    async handler(ctx, next) {
        this.ctx = ctx;
	    this.uid = await getSession().checkLogin(ctx, next);

	    if (!this.uid) {
	    	this.responseFail('无效的会话',2);
	    	return next;
	    }
	    
	    // 设置cookie
	    // await getSession().setLogin(1, ctx);
	    
        await this.run(ctx, next);
        ctx.set('Access-Control-Allow-Origin','*');
        ctx.set('Access-Control-Allow-Methods','get,post');
        ctx.set('Access-Control-Allow-Headers','content-type')
    }
    getRequestParam(paramName) {
        let method = this.ctx.request.method.toLowerCase();
        let result = '';

        if (method === 'get') {
            result = this.ctx.request.query[paramName];
        } else if (method === 'post') {
            result = this.ctx.request.body[paramName];
        }

        return result;
    }
    /**
     * 校验传过来的参数是否都有
     * @param arr
     * @returns {boolean}
     */
    checkParams (arr) {
        let result = true;

        for (let i = 0; i < arr.length; i++) {
            let param = arr[i];
            let value = this.getRequestParam(param);
            if (_.isUndefined(value)) {
                result = false;
            } else {
                this.param[param] = value;
            }
        }

        if (result === false) {
            this.responseFail('参数缺失', errCode.NOT_VALID_PARAM);
        }
        return result;
    }
    /**
     * 设置失败的时候返回值
     * @param message
     * @param errCode
     */
    responseFail (message, errCode) {
        this.ctx.body = {
            success: false,
            err_code: errCode || 0,
            message: message || '操作失败'
        }
    }

    /**
     * 获取到下次复习的记忆时长，单位s
     * @param reviewNum 从数据库中拿出来的值 + 1， 目前已经复习了多少次
     * @returns {number}
     */
    getNextReviewTime(reviewNum, frequency) {
        if (!frequency) {
            frequency = 3
        }
        let factor = 1
        switch (frequency) {
            case 1:
                factor = 2;
                break
            case 2:
                factor = 1.5;
                break
            case 3:
                factor = 1;
                break
            case 4:
                factor = 0.85;
                break
            case 5:
                factor = 0.7
                break
        }
        let nextReviewSecond = 0;
        if (reviewNum === 0) {
            nextReviewSecond = 30 * 60 * factor;
        } else if (reviewNum === 1) {
            nextReviewSecond = 12 * 60 * 60 * factor;
        } else if (reviewNum === 2) {
            nextReviewSecond = 24 * 60 * 60 * factor;
        } else if (reviewNum === 3) {
            nextReviewSecond = 2 * 24 * 60 * 60 * factor;
        } else if (reviewNum === 4) {
            nextReviewSecond = 4 * 24 * 60 * 60 * factor;
        } else if (reviewNum === 5) {
            nextReviewSecond = 7 * 24 * 60 * 60 * factor;
        } else if (reviewNum === 6) {
            nextReviewSecond = 15 * 24 * 60 * 60 * factor;
        } else if (reviewNum === 7) {
            nextReviewSecond = 30 * 24 * 60 * 60 * factor;
        } else if (reviewNum === 8) {
            nextReviewSecond = 50 * 24 * 60 * 60 * factor;
        } else if (reviewNum === 8) {
            nextReviewSecond = 80 * 24 * 60 * 60 * factor;
        } else if (reviewNum === 9) {
            nextReviewSecond = 140 * 24 * 60 * 60 * factor;
        } else if (reviewNum === 10) {
            nextReviewSecond = 200 * 24 * 60 * 60 * factor;
        } else if (reviewNum === 10) {
            nextReviewSecond = 300 * 24 * 60 * 60 * factor;
        } else if (reviewNum === 10) {
            nextReviewSecond = 400 * 24 * 60 * 60 * factor;
        } else {
            nextReviewSecond = 400 * 24 * 60 * 60 * factor;
        }

        let now = Math.floor(Date.now() / 1000);
        let reviewTime = now + nextReviewSecond;
        return reviewTime;
    }
	
	/**
	 * 设置失败的时候返回值
	 * @param message
	 * @param errCode
	 */
	responseFail(message, errCode) {
		this.ctx.body = {
			success: false,
			err_code: errCode || 0,
			message: message || '操作失败',
		};
	}
	
	/*
	 * 设置成功的时候返回值
	 * @param message
	 * @param errCode
	 */
	responseSuccess(message, errCode, data) {
		this.ctx.body = {
			success: true,
			err_code: errCode || 0,
			message: message || '操作成功',
			data,
		};
	}
}


module.exports = BaseClass;
