var jm = jm || {};
if ((typeof exports !== 'undefined' && typeof module !== 'undefined')) {
    jm = require('jm-sdk-core');
    require('jm-ms');
}

(function () {
    if(jm.sdk.gate) return;
    var sdk = jm.sdk;
    var ms = jm.ms;

    sdk.on('init', function (opts) {
        var model = 'gate';
        opts[model] = opts[model] || {};
        opts[model].uri = opts[model].uri || opts.uri;
        opts[model].timeout = opts[model].timeout || opts.timeout;
        sdk[model].init(opts[model]);
    });

    /**
     * gate对象
     * @class  gate
     * @param {Object} [opts={}] 参数
     * @example
     * opts参数:{
     *  uri: 服务器uri(可选)
     * }
     */
    sdk.gate = {
        init: function (opts) {
            var self = this;
            opts = opts || {};
            var uri = opts.uri;
            var prefix = opts.prefix || '/gate';
            this.uri = uri + prefix;
            ms.client({
                uri: this.uri,
                timeout: opts.timeout || 0
            }, function(err, doc){
                self.client = doc;
            });
            jm.enableEvent(this);
        },

        _geturi: function(opts){
            return '/' + opts.name;
        },

        /**
         * 获取服务信息
         * @function gate#getService
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  name: 服务名称(必填)
         *  tag: 标签(可选)
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * doc参数:{
         *  ret: 服务信息
         *  }
         * 出错时, doc参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        getService: function (opts, cb) {
            var self = this;
            cb = cb || function () {
                };
            opts = opts || {};
            var url = this._geturi(opts);
            this.client.get({
                uri: url,
                data: opts
            }, cb);
        },

        /**
         * 注册服务信息
         * @function gate#registerService
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
         * doc参数:{
         *  ret: 结果(true or false)
         *  }
         * 出错时, doc参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        registerService: function (opts, cb) {
            var self = this;
            cb = cb || function () {
                };
            opts = opts || {};
            var url = this._geturi(opts);
            this.client.post({
                uri: url,
                data: opts
            }, cb);
        },

        /**
         * 注销服务信息
         * @function gate#deregisterService
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  id: 服务id(必填)
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * doc参数:{
         *  ret: 结果(true or false)
         *  }
         * 出错时, doc参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        deregisterService: function (opts, cb) {
            var self = this;
            cb = cb || function () {
                };
            opts = opts || {};
            var url = '/' + opts.id;
            this.client.delete({
                uri: url
            }, cb);
        },

        /**
         * 列出服务信息
         * @function gate#listService
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  name: 服务名称(必填)
         *  tag: 标签(可选)
         * }
         * @param {callback} [cb=function(err,doc){}] 回调
         * @example
         * cb参数格式:
         * doc参数: {
         *  rows: 服务信息数组
         *  }
         * 出错时, doc参数:{
         *  err: 错误码,
         *  msg: 错误信息
         * }
         */
        listService: function (opts, cb) {
            var self = this;
            cb = cb || function () {
                };
            opts = opts || {};
            var url = this._geturi(opts);
            this.client.get({
                uri: url,
                data: opts
            }, cb);
        }

    };

})();
