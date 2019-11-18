const errCode = require('../config/errCode');
const BaseClass = require('./baseClass.js');

class GetReviewList extends BaseClass {
  constructor() {
    super();
  }

  async run(ctx, next) {
    try {
      // 检查params
      const paramsOk = this.checkParams(['page', 'page_size', 'need_page']);
      if (!paramsOk) {
        return next();
      }

      let noteArr = [];
      let waitNum = 0;
      let doneNum = 0;

      if (this.param.need_page) {
        const page = Number(this.param.page);
        const pageSize = Number(this.param.page_size);

        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        noteArr = await this.NoteModel.getReviewList(this.uid, limit, offset);
      } else {
        noteArr = await this.NoteModel.getReviewList(this.uid, false, 0);
      }

      const waitArr = await this.NoteModel.getWaitNum(this.uid, ['id']);
      if (waitArr && waitArr.length !== undefined) {
        waitNum = waitArr.length;
      }

      const doneArr = await this.NoteModel.getDoneNum(this.uid, ['id']);
      if (doneArr && doneArr.length !== undefined) {
        doneNum = doneArr.length;
      }
      if (!noteArr || !Array.isArray(noteArr)) {
        throw new Error('查询noteArr失败');
      }
      ctx.body = {
        success: true,
        review_list: noteArr,
        wait_num: waitNum,
        done_num: doneNum,
      };
      return next();
    } catch (e) {
      this.responseFail('查询noteArr失败', errCode.UPDATE_CONTNET_FAIL);
      return next();
    }
  }
}


// export { ChangeOldBlog }

module.exports = GetReviewList;
