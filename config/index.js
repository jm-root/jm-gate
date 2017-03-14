require('log4js').configure(__dirname + '/log4js.json');
var config = {
    development: {
        port: 21000,
        consul: {
            host: '10.9.74.238'
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
            host: '10.9.74.238'
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
