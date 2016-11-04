var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('../../sdk');
}

var sdkConfig = sdkConfig || {
    uri: 'ws://localhost:21000'
};
jm.sdk.init(sdkConfig);

if (typeof module !== 'undefined' && module.exports) {
    require('./gate.js');
}
