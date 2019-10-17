const base64 = require('js-base64');
const _ = require('underscore');
const errCode = require('../config/errCode.js');

const BaseClass = require('./baseClass.js');


class AddNewCatalog extends BaseClass {
  constructor() {
    super();
  }

  async run(ctx, next) {
    try {
      // 检查params
      const paramsOk = this.checkParams(['catalog_id', 'parent_id', 'name']);
      if (!paramsOk) {
        return next();
      }
      if (
        typeof this.param.catalog_id !== 'number'
                || typeof this.param.parent_id !== 'number'
                || typeof this.param.name !== 'string'
      ) {
        throw new Error('参数格式不正确');
        return;
      }
      this.selfId = Number(this.param.catalog_id);
      this.parentId = Number(this.param.parent_id);
      this.name = String(this.param.name);

      if (this.name.length === 0) {
        this.responseFail('名字长度不能为0', errCode.NOT_VALID_PARAM);
        return next();
      }

      // 检查父目录是否存在
      if (this.parentId !== 0) {
	            const parentArr = await this.CatalogModel.getArrByCatalogId(this.parentId, this.uid);
	            if (parentArr.length === 0) {
		            this.responseFail('数据库中父目录不存在', errCode.ADD_BUT_ALREADY_HAVE);
		            return next();
	            }
      }

      // 检查创建的目录中，是否存在
      const catalogArr = await this.CatalogModel.getArrByCatalogId(this.selfId, this.uid);
      if (catalogArr.length > 0) {
        this.responseFail('数据库中已经有该数据的记录了', errCode.ADD_BUT_ALREADY_HAVE);
        return next();
      }

      const res = await this.CatalogModel.addNewCatalog(
        this.selfId,
        this.uid,
        this.parentId,
        this.name,
      );
      if (res) {
        ctx.body = {
          success: true,
          message: 'addNewCatalog成功啦',
        };
        return next();
      }

      ctx.body = {
        success: false,
        message: 'addNewCatalog失败啦',
      };
      return next();
    } catch (e) {
      ctx.body = {
        success: false,
        message: e.message || '请求失败',
      };
      return next();
    }
  }
}


module.exports = AddNewCatalog;
