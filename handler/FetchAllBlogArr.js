const base64            = require('js-base64');

// import {errCode} from "../config/errCode";
// import {BaseClass} from './baseClass.js'

const errCode = require("../config/errCode");
const BaseClass = require("./baseClass.js");

class FetchAllBlogArr extends BaseClass{
    constructor() {
        super();
    }
    async run(ctx, next) {
        let paramOk = this.checkParams(['page']);

        try {
            let blogArr = await this.ReviewModel.getAllBlogArr(this.param.birthTime);
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

module.exports = FetchAllBlogArr;
