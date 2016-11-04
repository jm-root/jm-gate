var jm = require('jm-core');

module.exports = function (opts) {
    opts = opts || {};
    var o = {};
    jm.enableEvent(o);
    o.consul = require('consul')(opts.consul);
    o.gate = require('./gate')(o, opts);
    return o;
};

