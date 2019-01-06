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
        const clazz = 'ReviewModel';
        if (!ReviewModel.instances[clazz]) {
            ReviewModel.instances[clazz] = new this();
        }
        return ReviewModel.instances[clazz];

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
     * @param fileName
     * @param filePath
     * @param notifyTime
     * @param content
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

        let fieldStr = dbConf.reviewTableField.join(',');

        let valueArr = [];
        // birth_time 文档的诞生时间，该值作为区分文件的唯一值
        valueArr.push(birthTime || 0);
        // name 文档的名称
        valueArr.push(fileName || '无名称');
        // file_path 文档的地址
        valueArr.push(filePath || '无路径');
        // notify_time 下次通知的时间
        valueArr.push(nextNotifyTime);
        // has_review  已经复习的次数
        valueArr.push(0);
        // is_changed 是否是被需改的
        valueArr.push(0);
        // content 文档内容
        valueArr.push(fileContent || '');
        // state 文档状态
        valueArr.push(1);
        // gmt_create 创建的时间
        valueArr.push(Date.now() / 1000);
        // gmt_modify 修改的时间
        valueArr.push(Date.now() / 1000);


        const sql = `INSERT INTO review_table (${fieldStr}) VALUES (?,?,?,?,?,?,?,?,?,?)`;
        let result = await mysql.bindSql(sql, valueArr, dbConf.dbName);
        return result;
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
     * 更新blog的name和path
     * @param name
     * @param path
     * @param birth_time
     * @returns {Promise<*>}
     */
    async updateNamePath(name, path, birth_time) {
        if(_.isUndefined(path) || _.isUndefined(name) || _.isUndefined(birth_time)) {
            return false;
        }
        let sql = `UPDATE review_table
                SET
                name = '${name}',
                file_path = '${path}',
                state = 1,
                gmt_modify = '${new Date().getTime() / 1000}'
                WHERE birth_time = '${birth_time}'`;

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
