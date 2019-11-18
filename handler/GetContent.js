const BaseClass = require('./baseClass.js');

class GetContent extends BaseClass {
  constructor() {
    super();
  }

  async run(ctx, next) {
    try {
      const paramOk = this.checkParams(['note_id']);

      if (!paramOk) {
        throw new Error('参数不正确');
        return next();
      }

      if (typeof this.param.note_id !== 'number') {
        throw new Error('参数不正确');
        return next();
      }
      
      let noteList = await this.NoteModel.getNoteArr(['id', 'note_id', 'title', 'content', 'need_review', 'notify_time', 'frequency', 'review_num'], {
        note_id: this.param.note_id,
        user_id: this.uid,
        state: this.state,
      });

      if (noteList && noteList[0]) {
        ctx.body = {
          success: true,
          data: {
            content: noteList[0],
          },
        };
      } else {
        this.responseFail('该用户没有该笔记', 0);
        return next();
      }
    } catch (e) {
      this.responseFail(e.message || '请求失败', 0);
      return next();
    }
  }
}


module.exports = GetContent;
