const base64            = require('js-base64');

// import {errCode} from "../config/errCode";
// import {BaseClass} from './baseClass.js'

const errCode = require("../config/errCode");
const BaseClass = require("./baseClass.js");

class RenameCatalog extends BaseClass{
    constructor() {
        super();
    }
    async run(ctx, next) {
        try {
            let paramOk = this.checkParams(['catalog_id', 'new_name'])

            if (!paramOk) {
                return next();
            }

            if (
                typeof this.param.catalog_id !== 'number' ||
                typeof this.param.new_name !== 'string'
            ) {
                throw new Error('参数格式错误')
                return;
            }

            if (this.param.new_name.length === 0 || this.param.new_name.length > 200) {
                throw new Error('你这新名字的长度有点……emmmmm,反正不给你修改')
                return;
            }

            // 确保catalog_id 是真的存在
            let catalogArr = await this.CatalogModel.getArrByCatalogId(this.param.catalog_id, 1);
            if (!Array.isArray(catalogArr) || catalogArr.length !== 1) {
                throw new Error('catalog_id不唯一或不存在')
                return;
            }

            let updateRes = await this.CatalogModel.renameCatalog(this.param.catalog_id, this.param.new_name);
            if (updateRes) {
                ctx.body = {
                    success:true,
                    message: '重命名成功'
                }
                return next();
            } else {
                this.responseFail('网络请求失败', errCode.RENAME_CATALOG_FAIL);
                return next();
            }
        } catch (e) {
            this.responseFail( e.message || '网络请求失败', errCode.RENAME_CATALOG_FAIL);
            return next();
        }
    }
}

module.exports = RenameCatalog;
