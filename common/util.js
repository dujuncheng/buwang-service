const getRandomNum = (min, max, fix = 0) => {
	let res = '';
	let num = Math.random();
	let diff = max - min;
	
	res = ((diff * num) + min).toFixed(fix);
	return Number(res);
};

module.exports = {
	getRandomNum,
};
