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
        let paramOk = this.checkParams(['fileName', 'filePath', 'fileContent', 'birthTime'])

        if (!paramOk) {
            return next();
        }
        // 解析出content
        // let decodeContent = ''
        // try {
        //     decodeContent  = base64.Base64.decode(this.param.fileContent);
        // } catch (e) {
        //     console.log(e)
        //     this.responseFail('decode失败', errCode.CONTENT_DECODE_FAIL);
        //     return next();
        // }

        // 判断该BLOG是否存在
        let blogArr =  await this.ReviewModel.getBlogArrByBirthTime(this.param.birthTime);
        if (blogArr.length === 0) {
            // 没有的话，则添加
            // let nextNotifyTime = this.getNextReviewTime(0);
            // let res = await this.ReviewModel.addNewBlog(
            //     this.param.birthTime,
            //     this.param.fileName,
            //     this.param.filePath,
            //     nextNotifyTime,
            //     this.param.fileContent,
            // );
            // if (res) {
            //     ctx.body = {
            //         success:true,
            //         message: '内容更新成功啦'
            //     }
            // }
            this.responseFail('数据库中没有该blog的信息', errCode.UPDATE_BUT_NO_BLOG);
            return next();
        }
        // 判断该BLOG state 状态
        if (blogArr[0].state === 0) {
            this.responseFail('数据库中该blog的state为0', errCode.UPDATE_BUT_BLOG_STATE_0);
            return next();
        }
        // 判断该BLOG的file_path name
        if (blogArr[0].file_path !== this.param.filePath || blogArr[0].name !== this.param.fileName) {
            this.responseFail('数据库中该blog name或者路径不对', errCode.UPDATE_BUT_WRONG_PATH);
            return next();
        }

        try {
            let updateRes = await this.ReviewModel.updateBlogContent(this.param.birthTime, this.param.fileContent);
            if (updateRes) {
                ctx.body = {
                    success:true,
                    message: '内容更新成功啦'
                }
                return next();
            } else {
                this.responseFail('内容更新失败', errCode.UPDATE_CONTNET_FAIL);
                return next();
            }
        } catch (e) {
            console.log(e);
            this.responseFail('内容更新失败', errCode.UPDATE_CONTNET_FAIL);
            return next();
        }
    }
}


// export { ChangeOldBlog }

module.exports = ChangeOldBlog;
