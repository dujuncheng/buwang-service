const SqlString = require('sqlstring');
const _ = require('underscore');
const xss = require('xss');


const BaseModel = require('./BaseModel.js');

const mysql = require('../common/mysql.js');
const dbConf = require('../config/db.js');


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

class NoteModel extends BaseModel {
  constructor() {
    	super();
  }

  static instance() {
    const clazz = 'NoteModel';
    if (!NoteModel.instances[clazz]) {
      NoteModel.instances[clazz] = new this();
    }
    return NoteModel.instances[clazz];
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
     *  增加一条笔记的记录
     * @param fileName
     * @param filePath
     * @param notifyTime
     * @param content
     * @returns {Promise<T>}
     */
  async addNewNote(
    note_id,
    user_id,
    catalog_id,
    title,
    content,
    notify_time,
  ) {
    if (
      _.isUndefined(note_id)
            || _.isUndefined(user_id)
            || _.isUndefined(catalog_id)
            || _.isUndefined(notify_time)

    ) {
      throw new Error('写入数据库参数缺失');
      return;
    }

    if (!title) {
      title = '';
    }

    if (!content) {
      content = '';
    }

    const fieldStr = dbConf.noteTableField.join(',');

    //[
    //     'id',
    //     'note_id',
    //     'user_id',
    //     'catalog_id',
    //     'title',
    //     'content',
    //     'need_review',
    //     'notify_time',
    //     'frequency',
    //     'review_num',
    //     'state',
    //     'gmt_create',
    //     'gmt_modify'
    //   ]
    const valueArr = [];
    valueArr.push(0);
    valueArr.push(note_id);
    valueArr.push(user_id);
    valueArr.push(catalog_id);
    valueArr.push(title);
    valueArr.push(content);
    valueArr.push(1);
    valueArr.push(notify_time);
    valueArr.push(3);
    valueArr.push(0);
    valueArr.push(1);
    valueArr.push(Date.now() / 1000);
    valueArr.push(Date.now() / 1000);
    
    let values = ''
    for (let i = 0; i < valueArr.length; i++) {
      if ( i === valueArr.length - 1) {
        values = values + '?'
      } else {
        values = values + '?,'
      }
    }
    const sql = `INSERT INTO note_table (${fieldStr}) VALUES (${values})`;
    const result = await mysql.bindSql(sql, valueArr, dbConf.dbName);
    return result;
  }


  /**
	 * 根据 @noteId 和 @uid 找出 state ==1 的笔记
	 * @param noteId
	 * @param uid
	 * @returns {Promise<*>}
	 */
  async getContent(noteId, uid) {
    	if (!noteId || !uid) {
    		return false;
	    }
	    const sql = `SELECT * FROM note_table WHERE
        note_id = '${noteId}'
        AND
        user_id = ${uid}
        AND
        state = 1
        `;

	    const res = await mysql.runSql(sql, dbConf.dbName)
	    .catch((err) => {
		    console.log(err);
	    });
	    return res;
  }

  /**
     *
     * @param note_id
     * @param content
     * @returns {Promise<*>}
     */
  async updateNoteContent(noteIds, obj) {
    if (_.isUndefined(noteIds)) {
      return false;
    }
    const ids = `(${noteIds.join(',')})`;

    let contentStr = '';
    const keyArr = Object.keys(obj);
    for (let i = 0; i < keyArr.length; i++) {
      const str = ` WHEN ${keyArr[i]} THEN '${obj[keyArr[i]].content}'`;
      contentStr += str;
    }

    let titleStr = '';
    for (let i = 0; i < keyArr.length; i++) {
      const str = ` WHEN ${keyArr[i]} THEN '${obj[keyArr[i]].title}'`;
      titleStr += str;
    }

    const sql = `UPDATE note_table
            SET content = CASE note_id
                ${contentStr}
            END,
            title = CASE note_id
                ${titleStr}
            END,
            gmt_modify = '${new Date().getTime() / 1000}'
        WHERE note_id IN ${ids}`;

    const res = await mysql.runSql(sql, dbConf.dbName)
      .catch((err) => {
        console.log(err);
      });
    return res;
  }

  /**
     * 更新note的状态
     * @param note_id
     * @param state
     * @returns {Promise<*>}
     */
  async updateNoteState(note_id, state) {
    if (_.isUndefined(note_id) || _.isUndefined(state)) {
      return false;
    }
    const sql = `UPDATE note_table
                SET
                state = '${state}',
                gmt_modify = '${new Date().getTime() / 1000}'
                WHERE note_id = '${note_id}'`;

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

  async getNoteArrOrderBy(field, where, orders) {
    const whereStr = this.objToString(where);
    const fieldStr = this.arrToString(field);
    const orderStr = this.arrToString(orders);

    const sql = `SELECT ${fieldStr} FROM note_table ${whereStr ? `WHERE${whereStr}` : ''} ${orders ? `ORDER BY ${orderStr}` : ''}`;

    const res = await mysql.runSql(sql, dbConf.dbName)
      .catch((err) => {
        console.log(err);
      });
    return res;
  }

  async getNoteArr(field, where, pageNum, pageSize) {
    const whereStr = this.objToString(where);
    const fieldStr = this.arrToString(field);

    let sql = `SELECT ${fieldStr} FROM note_table ${whereStr ? `WHERE${whereStr}` : ''} `;

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

  /**
     * 根据note_ids 来查找数据
     * @param birthTime
     * @returns {Promise<T>}
     */
  async getArrByNoteIds(noteIds, uid) {
    if (_.isUndefined(noteIds)) {
      throw new Error('读取数据库参数缺失');
      return;
    }
    const str = `(${noteIds.join(',')})`;
    const sql = `SELECT id FROM note_table WHERE note_id IN ${str} AND state = 1 AND user_id = ${uid}`;

    const res = await mysql.runSql(sql, dbConf.dbName)
      .catch((err) => {
        console.log(err);
      });
    return res;
  }

  /**
     * 修改复习数据
     * @param note_id    笔记id
     * @param nextNotifyTime  下次的复习时间
     * @param reviewNum       已经复习的次数
     * @returns {Promise<*>}
     */
  async updateBlogReviewNotice({
    noteId, nextNotifyTime, reviewNum, needReview, frequency,
  }) {
    if (_.isUndefined(noteId) || _.isUndefined(nextNotifyTime) || _.isUndefined(reviewNum)) {
      return false;
    }
    const sql = `UPDATE note_table
                SET
                notify_time = '${nextNotifyTime}',
                review_num = '${reviewNum}',
                need_review = '${needReview}',
                frequency = '${frequency}',
                gmt_modify = '${new Date().getTime() / 1000}'
                WHERE note_id = '${noteId}'`;

    const res = await mysql.runSql(sql, dbConf.dbName)
      .catch((err) => {
        console.log(err);
      });
    return res;
  }

  /**
   * 修改笔记的数据
   * @param set { publish: 1 }
   * @param where {note_id: 2}
   * @returns {Promise<*>}
   */
  async updateNote(set, where) {
    if (!set || Object.keys(set).length === 0 || !where || Object.keys(where).length === 0) {
      return false;
    }
    const whereStr = this.objToString(where, 'AND');
    const setStr = this.objToString(set, ',');
    const sql = `UPDATE
                note_table
                SET
                ${setStr},
                gmt_modify = '${new Date().getTime() / 1000}'
                WHERE ${whereStr}`;

    const res = await mysql.runSql(sql, dbConf.dbName)
      .catch((err) => {
        console.log(err);
      });
    return res;
  }

  /**
     * 设置笔记的复习因子，1，2，3，4，5 共5个等级
     * @param note_id 笔记id
     * @param frequency 复习因子
     * @returns {Promise<*>}
     */
  async updateBlogReviewFrequecy({ note_id, frequency }) {
    if (_.isUndefined(note_id) || _.isUndefined(frequency)) {
      return false;
    }
    const sql = `UPDATE note_table
                SET
                frequency = '${frequency}',
                gmt_modify = '${new Date().getTime() / 1000}'
                WHERE note_id = '${note_id}'`;

    const res = await mysql.runSql(sql, dbConf.dbName)
      .catch((err) => {
        console.log(err);
      });
    return res;
  }

  /**
	 * 获取复习列表
	 * @param uid
	 * @param limit   限制 false | 20, 40
	 * @param offset
	 * @param field
	 * @returns {Promise<*>}
	 */
  async getReviewList(uid, limit = 20, offset = 0, field = [
    	'note_id',
	    'catalog_id',
	    'title',
	    'content',
	    'need_review',
	    'notify_time',
	    'frequency',
	    'review_num',
  ]) {
    	if (uid === undefined) {
    		return false;
	    }
    	const fieldStr = this.arrToString(field);
    	const now = Math.floor(new Date().getTime() / 1000);
    	let sql = '';
    	if (limit === false) {
		    sql = `SELECT ${fieldStr}
	        FROM note_table
	        WHERE state = 1
	        AND need_review = 1
	        AND user_id = ${uid}
	        AND notify_time < ${now}
	        ORDER BY
	        notify_time DESC,
	        id ASC
	        `;
	    } else {
		    sql = `SELECT ${fieldStr}
	        FROM note_table
	        WHERE state = 1
	        AND need_review = 1
	        AND user_id = ${uid}
	        AND notify_time < ${now}
	        ORDER BY
	        notify_time DESC,
	        id ASC
	        LIMIT ${limit}
	        OFFSET ${offset}
	        `;
	    }

    const res = await mysql.runSql(sql, dbConf.dbName)
      .catch((err) => {
        console.log(err);
      });
    return res;
  }

  // 获取待复习的num
  async getWaitNum(uid, field) {
    if (uid === undefined) {
      return false;
    }
    const fieldStr = this.arrToString(field);
    const now = Math.round(new Date().getTime() / 1000);
    const sql = `SELECT ${fieldStr}
	        FROM note_table
	        WHERE state = 1
	        AND need_review = 1
	        AND user_id = ${uid}
	        AND notify_time < ${now}
	        ORDER BY
	        notify_time ASC,
	        id ASC
	        `;

    const res = await mysql.runSql(sql, dbConf.dbName)
      .catch((err) => {
        console.log(err);
      });
    return res;
  }

  // 获取已复习的num
  async getDoneNum(uid, field) {
    if (uid === undefined) {
      return false;
    }
    const fieldStr = this.arrToString(field);
    const now = Math.round(new Date().getTime() / 1000);
    const sql = `SELECT ${fieldStr}
	        FROM note_table
	        WHERE state = 1
	        AND need_review = 1
	        AND user_id = ${uid}
	        AND notify_time > ${now}
	        ORDER BY
	        notify_time ASC,
	        id ASC
	        `;

    const res = await mysql.runSql(sql, dbConf.dbName)
      .catch((err) => {
        console.log(err);
      });
    return res;
  }
}

NoteModel.instances = {};

module.exports = NoteModel;
