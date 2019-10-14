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
      const noteList = await this.NoteModel.getContent(this.param.note_id, this.uid);

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
