const base64            = require('js-base64');

// import {errCode} from "../config/errCode";
// import {BaseClass} from './baseClass.js'

const errCode = require("../config/errCode");
const BaseClass = require("./baseClass.js");

class ChangeOldBlog extends BaseClass{
    constructor() {
        super();
    }
    async run(ctx, next) {
        let paramOk = this.checkParams(['fileName', 'filePath', 'birthTime'])

        if (!paramOk) {
            return next();
        }

        try {
            let updateRes = await this.ReviewModel.updateNamePath(this.param.fileName, this.param.filePath, this.param.birthTime);
            if (updateRes) {
                ctx.body = {
                    success:true,
                    message: '更新名字或者path成功'
                }
                return next();
            } else {
                this.responseFail('更新名字或者path失败', errCode.UPDATE_CONTNET_FAIL);
                return next();
            }
        } catch (e) {
            console.log(e);
            this.responseFail('更新名字或者path失败', errCode.UPDATE_CONTNET_FAIL);
            return next();
        }
    }
}


// export { ChangeOldBlog }

module.exports = ChangeOldBlog;
