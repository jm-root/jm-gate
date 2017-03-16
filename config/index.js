require('log4js').configure(__dirname + '/log4js.json');
var config = {
    development: {
        port: 21000,
        consul: {
            host: '127.0.0.1'
        },
        modules: {
            gate: {
                module: process.cwd() + '/lib'
            }
        }
    },
    production: {
        port: 21000,
        consul: {
            host: 'consul.db'
        },
        modules: {
            gate: {
                module: process.cwd() + '/lib'
            }
        }
    }
};

var env = process.env.NODE_ENV||'development';
config = config[env]||config['development'];
config.env = env;

module.exports = config;
