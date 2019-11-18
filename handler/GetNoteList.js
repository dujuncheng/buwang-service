const BaseClass = require('./baseClass.js');

class GetNoteList extends BaseClass {
  constructor() {
    super();
  }

  async run(ctx, next) {
    try {
      const paramOk = this.checkParams(['catalog_id']);

      if (!paramOk) {
        throw new Error('参数不正确');
        return next();
      }

      if (typeof this.param.catalog_id !== 'number') {
        throw new Error('参数不正确');
        return next();
      }

      const noteList = await this.NoteModel.getNoteArr(['id', 'note_id', 'title', 'content', 'need_review', 'notify_time', 'frequency', 'review_num'], {
        catalog_id: this.param.catalog_id,
        note_id: this.param.note_id,
        user_id: this.uid,
        state: this.state,
      });
      if (noteList) {
        ctx.body = {
          success: true,
          data: {
            noteList,
          },
        };
      }
    } catch (e) {
      this.responseFail(e.message || '请求失败', 0);
      return next();
    }
  }
}

module.exports = GetNoteList;
