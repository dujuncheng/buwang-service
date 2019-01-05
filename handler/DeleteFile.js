const base64            = require('js-base64');

const errCode = require("../config/errCode");
const BaseClass = require('./baseClass.js');

class DeleteFile extends BaseClass{
    constructor() {
        super();
    }
    async run(ctx, next) {
        let paramOk = this.checkParams(['filePath'])

        if (!paramOk) {
            return next();
        }
        // 判断该BLOG是否存在
        let blogArr =  await this.ReviewModel.getBlogArrByFilePath(this.param.filePath);
        if (blogArr.length === 0) {
            this.responseFail('数据库中没有该blog的信息', errCode.NO_BLOG);
            return next();
        }

        try {
            let updateRes = await this.ReviewModel.updateBlogState(this.param.filePath, 0);
            if (!updateRes) {
                this.responseFail('文件state更新失败', errCode.UPDATE_STATE_FAIL);
                return next();
            }
            ctx.body = {
                success:true,
                message: '文件state更新成功'
            }
            return next();
        } catch (e) {
            this.responseFail('文件state更新失败', errCode.UPDATE_STATE_FAIL);
            return next();
        }
    }
}


// export { DeleteFile }

module.exports = DeleteFile;
