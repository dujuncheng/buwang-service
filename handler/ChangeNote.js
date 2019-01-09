const base64            = require('js-base64');

// import {errCode} from "../config/errCode";
// import {BaseClass} from './baseClass.js'

const errCode = require("../config/errCode");
const BaseClass = require("./baseClass.js");

// 修改标题和内容
class ChangeNote extends BaseClass{
    constructor() {
        super();
    }
    decodeContent(content) {
        // 解析出content
        let decodeContent = ''
        try {
            decodeContent  = base64.Base64.decode(content);
        } catch (e) {
            console.log(e)
            this.responseFail('decode失败', errCode.CONTENT_DECODE_FAIL);
            return next();
        }
    }
    async run(ctx, next) {

        let paramOk = this.checkParams(['note_id'])
        try {
            if (!paramOk) {
                return next();
            }

            if (typeof this.param.note_id !== 'number') {
                throw new Error('参数格式不正确')
            }


            // 判断该BLOG是否存在
            let blogArr =  await this.ReviewModel.getBlogArrByBirthTime(this.param.birthTime);
            if (blogArr.length === 0) {
                throw new Error('数据库中没有该blog的信息');
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
            this.responseFail(e.message || '内容更新失败', errCode.UPDATE_CONTNET_FAIL);
            return next();
        }
    }
}


// export { ChangeOldBlog }

module.exports = ChangeNote;
