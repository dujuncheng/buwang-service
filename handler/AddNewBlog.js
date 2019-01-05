const base64            = require('js-base64');
const _                 = require('underscore');
const errCode           = require('../config/errCode.js');

// import {BaseClass} from './baseClass.js';
const BaseClass = require('./baseClass.js');


class AddNewBlog extends BaseClass{
    constructor() {
        super();
    }
    async run(ctx, next) {
        // 检查params
        console.log('add new Blog');
        let paramsOk = this.checkParams(['fileName', 'filePath', 'birthTime']);
        if (!paramsOk) {
            return next();
        }

        let blogArr = this.ReviewModel.getBlogArrByBirthTime(this.birthTime);
        if (blogArr.length > 0) {
            this.responseFail('数据库中已经有该数据的记录了', errCode.ADD_BUT_ALREADY_HAVE);
            return next();
        }
        let nextNotifyTime = this.getNextReviewTime(0);
        let res = await this.ReviewModel.addNewBlog(
            this.param.birthTime,
            this.param.fileName,
            this.param.filePath,
            nextNotifyTime,
            ''
        );
        if (res) {
            ctx.body = {
                success: true,
                nextNotifyTime,
                message: 'addNewBlog成功啦'
            }
            return next();
        } else {
            ctx.body = {
                success: false,
                message: 'addNewBlog失败啦1'
            }
            return next();
        }

    }
}
module.exports = AddNewBlog;

