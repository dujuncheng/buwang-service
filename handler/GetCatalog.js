const base64            = require('js-base64');
const _                 = require('underscore');
const errCode           = require('../config/errCode.js');

const BaseClass = require('./baseClass.js');


class GetCatalog extends BaseClass{
    constructor() {
        super();
    }
    async run(ctx, next) {
        try {
            // todo 从cookie中拿到uid
            let catalogArr = await this.CatalogModel.getArrByUid(1);
            let catalogTree = await this.makeCatalogTree(catalogArr);
            ctx.body = {
                success: true,
                message: '',
                data: {
                    catalog_tree: catalogTree || [],
                }
            }
            return next();

        } catch (e) {
            ctx.body = {
                success: false,
                message: e.message || '请求失败'
            }
            return next();
        }
    }
    async makeCatalogTree(arr) {
        let result = [];
        for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i].parent_id === 0) {
                let obj = arr.splice(i, 1)[0];
                obj.label = obj.name;
                obj.note_num = await this.getNoteNum(obj.catalog_id);
                result.push(obj);
            }
        }

        for (let i = 0; i < result.length; i++) {
            result[i].children = await this.findChild(result[i].catalog_id, arr)
        }
        return result;
    }
    async findChild(parent_id, arr) {
        let result = [];
        for (let i = arr.length - 1; i >= 0; i--) {
            if (parent_id === arr[i].parent_id) {
                let obj = arr.splice(i, 1)[0];
                obj.label = obj.name;
                obj.note_num = await this.getNoteNum(obj.catalog_id);
                obj.children = await this.findChild(obj.catalog_id, arr)
                result.push(obj);
            }
        }
        return result;
    }
    async getNoteNum(catalog_id) {
        // todo user_id
        let noteArr = await this.NoteModel.getArrByCatalogId(catalog_id, 1);
        return noteArr.length;
    }
}


module.exports = GetCatalog;

