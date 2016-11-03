var jm = require('jm-core');
var consts = require('../consts');
var ERR = consts.ERR;

module.exports = function (service, opts) {
    var consul = service.consul;
    var obj = {
        _idx: 0,
        routers: {},

        /**
         * 默认路由, 轮询
         * @param opts
         * @param list
         * @param cb
         */
        defaultRouter: function(opts, list, cb) {
            var len = list.length;
            if(this._idx >= len) this._idx = 0;
            cb(null, list[this._idx++]);
        },

        /**
         * 注册服务信息
         * @method gate#registerService
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  name:  服务(必填)
         *  id:    id(可选)
         *  address: 地址(可选)
         *  port:   port(可选)
         *  tags:   标签(可选)
         *  check:  健康检查(可选)
         *  checks:  健康检查数组(可选)
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * 成功响应:
         * doc: 结果(true or false)
         * 错误响应:
         * doc: {
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        registerService: function(opts, cb) {
            var self = this;
            opts || (opts={});
            if(!opts.name){
                return cb(new Error(ERR.FA_PARAMS.msg), ERR.FA_PARAMS);
            }
            consul.agent.service.register(opts, function(err, doc) {
                if (err) {
                    cb(err, ERR.gate.FA_REGISTER_SERVICE);
                } else {
                    self.emit('registerService', opts);
                    cb(null, true);
                }
            });
        },

        /**
         * 注销服务信息
         * @method gate#deregisterService
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  id: (必填)
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * 成功响应:
         * doc: 结果(true or false)
         * 错误响应:
         * doc: {
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        deregisterService: function(opts, cb) {
            var self = this;
            opts || (opts={});
            if(!opts.id){
                return cb(new Error(ERR.FA_PARAMS.msg), ERR.FA_PARAMS);
            }
            consul.agent.service.deregister(opts, function(err, doc) {
                if (err) {
                    cb(err, ERR.gate.FA_DEREGISTER_SERVICE);
                } else {
                    self.emit('deregisterService', opts);
                    cb(null, true);
                }
            });
        },

        /**
         * 获取服务信息
         * @method gate#getService
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  name: 服务名称(必填)
         *  tag: 标签(可选)
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * 成功响应:
         * doc: 服务信息(对象)
         * 错误响应:
         * doc: {
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        getService: function(opts, cb) {
            opts || (opts={});
            if(!opts.name){
                return cb(new Error(ERR.FA_PARAMS.msg), ERR.FA_PARAMS);
            }
            var self = this;
            this.listService(opts, function(err, doc){
                if (err) {
                    cb(err, ERR.gate.FA_GET_SERVICE);
                } else {
                    if(!doc.length) return cb(new Error(ERR.FA_UNAVAILABLE.msg), ERR.FA_UNAVAILABLE);
                    var router = self.routers[opts.name] || self.defaultRouter;
                    router.call(self, opts, doc, cb);
                }
            });
        },


        /**
         * 列出所有入口项
         * @method gate#listService
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  name: 服务名称(必填)
         *  tag: 标签(可选)
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * 成功响应:
         * doc: 服务信息(数组)
         * 错误响应:
         * doc: {
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        listService: function(opts, cb) {
            opts || (opts={});
            if(!opts.name){
                return cb(new Error(ERR.FA_PARAMS.msg), ERR.FA_PARAMS);
            }
            consul.catalog.service.nodes({
                service: opts.name,
                tag: opts.tag
            }, function(err, doc) {
                if (err) {
                    cb(err, ERR.gate.FA_LIST_SERVICE);
                } else {
                    cb(null, doc);
                }
            });
        }

    };

    jm.enableEvent(obj);
    return obj;
};

