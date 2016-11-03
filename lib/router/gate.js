var cluster = require('cluster');
var jm = require('jm-ms-core');
var ms = jm.ms;
var consts = require('../consts');
var ERR = consts.ERR;

/**
 * @apiDefine Error
 *
 * @apiSuccess (Error 200) {Number} err 错误代码
 * @apiSuccess (Error 200) {String} msg 错误信息
 *
 * @apiExample {json} 错误:
 *     {
 *       err: 错误代码
 *       msg: 错误信息
 *     }
 */
module.exports = function(service, opts) {
    opts = opts || {};
    service.routes = service.routes || {};
    var gate = service.gate;
    var routes = service.routes;

    var package = require('../../package.json');
    routes.help = function(opts, cb, next){
        var o = {
            name: package.name,
            version: package.version
        };
        if (cluster.isWorker) {
            o.clusterId = cluster.worker.id;
        }
        cb(null, o);
    };

    routes.validator = function(opts, cb, next) {
        opts.data.name = opts.params.name || null;
        opts.data.id || (opts.data.id = opts.params.id);
        next();
    };

    /**
     * @apiGroup gate
     * @apiVersion 0.0.1
     * @apiUse Error
     *
     * @api {post} /:name 注册服务信息
     * @apiName registerService
     *
     * @apiParam {String} [id] 服务ID
     * @apiParam {String} [address] 地址
     * @apiParam {Number} [port] port
     * @apiParam {Object} [tags] 标签
     * @apiParam {Object} [check] 健康检查
     * @apiParam {Object} [checks] 健康检查数组
     *
     * @apiSuccess {Boolean} ret 返回结果
     * @apiExample {json} 成功:
     *     {
     *       ret: true
     *     }
     * @apiExample {json} 失败:
     *     {
     *       ret: false
     *     }
     */
    routes.registerService = function(opts, cb) {
        gate.registerService(opts.data, function(err, doc){
            if(!err) doc = {ret: doc};
            cb(err, doc);
        });
    };

    /**
     * @apiGroup gate
     * @apiVersion 0.0.1
     * @apiUse Error
     *
     * @api {get} /:name 获取服务信息
     * @apiName getService
     *
     * @apiSuccess {Boolean} ret 返回结果
     * @apiExample {json} 成功:
     *     {
     *       ret: 服务信息
     *     }
     */
    routes.getService = function(opts, cb) {
        gate.getService(opts.data, function(err, doc){
            if(!err) doc = {ret: doc};
            cb(err, doc);
        });
    };

    /**
     * @apiGroup gate
     * @apiVersion 0.0.1
     * @apiUse Error
     *
     * @api {delete} /:name 注销服务信息
     * @apiName deregisterService
     *
     * @apiSuccess {Boolean} ret 返回结果
     * @apiExample {json} 成功:
     *     {
     *       ret: true
     *     }
     * @apiExample {json} 失败:
     *     {
     *       ret: false
     *     }
     */
    routes.deregisterService = function(opts, cb) {
        gate.deregisterService(opts.data, function(err, doc){
            if(!err) doc = {ret: doc};
            cb(err, doc);
        });
    };

    /**
     * @apiGroup gate
     * @apiVersion 0.0.1
     * @apiUse Error
     *
     * @api {get} /:name/list 列出所有服务项
     * @apiName listService
     *
     * @apiSuccess {String[]} rows 返回结果
     * @apiExample {json} 成功:
     *     {
     *       rows: 服务项数组
     *     }
     */
    routes.listService = function(opts, cb) {
        gate.listService(opts.data, function(err, doc){
            if(!err) doc = {rows: doc};
            cb(err, doc);
        });
    };

    var _help = function(opts, cb, next){routes.help(opts, cb, next);};
    var _validator = function(opts, cb, next){routes.validator(opts, cb, next);};
    var _registerService = function(opts, cb, next){routes.registerService(opts, cb, next);};
    var _getService = function(opts, cb, next){routes.getService(opts, cb, next);};
    var _deregisterService = function(opts, cb, next){routes.deregisterService(opts, cb, next);};
    var _listService = function(opts, cb, next){routes.listService(opts, cb, next);};

    var router = ms();
    router
        .use(function(opts, cb, next){
            opts.data || (opts.data = {});
            next();
        })
        .add('/', 'get', _help)
        .add('/:name/list', 'get', _validator, _listService)
        .add('/:name', 'get', _validator, _getService)
        .add('/:name', 'post', _validator, _registerService)
        .add('/:id', 'delete', _validator, _deregisterService)
    ;
    return router;

};
