const BaseClass = require('./baseClass.js');

class CopyContent extends BaseClass {
  constructor() {
    super();
  }

  async run(ctx, next) {
    try {
      const noteList = await this.NoteModel.getAll(['note_id', 'content']);

      if (noteList && noteList[0]) {
        const arr = noteList[0];
        for (let i = 0; i < arr.length; i++) {
          const item = arr[i];
          item.note_id;
          item.content;
        }
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


module.exports = CopyContent;
