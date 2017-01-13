var config = {
    development: {
        port: 21000,
        prefix: '/gate',
        consul: {
            host: '10.9.74.238'
        },
        ms: [
            {
                type: 'ws'
            },
            {
                type: 'http'
            }
        ]
    },
    production: {
        port: 21000,
        prefix: '/gate',
        consul: {
            host: '10.9.74.238'
        },
        ms: [
            {
                type: 'ws'
            },
            {
                type: 'http'
            }
        ]
    }
};

var env = process.env.NODE_ENV||'development';
config = config[env]||config['development'];
config.env = env;

['port', 'prefix'].forEach(function(key) {
    process.env[key] && (config[key]=process.env[key]);
});

['host', 'port'].forEach(function(key) {
    process.env['consul_' + key] && (config.consul[key]=process.env['consul_' + key]);
});

module.exports = config;
