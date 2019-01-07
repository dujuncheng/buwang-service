const base64            = require('js-base64');

// import {errCode} from "../config/errCode";
// import {BaseClass} from './baseClass.js'

const BaseClass = require("./baseClass.js");

class GetNoteList extends BaseClass{
    constructor() {
        super();
    }
    async run(ctx, next) {
        try {
            let paramOk = this.checkParams(['catalog_id'])

            if (!paramOk) {
                throw new Error('参数不正确')
                return next();
            }

            if (typeof this.param.catalog_id !== 'number') {
                throw new Error('参数不正确')
                return next();
            }

            let blogArr = await this.NoteModel.getArrByCatalogId(this.param.catalog_id, 1);
            if (blogArr) {
                ctx.body = {
                    success: true,
                    blogArr,
                }
            }
        } catch (e) {
            this.responseFail(e.message || '请求失败', 0);
            return next();
        }
    }
}


// export { ChangeOldBlog }

module.exports = GetNoteList;
