const SqlString = require('sqlstring');
const _ = require('underscore');
const xss = require('xss');

const mysql = require('../common/mysql.js');
const dbConf = require('../config/db.js');
const BaseModel = require('./BaseModel.js');


const filteremoji = (originText) => {
  if (_.isUndefined(originText) || typeof originText !== 'string') {
    return originText;
  }
  const ranges = [
    '\ud83c[\udf00-\udfff]',
    '\ud83d[\udc00-\ude4f]',
    '\ud83d[\ude80-\udeff]',
  ];
  const newText = originText.replace(new RegExp(ranges.join('|'), 'g'), '');
  return newText;
};

class CatalogModel extends BaseModel {
  constructor() {
    	super();
  }

  static instance() {
    const clazz = 'CatalogModel';
    if (!CatalogModel.instances[clazz]) {
      CatalogModel.instances[clazz] = new this();
    }
    return CatalogModel.instances[clazz];
  }

  filter(str) {
    if (_.isUndefined(str)) {
      return false;
    }
    let result = str;

    result = filteremoji(result);
    result = SqlString.format(result);
    result = xss(result);

    return result;
  }

  /**
     *  增加一条目录的信息
     * @param catalog_id
     * @param user_id
     * @param parent_id
     * @param name
     * @returns {Promise<T>}
     */
  async addNewCatalog(
    catalog_id,
    user_id,
    parent_id,
    name,
  ) {
    if (
      _.isUndefined(catalog_id)
            || _.isUndefined(user_id)
            || _.isUndefined(parent_id)
            || _.isUndefined(name)
    ) {
      throw new Error('写入数据库参数缺失');
      return;
    }

    const fieldStr = dbConf.catalogTableField.join(',');

    const valueArr = [];
    // id 自增的id
    valueArr.push(0);
    // catalog_id 目录的id
    valueArr.push(catalog_id);
    // user_id
    valueArr.push(user_id);
    // parent_id 父目录的id
    valueArr.push(parent_id);
    // name 目录名称
    valueArr.push(name);
    // state 目录是否还在
    valueArr.push(1);
    // gmt_create 创建的时间
    valueArr.push(Date.now() / 1000);
    // gmt_modify 修改的时间
    valueArr.push(Date.now() / 1000);

    const sql = `INSERT INTO catalog_table (${fieldStr}) VALUES (?,?,?,?,?,?,?,?)`;

    const result = await mysql.bindSql(sql, valueArr, dbConf.dbName);
    return result;
  }
  
  /**
   * 根据传入的参数，返回对应的数组
   * @param field
   * @param where
   * @param pageNum
   * @param pageSize
   * @returns {Promise<T>}
   */
  async getArrList(field, where, pageNum, pageSize) {
    const whereStr = this.objToString(where);
    const fieldStr = this.arrToString(field);
    
    let sql = `SELECT ${fieldStr} FROM catalog_table ${whereStr ? `WHERE${whereStr}` : ''} `;
    
    // 如果传入分页
    if (pageNum !== undefined && pageSize !== undefined) {
      const start = pageNum - 1 < 0 ? 0 : pageNum - 1;
      sql += `LIMIT ${start * pageSize}, ${pageSize}`;
    }
    const res = await mysql.runSql(sql, dbConf.dbName)
    .catch((err) => {
      console.log(err);
    });
    return res;
  }
  
  async getArrByCatalogId(
    catalog_id,
    user_id,
  ) {
    if (catalog_id === undefined) {
      return false;
    }
    const sql = `SELECT * FROM catalog_table WHERE catalog_id = ${catalog_id} AND state = 1 AND user_id = ${user_id}`;

    const res = await mysql.runSql(sql, dbConf.dbName)
      .catch((err) => {
        console.log(err);
      });
    return res;
  }

  /**
     *  根据user_id找到所有记录
     * @param user_id
     * @returns {Promise<T>}
     */
  async getArrByUid(
    user_id,
  ) {
    if (user_id === undefined) {
      return false;
    }
    const sql = `SELECT * FROM catalog_table WHERE user_id = ${user_id} AND state = 1`;

    const res = await mysql.runSql(sql, dbConf.dbName)
      .catch((err) => {
        console.log(err);
      });
    return res;
  }

  /**
     *
     * @param catalog_id
     * @param new_name
     * @returns {Promise<*>}
     */
  async renameCatalog(catalog_id, new_name) {
    if (_.isUndefined(catalog_id) || _.isUndefined(new_name)) {
      return false;
    }
    const sql = `UPDATE catalog_table
                SET
                name = '${new_name}',
                gmt_modify = '${new Date().getTime() / 1000}'
                WHERE catalog_id = '${catalog_id}'`;

    const res = await mysql.runSql(sql, dbConf.dbName)
      .catch((err) => {
        console.log(err);
      });
    return res;
  }


  /**
     * 更新catalog的状态
     * @param catalog_id
     * @param state
     * @returns {Promise<*>}
     */
  async updateCatalogState(catalog_id, state) {
    if (_.isUndefined(catalog_id) || _.isUndefined(state)) {
      return false;
    }
    const sql = `UPDATE catalog_table
                SET
                state = '${state}',
                gmt_modify = '${new Date().getTime() / 1000}'
                WHERE catalog_id = '${catalog_id}'`;

    const res = await mysql.runSql(sql, dbConf.dbName)
      .catch((err) => {
        console.log(err);
      });
    return res;
  }

  /**
     * 更新catalog的目录
     * @param catalog_id
     * @param user_id
     * @param parent_id
     * @returns {Promise<*>}
     */
  async moveCatalog(catalog_id, user_id, parent_id) {
    if (_.isUndefined(catalog_id) || _.isUndefined(user_id) || _.isUndefined(parent_id)) {
      return false;
    }
    const sql = `UPDATE catalog_table
                SET
                parent_id = '${parent_id}',
                gmt_modify = '${new Date().getTime() / 1000}'
                WHERE user_id = '${user_id}' AND catalog_id = '${catalog_id}'`;

    const res = await mysql.runSql(sql, dbConf.dbName)
      .catch((err) => {
        console.log(err);
      });
    return res;
  }

  /**
     * 过滤 xss
     * @param str
     * @returns {*}
     */
  filter(str) {
    if (_.isUndefined(str)) {
      return false;
    }
    let result = str;

    result = filteremoji(result);
    result = SqlString.format(result);
    result = SqlString.escape(result);
    result = xss(result);

    return result;
  }

  async getAllBlogArr() {
    const sql = 'SELECT * FROM review_table WHERE state = 1 ORDER BY notify_time';

    const res = await mysql.runSql(sql, dbConf.dbName)
      .catch((err) => {
        console.log(err);
      });
    return res;
  }
}

CatalogModel.instances = {};

module.exports = CatalogModel;
