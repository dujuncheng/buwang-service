const base64 = require('js-base64');
const _ = require('underscore');
const errCode = require('../config/errCode.js');

const BaseClass = require('./baseClass.js');


class GetCatalog extends BaseClass {
  constructor() {
    super();
  }

  async run(ctx, next) {
    try {
      this.log(1)
      // 把该用户所有的 笔记都找出来
      const catalogArr = await this.CatalogModel.getArrByUid(this.uid);
      this.log(2)
      // 变成树状的json格式
      const catalogTree = await this.makeCatalogTree(catalogArr);
      this.log(3)
      ctx.body = {
        success: true,
        message: '',
        data: {
          catalog_tree: catalogTree || [],
        },
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

  /**
	 * @ 把 arr 转化为 @json
	 * @param arr
	 * @returns {Promise<Array>}
	 */
  async makeCatalogTree(arr) {
    const result = [];
    for (let i = arr.length - 1; i >= 0; i--) {
      // 根节点
      if (arr[i].parent_id === 0) {
        const obj = arr.splice(i, 1)[0];
        obj.label = obj.name;
        this.log(4)
        obj.children = this.findChild(result[i].catalog_id, arr);
        obj.note_num = obj.children.length;
        this.log(5)
        result.push(obj);
      }
    }
    return result;
  }

  findChild(parent_id, arr) {
    const result = [];
    if (arr.length <= 0) {
      return result;
    }
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] && Number(parent_id) === Number(arr[i].parent_id)) {
        const obj = arr.splice(i, 1)[0];
        obj.label = obj.name;
        obj.children = this.findChild(obj.catalog_id, arr);
        obj.note_num = obj.children.length;
        result.push(obj);
      }
    }
    return result;
  }
}


module.exports = GetCatalog;
