const errCode = {
    NOT_VALID_PARAM: 101,
    CONTENT_DECODE_FAIL: 102,
    UPDATE_CONTNET_FAIL: 103,
    // 数据库中没有该blog
    NO_BLOG: 104,
    // 该blog的状态为0，也就是被删除了
    BLOG_STATE_0: 105,
    // 数据库中该记录的file_path 和前端传过来 不一样
    WRONG_PATH: 106,
    UPDATE_STATE_FAIL: 107,
    ADD_BUT_ALREADY_HAVE: 108,
    MOVE_CATALOG_FAIL: 109,
}



// export {errCode};

module.exports = errCode;
