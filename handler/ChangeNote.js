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

            let content = this.getRequestParam('content')
            let title = this.getRequestParam('title')


            // 判断该BLOG是否存在
            let blogArr = await this.NoteModel.getArrByNoteId(this.param.note_id);
            if (blogArr.length !== 1) {
                throw new Error('数据库中note的数据不唯一或不存在');
            }

            let updateRes = await this.NoteModel.updateNoteContent(this.param.note_id, content, title);
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
