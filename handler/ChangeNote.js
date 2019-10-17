const base64 = require('js-base64');

// import {errCode} from "../config/errCode";
// import {BaseClass} from './baseClass.js'

const errCode = require('../config/errCode');
const BaseClass = require('./baseClass.js');

// 修改标题和内容
class ChangeNote extends BaseClass {
  constructor() {
    super();
  }

  async run(ctx, next) {
    const paramOk = this.checkParams(['change_arr']);
    try {
      if (!paramOk) {
        return next();
      }

      if (!Array.isArray(this.param.change_arr)) {
	      throw new Error('参数格式不正确');
      }

      const changeArr = this.param.change_arr;
      const noteIds = [];
      const obj = {};

      for (let i = 0; i < changeArr.length; i++) {
        const { note_id } = changeArr[i];
        if (note_id && Number(note_id) > 0) {
          noteIds.push(note_id);
          obj[note_id] = {
            title: changeArr[i].title,
            content: changeArr[i].content,
          };
        }
      }

      // 判断该BLOG是否存在
      const arr = await this.NoteModel.getArrByNoteIds(noteIds, this.uid);
      if (!arr || arr.length === 0) {
        throw new Error('您修改的内容中，有的在数据库中找不到');
      }

      const updateRes = await this.NoteModel.updateNoteContent(noteIds, obj);
      if (updateRes) {
        ctx.body = {
          success: true,
          message: '内容更新成功啦',
        };
        return next();
      }
      this.responseFail('内容更新失败', errCode.UPDATE_CONTNET_FAIL);
      return next();
    } catch (e) {
      this.responseFail(e.message || '内容更新失败', errCode.UPDATE_CONTNET_FAIL);
      return next();
    }
  }
}

module.exports = ChangeNote;
