const errCode = require('../config/errCode');
const BaseClass = require('./baseClass.js');

class SetReviewThis extends BaseClass {
  constructor() {
    super();
  }

  async run(ctx, next) {
    try {
      debugger;
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

      await this.checkNote();

      const set = {
        publish: this.param.type === 1 ? 1 : 0,
      };
      const where = {
        note_id: this.param.note_id,
      };
      const updateRes = await this.NoteModel.updateNote(set, where);

      if (!updateRes) {
        throw new Error('设置失败');
      }

      ctx.body = {
        success: true,
        message: '设置成功',
        data: {},
      };
      return next();
    } catch (e) {
      this.responseFail(e.message || '设置失败', errCode.UPDATE_STATE_FAIL);
      return next();
    }
  }

  // 判断该note是否存在
  async checkNote(next) {
    const noteArr = await this.NoteModel.getNoteArr(
      ['id'], {
        note_id: this.param.note_id,
        uid: this.uid,
        state: 1,
      },
    );
    if (!noteArr || noteArr.length !== 1) {
      this.responseFail('该note不唯一或不存在', 3);
      return next();
    }
  }
}


module.exports = SetReviewThis;
