const errCode = require("../config/errCode");
const BaseClass = require('./baseClass.js');

class SetFrequency extends BaseClass{
    constructor() {
        super();
    }

    async run(ctx, next) {
        try  {
            // type 1 是设置为复习状态 ， type 0 是取消复习状态
            let paramOk = this.checkParams(['note_id', 'frequency'])

            if (!paramOk) {
                return next();
            }
            if (typeof this.param.note_id !== 'number' ||
                typeof this.param.frequency !== 'number'
            ) {
                throw new Error('参数数据格式不正确')
                return next();
            }
            // 判断该BLOG是否存在
            let blogArr =  await this.NoteModel.getArrByNoteId(this.param.note_id);

            if (blogArr.length !== 1) {
                throw new Error('该笔记在数据库中不唯一')
                return
            }
            // 判断改笔记的复习状态
            let note = blogArr[0];
            if (note.need_review === 0) {
                throw new Error('该笔记现在还不是待复习状态呢')
                return
            }
            let frequency = this.param.frequency;
            let note_id = this.param.note_id;

            let param = {
                frequency,
                note_id
            }
            let updateRes = await this.NoteModel.updateBlogReviewFrequecy(param);
            if (!updateRes) {
                throw new Error('设置复习状态失败')
                return next();
            }
            ctx.body = {
                success:true,
                message: '设置成功',
                data: {}
            }
            return next();
        } catch (e) {
            this.responseFail(e.message || "设置复习状态失败", errCode.UPDATE_STATE_FAIL);
            return next();
        }
    }
}



module.exports = SetFrequency;