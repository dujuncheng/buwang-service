const errCode = require("../config/errCode");
const BaseClass = require('./baseClass.js');

class CancelReviewThis extends BaseClass{
    constructor() {
        super();
    }

    async run(ctx, next) {
        let paramOk = this.checkParams(['birthTime'])

        if (!paramOk) {
            return next();
        }
        // 判断该BLOG是否存在
        let blogArr =  await this.ReviewModel.getBlogArrByBirthTime(this.param.birthTime);

        if (!blogArr) {
            this.responseFail('读取数据库，该blog并不存在');
        }
        if (blogArr.length === 0) {
            this.responseFail('数据库中没有该blog的信息', errCode.NO_BLOG);
            return next();
        }

        // 从数据库中的记录减去1
        let reviewTime = 0
        if (blogArr[0].has_review - 1 >= 0) {
            reviewTime = blogArr[0].has_review - 1;
        } else {
            reviewTime = 0;
        }

        let nextNotifyTime = this.getNextReviewTime(reviewTime);

        try {
            let updateRes = await this.ReviewModel.updateBlogReviewNotice(this.param.birthTime, nextNotifyTime, reviewTime);
            if (!updateRes) {
                this.responseFail('复习次数取消失败');
                return next();
            }
            ctx.body = {
                success:true,
                message: '复习次数取消成功'
            }
            return next();
        } catch (e) {
            this.responseFail('复习次数取消失败', errCode.UPDATE_STATE_FAIL);
            return next();
        }
    }
}


// export { DeleteFile }

module.exports = CancelReviewThis;
