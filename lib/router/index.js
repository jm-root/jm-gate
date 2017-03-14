module.exports = function(opts) {
    var service = this;
    return require('./gate')(service, opts);
};
