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

{
    var env = process.env;
    config.consul.host = env.consul_host || config.consul.host;
    config.consul.port = env.consul_port || config.consul.port;
}

module.exports = config;
