const base64            = require('js-base64');
const _                 = require('underscore');
const errCode           = require('../config/errCode.js');

const BaseClass = require('./baseClass.js');


class AddNewNote extends BaseClass{
    constructor() {
        super();
    }
    async run(ctx, next) {
        try {
            // 检查params
            let paramsOk = this.checkParams(['note_id', 'catalog_id']);
            if (!paramsOk) {
                return next();
            }
            if (
                typeof this.param.catalog_id !== 'number' ||
                typeof this.param.note_id !== 'number'
            ) {
                throw new Error('参数格式不对');
                return
            }

            this.param.title = this.getRequestParam('title');
            this.param.content = this.getRequestParam('content');

            // 确保这个note之前是没有的
	        let result = await this.checkHasOneNote(this.param.note_id, this.uid);
	        if (result) {
		        this.responseFail('该note不唯一或不存在', 3);
		        return next();
	        }
            
            let catalogArr = await this.CatalogModel.getArrByCatalogId(this.param.catalog_id, this.uid);
            if (catalogArr.length !== 1) {
                throw new Error('目录不唯一，或者不存在');
                return
            }

            let nextNotifyTime = this.getNextReviewTime(0);

            let res = await this.NoteModel.addNewNote(
                this.param.note_id,
	            this.uid,
                this.param.catalog_id,
                this.param.title,
                this.param.content,
                nextNotifyTime,
            );
            if (res) {
                ctx.body = {
                    success: true,
                    message: 'addNewNote成功啦'
                }
                return next();
            } else {

                ctx.body = {
                    success: false,
                    message: 'addNewBlog失败啦'
                }
                return next();
            }
        } catch (e) {
            this.responseFail(e.message || '网络错误', 0);
            return next();
        }
    }
}


module.exports = AddNewNote;

