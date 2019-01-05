const errCode = require("../config/errCode");
const BaseClass = require('./baseClass.js');

class HasReviewThis extends BaseClass{
    constructor() {
        super();
    }

    async run(ctx, next) {
        let paramOk = this.checkParams(['birthTime'])

        if (!paramOk) {
            return next();
        }
        console.log(this.param.birthTime);
        // 判断该BLOG是否存在
        let blogArr =  await this.ReviewModel.getBlogArrByBirthTime(this.param.birthTime);

        if (!blogArr) {
            this.responseFail('读取数据库，该blog并不存在');
        }
        if (blogArr.length === 0) {
            this.responseFail('数据库中没有该blog的信息', errCode.NO_BLOG);
            return next();
        }

        let reviewTime = blogArr[0].has_review + 1;
        let nextNotifyTime = this.getNextReviewTime(reviewTime);

        try {
            let updateRes = await this.ReviewModel.updateBlogReviewNotice(this.param.birthTime, nextNotifyTime, reviewTime);
            if (!updateRes) {
                this.responseFail('复习次数增加失败');
                return next();
            }
            ctx.body = {
                success:true,
                message: '复习次数增加成功'
            }
            return next();
        } catch (e) {
            this.responseFail('复习次数增加失败', errCode.UPDATE_STATE_FAIL);
            return next();
        }
    }
}


// export { DeleteFile }

module.exports = HasReviewThis;
