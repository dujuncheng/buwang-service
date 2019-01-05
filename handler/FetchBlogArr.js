const base64            = require('js-base64');

// import {errCode} from "../config/errCode";
// import {BaseClass} from './baseClass.js'

const errCode = require("../config/errCode");
const BaseClass = require("./baseClass.js");

class FetchBlogArr extends BaseClass{
    constructor() {
        super();
    }
    async run(ctx, next) {
        let paramOk = this.checkParams(['birthTime'])

        if (!paramOk) {
            return next();
        }

        try {
            let blogArr = await this.ReviewModel.getBlogArrByBirthTime(this.param.birthTime);
            if (blogArr) {
                ctx.body = {
                    success: true,
                    blogArr,
                }
            }
        } catch (e) {
            console.log(e);
            this.responseFail('查询blogArr失败', errCode.UPDATE_CONTNET_FAIL);
            return next();
        }
    }
}


// export { ChangeOldBlog }

module.exports = FetchBlogArr;
