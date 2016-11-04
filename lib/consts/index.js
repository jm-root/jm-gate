var jm = require('jm-core');

var ERRCODE_GATE = 1000;
jm.ERR.gate = {
    FA_REGISTER_SERVICE: {
        err: ERRCODE_GATE++,
        msg: '注册服务信息失败'
    },

    FA_DEREGISTER_SERVICE: {
        err: ERRCODE_GATE++,
        msg: '注销服务信息失败'
    },

    FA_GET_SERVICE: {
        err: ERRCODE_GATE++,
        msg: '获取服务信息失败'
    },

    FA_LIST_SERVICE: {
        err: ERRCODE_GATE++,
        msg: '获取服务列表失败'
    }
};

module.exports = {
    ERR: jm.ERR
};
