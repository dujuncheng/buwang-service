const errCode = require('../config/errCode');
const BaseClass = require('./baseClass.js');

class SetReviewThis extends BaseClass {
  constructor() {
    super();
  }

  async run(ctx, next) {
    try {
      // type 1 是设置为公开博客状态 ， type 0 是取消公开为博客
      const paramOk = this.checkParams(['note_id', 'type']);

      if (!paramOk) {
        return next();
      }
      if (typeof this.param.note_id !== 'number'
				|| typeof this.param.type !== 'number'
      ) {
        throw new Error('参数数据格式不正确');
      }
      // 判断该BLOG是否存在
      const result = await this.checkHasOneNote(this.param.note_id, this.uid);
      if (!result) {
        this.responseFail('该note不唯一或不存在', 3);
        return next();
      }

      const updateRes = await this.NoteModel.updateBlogReviewNotice(param);
      if (!updateRes) {
        throw new Error('设置复习状态失败');
      }
      ctx.body = {
        success: true,
        message: '设置成功',
        data: {},
      };
      return next();
    } catch (e) {
      this.responseFail(e.message || '设置复习状态失败', errCode.UPDATE_STATE_FAIL);
      return next();
    }
  }
}


module.exports = SetReviewThis;
