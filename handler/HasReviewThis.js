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
        return;
      }
      // 判断该BLOG是否存在
	        const result = await this.checkHasOneNote(this.param.note_id, this.uid);
	        if (!result) {
		        this.responseFail('该note不唯一或不存在', 3);
		        return next();
	        }

      const reviewNum = Number(result[0].review_num) + 1;
      const frequency = Number(result[0].frequency);
      const needReview = 1;
      const nextNotifyTime = this.getNextReviewTime(reviewNum, frequency);

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
