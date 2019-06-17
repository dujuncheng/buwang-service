const base64            = require('js-base64');

// import {errCode} from "../config/errCode";
// import {BaseClass} from './baseClass.js'

const errCode = require("../config/errCode");
const BaseClass = require("./baseClass.js");

class RemoveCatalog extends BaseClass{
    constructor() {
        super();
    }
    async run(ctx, next) {
        try {
            let paramOk = this.checkParams(['catalog_id'])

            if (!paramOk) {
                return next();
            }

            if (
                typeof this.param.catalog_id !== 'number'
            ) {
                throw new Error('参数格式正确')
                return;
            }

            // 确保catalog_id 是真的存在
            let catalogArr = await this.CatalogModel.getArrByCatalogId(this.param.catalog_id, this.uid);
            if (!Array.isArray(catalogArr) || catalogArr.length !== 1) {
                throw new Error('catalog_id不唯一或不存在')
                return;
            }

            let updateRes = await this.CatalogModel.updateCatalogState(this.param.catalog_id, 0);
            if (updateRes) {
                ctx.body = {
                    success:true,
                    message: '删除成功'
                }
                return next();
            } else {
                this.responseFail('网络请求失败', 0);
                return next();
            }
        } catch (e) {
            this.responseFail( e.message || '网络请求失败', 0);
            return next();
        }
    }
}

module.exports = RemoveCatalog;
