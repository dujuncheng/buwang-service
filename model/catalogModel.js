const SqlString                         = require('sqlstring');
const _                                 = require('underscore');
const xss                               = require('xss');

const mysql = require('../common/mysql.js');
const dbConf = require('../config/db.js');


const filteremoji = (originText) => {
    if (_.isUndefined(originText) || typeof originText !== 'string') {
        return originText;
    }
    let ranges = [
        '\ud83c[\udf00-\udfff]',
        '\ud83d[\udc00-\ude4f]',
        '\ud83d[\ude80-\udeff]',
    ];
    let newText = originText.replace(new RegExp(ranges.join('|'), 'g'), '');
    return newText;
};

class CatalogModel {
    constructor() {}

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
            _.isUndefined(catalog_id) ||
            _.isUndefined(user_id) ||
            _.isUndefined(parent_id) ||
            _.isUndefined(name)
        ) {
            throw new Error('写入数据库参数缺失');
        }

        let fieldStr = dbConf.catalogTableField.join(',');

        let valueArr = [];
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
        console.log(sql)
        console.log(valueArr)
        console.log(dbConf.dbName)
        let result = await mysql.bindSql(sql, valueArr, dbConf.dbName);
        return result;
    }

    /**
     *  根据catalog_id找到所有记录
     * @param catalog_id
     * @returns {Promise<T>}
     */
    async getArrByCatalogId(
        catalog_id
    ) {
        if (catalog_id === undefined) {
            return false;
        }
        let sql = `SELECT * FROM catalog_table WHERE catalog_id = ${catalog_id} AND state = 1`;

        let res = await mysql.runSql(sql, dbConf.dbName)
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
        user_id
    ) {
        if (user_id === undefined) {
            return false;
        }
        let sql = `SELECT * FROM catalog_table WHERE user_id = ${user_id} AND state = 1`;

        let res = await mysql.runSql(sql, dbConf.dbName)
            .catch((err) => {
                console.log(err);
            });
        return res;
    }

    /**
     *
     * @param birthTime
     * @param content
     * @returns {Promise<*>}
     */
    async updateBlogContent(birthTime, content) {
        if(_.isUndefined(content) || _.isUndefined(birthTime)) {
            return false;
        }
        let sql = `UPDATE review_table
                SET
                content = '${content}',
                is_changed = '1',
                gmt_modify = '${new Date().getTime() / 1000}'
                WHERE birth_time = '${birthTime}'`;

        let res = await mysql.runSql(sql, dbConf.dbName)
            .catch((err) => {
                console.log(err);
            });
        return res;
    }

    /**
     * 更新blog的状态
     * @param path
     * @param state
     * @returns {Promise<*>}
     */
    async updateBlogState(path, state) {
        if(_.isUndefined(path) || _.isUndefined(state)) {
            return false;
        }
        let sql = `UPDATE review_table
                SET
                state = '${state}',
                gmt_modify = '${new Date().getTime() / 1000}'
                WHERE file_path = '${path}'`;

        let res = await mysql.runSql(sql, dbConf.dbName)
            .catch((err) => {
                console.log(err);
            });
        return res;
    }

    /**
     * 更新catalog的目录
     * @param name
     * @param path
     * @param birth_time
     * @returns {Promise<*>}
     */
    async moveCatalog(catalog_id, user_id, parent_id) {
        if(_.isUndefined(catalog_id) || _.isUndefined(user_id) || _.isUndefined(parent_id)) {
            return false;
        }
        let sql = `UPDATE catalog_table
                SET
                parent_id = '${parent_id}',
                gmt_modify = '${new Date().getTime() / 1000}'
                WHERE user_id = '${user_id}' AND catalog_id = '${catalog_id}'`;

        let res = await mysql.runSql(sql, dbConf.dbName)
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
    /**
     * 根据birthTime来查找数据
     * @param birthTime
     * @returns {Promise<T>}
     */
    async getBlogArrByBirthTime(birthTime) {
        if (_.isUndefined(birthTime)) {
            throw new Error('读取数据库参数缺失');
        }
        let sql = `SELECT * FROM review_table WHERE birth_time = ${birthTime}`;

        let res = await mysql.runSql(sql, dbConf.dbName)
            .catch((err) => {
                console.log(err);
            });
        return res;
    }

    /**
     * 根据path来查找数据
     * @param birthTime
     * @returns {Promise<T>}
     */
    async getBlogArrByFilePath(path) {
        if (_.isUndefined(path)) {
            throw new Error('读取数据库参数缺失');
        }
        let sql = `SELECT * FROM review_table WHERE file_path = '${path}'`;

        let res = await mysql.runSql(sql, dbConf.dbName)
            .catch((err) => {
                console.log(err);
            });
        return res;
    }

    async updateBlogReviewNotice(birthTime, nextNotifyTime, reviewNum) {
        if(_.isUndefined(birthTime) || _.isUndefined(nextNotifyTime) || _.isUndefined(reviewNum)) {
            return false;
        }
        let sql = `UPDATE review_table
                SET
                notify_time = '${nextNotifyTime}',
                has_review = '${reviewNum}',
                gmt_modify = '${new Date().getTime() / 1000}'
                WHERE birth_time = '${birthTime}'`;

        let res = await mysql.runSql(sql, dbConf.dbName)
            .catch((err) => {
                console.log(err);
            });
        return res;
    }

    async getAllBlogArr() {
        let sql = `SELECT * FROM review_table WHERE state = 1 ORDER BY notify_time`;

        let res = await mysql.runSql(sql, dbConf.dbName)
            .catch((err) => {
                console.log(err);
            });
        return res;
    }
}

CatalogModel.instances = {};

module.exports = CatalogModel;
