const errCode = require("../config/errCode");
const BaseClass = require('./baseClass.js');

class SetReviewThis extends BaseClass{
    constructor() {
        super();
    }

    async run(ctx, next) {
        try  {
            // type 1 是设置为复习状态 ， type 0 是取消复习状态
            let paramOk = this.checkParams(['note_id', 'type'])

            if (!paramOk) {
                return next();
            }
            if (typeof this.param.note_id !== 'number' ||
                typeof this.param.type !== 'number'
            ) {
                throw new Error('参数数据格式不正确')
                return
            }
            // 判断该BLOG是否存在
	        let result = await this.checkHasOneNote(this.param.note_id, this.uid);
	        if (!result) {
		        this.responseFail('该note不唯一或不存在', 3);
		        return next();
	        }
	        

            // 是否需要复习
            let needReview = this.param.type;
            // 已经复习了多少次，第一次是0次
            let reviewNum = 0;
            // 默认的复习频率是怎么样的
            let frequency = 0;
            // 下次复习是什么时间
            let nextNotifyTime = 0;

            // 从【不复习】-> 【复习】
            if (needReview) {
                reviewNum = 0;
                frequency = 3;
                nextNotifyTime = this.getNextReviewTime(reviewNum, frequency);
            } else {
            //  从【复习】-> 【不复习】
                reviewNum = 0;
                frequency = 0;
                nextNotifyTime = 0;
            }


            let param = {
                frequency,
                note_id: this.param.note_id,
                nextNotifyTime,
                needReview,
                reviewNum
            }
            let updateRes = await this.NoteModel.updateBlogReviewNotice(param);
            if (!updateRes) {
                throw new Error('设置复习状态失败')
                return next();
            }
            ctx.body = {
                success:true,
                message: '设置成功',
                data: {}
            }
            return next();
        } catch (e) {
            this.responseFail(e.message || "设置复习状态失败", errCode.UPDATE_STATE_FAIL);
            return next();
        }
    }
}



module.exports = SetReviewThis;
