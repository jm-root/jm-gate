var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('../../sdk');
    Promise = require('bluebird');
}
var sdk = jm.sdk;
var logger = sdk.logger;
var utils = sdk.utils;
var gate = sdk.gate;

gate.client.on('open', function(){

    (function(){

        var configs = {
            test: {
                name: 'test',
                id: 'test_1',
                tag: 'mobile'
            },
            test1: {
                name: 'test',
                id: 'test_1',
                address: '127.0.0.1',
                port: 20000,
                tags: ['mobile']
            },
            test2: {
                name: 'test',
                id: 'test_2',
                address: '127.0.0.1',
                port: 20001,
                tags: ['mobile']
            },
            test3: {
                name: 'test',
                id: 'test_3',
                address: '127.0.0.1',
                port: 20002
            }
        };

        var log = function(err, doc){
            if (err) {
                logger.error(err.stack);
            }
            if(doc){
                logger.debug('%s', utils.formatJSON(doc));
            }
        };

        var done = function(resolve, reject, err, doc){
            log(err, doc);
            if (err) {
                reject(err, doc);
            } else {
                resolve(doc);
            }
        };

        var get = function(root){
            return new Promise(function(resolve, reject){
                logger.debug('%s 获取服务信息', root);
                gate.getService(configs[root], function(err, doc){
                    log(err, doc);
                    resolve(doc);
                });
            });
        };


        var set = function(root){
            return new Promise(function(resolve, reject){
                logger.debug('%s 设置服务信息', root);
                gate.registerService(configs[root], function(err, doc){
                    done(resolve, reject, err, doc);
                });
            });
        };

        var del = function(root){
            return new Promise(function(resolve, reject){
                logger.debug('%s 删除服务信息', root);
                gate.deregisterService({id: configs[root].id}, function(err, doc){
                    done(resolve, reject, err, doc);
                });
            });
        };

        var list = function(root){
            return new Promise(function(resolve, reject){
                logger.debug('%s 获取服务项列表', root);
                gate.listService(configs[root], function(err, doc){
                    done(resolve, reject, err, doc);
                });
            });
        };

        set('test1')
            .then(function(doc){
                return set('test2');
            })
            .then(function(doc){
                return set('test3');
            })
            .then(function(doc){
                return get('test');
            })
            .then(function(doc){
                return get('test');
            })
            .then(function(doc){
                return get('test');
            })
            .then(function(doc){
                return list('test');
            })
            .then(function(doc){
                return del('test');
            })
            .then(function(doc){
                return list('test');
            })
            .catch(SyntaxError, function(e) {
                logger.error(e.stack);
            })
            .catch(function(e) {
                logger.error(e.stack);
            });

    })();
});

