const errCode = require("../config/errCode");
const BaseClass = require('./baseClass.js');

class SetReviewThis extends BaseClass{
    constructor() {
        super();
    }

    async run(ctx, next) {
        try {
            // type 1 是设置为复习状态 ， type 0 是取消复习状态
            let paramOk = this.checkParams(['note_id', 'type'])

            if (!paramOk) {
                return next();
            }
            if (typeof this.param.note_id !== 'number' ||
                typeof this.param.type !== 'number'
            ) {
                throw new Error('参数数据格式不正确')
            }
            // 判断该BLOG是否存在
            let blogArr =  await this.NoteModel.getArrByNoteId(this.param.note_id);

            if (blogArr.length !== 1) {
                throw new Error('该笔记在数据库中不唯一')
                return
            }
            // 判断改笔记的复习状态
            let note = blogArr[0];
            if (note.need_review === this.param.type) {
                if (this.param.type === 1) {
                    throw new Error('该笔记已经处于复习状态')
                } else {
                    throw new Error('该笔记已经处于取消复习的状态')
                }
            }

            // 已经复习了多少次，第一次是0次
            let reviewNum = 0;
            // 默认的复习频率是怎么样的
            let frequency = 3;
            let nextNotifyTime = this.getNextReviewTime(reviewNum, frequency);

            let updateRes = await this.NoteModel.updateBlogReviewNotice(this.param.note_id, nextNotifyTime, reviewNum);
            if (!updateRes) {
                throw new Error('复习次数增加失败')
                return next();
            }
            ctx.body = {
                success:true,
                message: '复习成功',
                data: {
                    next_notify_time: nextNotifyTime,
                }
            }
            return next();
        } catch (e) {
            this.responseFail('复习次数增加失败', errCode.UPDATE_STATE_FAIL);
            return next();
        }
    }
}


// export { DeleteFile }

module.exports = SetReviewThis;
