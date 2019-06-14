var Redis                       = require('ioredis');


let cache = ''

let init = () => {
	cache = new Redis();
}

let getRedis = () => {
	if (!cache) {
		cache = new Redis();
	}
	return cache;
}

module.exports = {
	init,
	getRedis,
}
