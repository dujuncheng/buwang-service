let getDay = (leftSecond) => {
    let result = 0;
    result = Math.floor((leftSecond / (3600 * 24)));
    result = String(result);
    if (result.length === 1) {
        result = `0${result}`;
    }
    return result;
};
let getHour = (leftSecond, daynum) => {
    let result = 0;
    daynum = Number(daynum);
    leftSecond = leftSecond - (daynum * 3600 * 24);
    result = Math.floor((leftSecond / 3600));
    result = String(result);
    if (result.length === 1) {
        result = `0${result}`;
    }
    return result;
};
let getMute = (leftSecond, daynum, hournum) => {
    let result = 0;
    daynum = Number(daynum);
    hournum = Number(hournum);
    leftSecond = leftSecond - (daynum * 3600 * 24) - (hournum * 3600);
    result = Math.floor((leftSecond / 60));
    result = String(result);
    if (result.length === 1) {
        result = `0${result}`;
    }
    return result;
};
let getSecond = (leftSecond, daynum, hournum, minute) =>{
    let result = 0;
    daynum = Number(daynum);
    hournum = Number(hournum);
    minute = Number(minute);
    leftSecond = leftSecond - (daynum * 3600 * 24) - (hournum * 3600) - (minute * 60);
    result = leftSecond.toFixed(0);
    result = String(result);
    if (result.length === 0) {
        result = `0${result}`;
    }
    return result;
};

let getTime = (deadLine) => {
    let leftSecond = Number(deadLine) - (Date.now() / 1000);
    if (leftSecond <= 0) {
        return 0;
    }
    let day = getDay(leftSecond);
    let hour = getHour(leftSecond, day);
    let minute = getMute(leftSecond, day, hour);
    let second = getSecond(leftSecond, day, hour, minute);

    let str = `${day}天 ${hour}:${minute}:${second}`
    return str
}

export {getTime}
