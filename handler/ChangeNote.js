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
        let paramOk = this.checkParams(['change_arr'])
        try {
            if (!paramOk) {
                return next();
            }

            if (!Array.isArray(this.param.change_arr)) {
	            throw new Error('参数格式不正确')
                return
            }

            let changeArr = this.param.change_arr;
            let noteIds = [];
            let obj = {}

            for (let i = 0; i < changeArr.length; i++) {
                let note_id = changeArr[i].note_id;
                if (!note_id) {
	                throw new Error('参数格式不正确')
                	return;
                }
                noteIds.push(note_id)
                obj[note_id] = {
                    title: changeArr[i].title,
                    content: changeArr[i].content,
                }
            }

            // 判断该BLOG是否存在
            let arr = await this.NoteModel.getArrByNoteIds(noteIds, this.uid);
            if (arr.length !== noteIds.length ||
                arr.length !== changeArr.length
            ) {
                throw new Error('您修改的内容中，有的在数据库中找不到');
                return
            }

            let updateRes = await this.NoteModel.updateNoteContent(noteIds, obj);
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
