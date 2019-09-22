const base64 = require('js-base64');
const BaseClass = require('./baseClass.js');

class GetUserBlog extends BaseClass {
  constructor() {
    super({ needLogin: false });
  }

  async run(ctx, next) {
    try {
      const paramOk = this.checkParams(['user_id', 'page', 'page_size']);

      if (!paramOk) {
        throw new Error('参数不正确');
      }

      // if (typeof base64.decode(this.param.note_id) !== 'number') {
      //   throw new Error('参数不正确');
      // }

      const field = ['content', 'title', 'gmt_create', 'gmt_modify'];
      const where = {
	      user_id: this.param.user_id,
        state: 1,
        publish: 1,
      };
      const noteList = await this.NoteModel.getNoteArr(field, where, this.param.page, this.param.page_size);

      if (noteList) {
        ctx.body = {
          success: true,
          data: {
            note_list: noteList,
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


module.exports = GetUserBlog;
