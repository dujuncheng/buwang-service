const base64 = require('js-base64');
const BaseClass = require('./baseClass.js');

class GetBlog extends BaseClass {
  constructor() {
    super({ needLogin: false });
  }

  async run(ctx, next) {
    try {
      const paramOk = this.checkParams(['note_id']);

      if (!paramOk) {
        throw new Error('参数不正确');
      }

      // if (typeof base64.decode(this.param.note_id) !== 'number') {
      //   throw new Error('参数不正确');
      // }

      const field = ['content', 'user_id', 'title', 'gmt_create', 'gmt_modify'];
      const where = {
        note_id: this.param.note_id,
        state: 1,
        publish: 1,
      };
      const noteList = await this.NoteModel.getNoteArr(field, where);
      const noteInfo = noteList && noteList[0] ? noteList && noteList[0] : '';

      const userList = await this.UserModel.getUserArr(['nickname'], { id: noteInfo.user_id });
      const userInfo = userList && userList[0] ? userList && userList[0] : '';

      if (noteList && noteList[0]) {
        ctx.body = {
          success: true,
          data: {
            content: noteInfo,
            user_info: userInfo,
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

  getUserInfo() {

  }
}


module.exports = GetBlog;
