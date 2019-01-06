const base64            = require('js-base64');

// import {errCode} from "../config/errCode";
// import {BaseClass} from './baseClass.js'

const errCode = require("../config/errCode");
const BaseClass = require("./baseClass.js");

class MoveCatalog extends BaseClass{
    constructor() {
        super();
    }
    async run(ctx, next) {
        try {
            let paramOk = this.checkParams(['catalog_id', 'parent_id'])

            if (!paramOk) {
                return next();
            }

            if (
                typeof this.param.catalog_id !== 'number' ||
                typeof this.param.parent_id !== 'number'
            ) {
                throw new Error('参数格式正确')
                return;
            }

            // 确保parent_id不能是自己
            if (this.param.catalog_id === this.param.parent_id) {
                throw new Error('parent_id不能是自己')
                return;
            }

            // 确保catalog_id 是真的存在
            let catalogArr = await this.CatalogModel.getArrByCatalogId(this.param.catalog_id);
            if (!Array.isArray(catalogArr) || catalogArr.length !== 1) {
                throw new Error('catalog_id不唯一或不存在')
                return;
            }

            // 确保parent_id是真的存在
            if (this.param.parent_id !== 0) {
                let parentArr = await this.CatalogModel.getArrByCatalogId(this.param.parent_id);
                if (!Array.isArray(parentArr) || parentArr.length < 1) {
                    throw new Error('父目录不存在')
                    return;
                }
            }

            let updateRes = await this.CatalogModel.moveCatalog(this.param.catalog_id, 1, this.param.parent_id);
            if (updateRes) {
                ctx.body = {
                    success:true,
                    message: '移动成功'
                }
                return next();
            } else {
                this.responseFail('网络请求失败', errCode.MOVE_CATALOG_FAIL);
                return next();
            }
        } catch (e) {
            this.responseFail( e.message || '网络请求失败', errCode.MOVE_CATALOG_FAIL);
            return next();
        }
    }
}

module.exports = MoveCatalog;
