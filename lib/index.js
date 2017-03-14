/**
 * gate服务
 * @class gate
 * @param {Object} [opts={}] 参数
 * @example
 * opts参数:{
 *  consul: (必填, consul服务器配置)
 * }
 * @returns {Object}
 * @example
 * 返回结果:{
 *  gate: gate服务
 *  consul: consul服务
 * }
 */
module.exports = function(opts){
    opts = opts || {};
    opts.consul || (opts.consul={});
    ['host', 'port'].forEach(function(key) {
        process.env['consul_' + key] && (opts.consul[key]=process.env['consul_' + key]);
    });

    var o = require('./service')(opts);
    o.router = require('./router');
    return o;
};
