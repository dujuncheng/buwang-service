
class BaseModel {
  constructor() {

  }

  makeSelector(selector) {
    let str = '';
    const keys = Object.keys(selector);

    for (let i = 0; i < keys.length; i++) {
      str = `${str + keys[i]}=${selector[keys[i]]}`;
      if (i !== keys.length - 1) {
        str = `${str}AND`;
      }
    }
  }

  /**
	 * [f1,f2,f3] 转成 'f1,f2,f3'
	 * @param arr
	 */
  arrToString(arr) {
    let str = '';
    if (!arr || arr.length === 0) {
      return '*';
    }
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      str += item;
      if (i !== arr.length - 1) {
        str = `${str},`;
      }
    }
    return str;
  }

  /**
   * 把对象变成 'note_id = 1 AND id = 0'
   * @param obj  { note_id: 1, id: 0 }
   * @param join AND
   * @returns {string}
   */
  objToString(obj, join = 'AND') {
    let result = '';
    if (obj && Object.keys(obj).length > 0) {
      const keys = Object.keys(obj);
      const tmp = [];
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] !== undefined && obj[keys[i]] !== undefined) {
          tmp.push(` ${keys[i]} = ${obj[keys[i]]} `);
        }
      }
      result = `${tmp.join(join)}`;
    } else {
      result = '';
    }
    return result;
  }
}


module.exports = BaseModel;
