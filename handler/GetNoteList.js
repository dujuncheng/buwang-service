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
            let paramOk = this.checkParams(['catalog_id']);

            if (!paramOk) {
                throw new Error('参数不正确')
                return next();
            }

            if (typeof this.param.catalog_id !== 'number') {
                throw new Error('参数不正确')
                return next();
            }
            
            let noteList = await this.NoteModel.getArrByCatalogId(this.param.catalog_id, this.uid);
            if (noteList) {
                ctx.body = {
                    success: true,
                    data: {
                        noteList,
                    },
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
