const BaseClass = require('./baseClass.js');

const ORDER_MAP = {
  1: 'gmt_create ASC',
  2: 'gmt_create DESC',
  3: 'gmt_modify ASC',
  4: 'gmt_modify DESC',
  5: 'notify_time ASC',
  6: 'notify_time DESC',
  7: 'review_num ASC',
  8: 'review_num DESC',
  9: 'frequency ASC',
  10: 'frequency DESC',
};

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

      const order = this.getRequestParam('order') || 2;

      const noteList = await this.NoteModel.getNoteArrOrderBy([
        'id',
        'note_id',
        'title',
        'content',
        'need_review',
        'notify_time',
        'frequency',
        'review_num',
      ], {
        catalog_id: this.param.catalog_id,
        note_id: this.param.note_id,
        user_id: this.uid,
        state: 1,
      }, [
        ORDER_MAP[order],
        'id ASC',
      ]);
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
