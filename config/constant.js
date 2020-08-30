const ENV = process.env.ENV || "development";
const path = require('path');

const config = {
    development: {
        mysql: {
            host: 'localhost',
            port: 3306,
            user: 'root',
            pwd: 'kambin',
            dbname: 'regov',
            charset: 'utf8mb4',
            connLimit: 50
        }
    },
    staging: {
        mysql: {
            host: '',
            port: 3306,
            user: '',
            pwd: '',
            dbname: '',
            charset: '',
            connLimit: 50
        }
    },
    production: {
        mysql: {
            host: '',
            port: 3306,
            user: '',
            pwd: '',
            dbname: '',
            charset: '',
            connLimit: 50
        }
    }
};

exports.get = function (c) {
    return config[ENV][c];
};
