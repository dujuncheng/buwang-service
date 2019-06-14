

class BaseModel {
	constructor() {
	
	}
	
	makeSelector(selector) {
		let str = '';
		let keys = Object.keys(selector);
		
		for (let i = 0; i < keys.length; i++) {
			str = str + keys[i] + '=' + selector[keys[i]];
			if (i !== keys.length - 1) {
				str = str + 'AND'
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
			let item = arr[i];
			str = str + item;
			if (i !== arr.length - 1) {
				str = `${str},`;
			}
		}
		return str;
	}
}



module.exports = BaseModel;
