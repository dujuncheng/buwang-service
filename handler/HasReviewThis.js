const errCode = require('../config/errCode');
const BaseClass = require('./baseClass.js');

class HasReviewThis extends BaseClass {
  constructor() {
    super();
  }

  async run(ctx, next) {
    try {
      const paramOk = this.checkParams(['note_id']);

      if (!paramOk) {
        return next();
      }
      if (typeof this.param.note_id !== 'number') {
        throw new Error('参数数据格式不正确');
      }
      // 判断该BLOG是否存在
      const noteArr = await this.NoteModel.getNoteArr(['review_num', 'frequency', 'id'], {
        user_id: this.uid,
        note_id: this.param.note_id,
      });
      if (!noteArr && !noteArr[0]) {
        this.responseFail('该note不存在', 3);
        return next();
      }

      const reviewNum = Number(noteArr[0].review_num) + 1;
      const frequency = Number(noteArr[0].frequency);
      const needReview = 1;
      let nextNotifyTime = ''
      
      const customReviewTime = this.ctx.request.body['nextReviewTime']
      
      if (!customReviewTime) {
        nextNotifyTime = this.getNextReviewTime(reviewNum, frequency);
      } else {
        nextNotifyTime = customReviewTime
      }
     

      const param = {
        frequency,
        noteId: this.param.note_id,
        reviewNum,
        nextNotifyTime,
        needReview,
      };
      const updateRes = await this.NoteModel.updateBlogReviewNotice(param);
      if (!updateRes) {
        throw new Error('复习次数增加失败');
        return next();
      }
      ctx.body = {
        success: true,
        message: '复习成功',
        data: {
          next_notify_time: nextNotifyTime,
        },
      };
      return next();
    } catch (e) {
      this.responseFail('复习次数增加失败', errCode.UPDATE_STATE_FAIL);
      return next();
    }
  }
}


// export { DeleteFile }

module.exports = HasReviewThis;
