const base64 = require('js-base64');
const _ = require('underscore');
const errCode = require('../config/errCode.js');

const BaseClass = require('./baseClass.js');


class AddNewNote extends BaseClass {
  constructor() {
    super();
  }

  async run(ctx, next) {
    try {
      this.log(1);
      // 检查params
      const paramsOk = this.checkParams(['note_id', 'catalog_id']);
      if (!paramsOk) {
        return next();
      }
      if (
        typeof this.param.catalog_id !== 'number'
                || typeof this.param.note_id !== 'number'
      ) {
        throw new Error('参数格式不对');
      }

      this.param.title = this.getRequestParam('title');
      this.param.content = this.getRequestParam('content');

      // 确保这个note之前是没有的
      this.log(2);
      const result = await this.checkHasOneNote(this.param.note_id, this.uid);
      this.log(3);
      if (result) {
        this.responseFail('该note不唯一或不存在', 3);
        return next();
      }

      this.log(4);
      const catalogArr = await this.CatalogModel.getArrList(['id'], {
        catalog_id: this.param.catalog_id,
        user_id: this.uid,
      });
      this.log(5);
      if (catalogArr.length !== 1) {
        throw new Error('目录不唯一，或者不存在');
      }

      const nextNotifyTime = this.getNextReviewTime(0);

      this.log(6);
      const res = await this.NoteModel.addNewNote(
        this.param.note_id,
	      this.uid,
        this.param.catalog_id,
        this.param.title,
        this.param.content,
        nextNotifyTime,
      );
      this.log(7);
      if (res) {
        ctx.body = {
          success: true,
          message: 'addNewNote成功啦',
        };
        return next();
      }

      ctx.body = {
        success: false,
        message: 'addNewBlog失败啦',
      };
      return next();
    } catch (e) {
      this.responseFail(e.message || '网络错误', 0);
      return next();
    }
  }
}


module.exports = AddNewNote;
