const base64            = require('js-base64');


const errCode = require("../config/errCode");
const BaseClass = require("./baseClass.js");

class GetReviewList extends BaseClass{
    constructor() {
        super();
    }
    async run(ctx, next) {
        try {
            let noteArr = await this.NoteModel.getReviewList(this.uid);
            if (!noteArr || !Array.isArray(noteArr)) {
                throw new Error('查询noteArr失败')
                return
            }
            ctx.body = {
                success: true,
                review_list:noteArr,
            }
            return next();
        } catch (e) {
            console.log(e);
            this.responseFail('查询noteArr失败', errCode.UPDATE_CONTNET_FAIL);
            return next();
        }
    }
}


// export { ChangeOldBlog }

module.exports = GetReviewList;
