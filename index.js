const PORT = process.env.PORT || 5000;
const ENV = process.env.ENV || "developmet";
const CONSTANT = require('./config/constant');
const FILTER = require('./helper/filter');
const MYSQL = require('mysql');
const CODE = require('./config/code').code();
const API_REGISTER = require('./config/register');
const API = API_REGISTER.get();
const APINOLOGIN = API_REGISTER.getUrlUnLogin();
const METHOD = 'POST';

global.Request = require('request');

var http = require('http');

// Db Connection
var DB = MYSQL.createPool({
    host: CONSTANT.get("mysql").host,
    user: CONSTANT.get("mysql").user,
    password: CONSTANT.get("mysql").pwd,
    database: CONSTANT.get("mysql").dbname,
    connectionLimit: 50,
    multipleStatements: true,
    charset: 'utf8mb4'
});

// Create Server
http.createServer(function (request, response) {
    var method = request.method;
    var url = request.url;
    var res;
//Headers for Response
    response.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'GET,POST'
    });

    let body = [];
    request.on('data', chunk => {
        body.push(chunk);
    }).on('end', async () => {
        body = Buffer.concat(body).toString();
        try {
            body = JSON.parse(body);
        } catch (e) {
            body = [];
        }
// Parameters to All API's       
        var myObject = {
            DB: DB,
            FILTER: FILTER,
            CONSTANT: CONSTANT,
            ENV: ENV,
            METHOD: METHOD,
            CODE: CODE,
            data: body,
            URL: url,
        }

        if (method !== (METHOD || 'POST')) {
            res = {
                status: false,
                msg: 'InvalidMethod'
            };
        } else if (API.indexOf(url) === -1) { // Check for Valid API 
            res = {
                status: false,
                msg: 'InvalidAPI'
            };
        } else {
            if (APINOLOGIN.indexOf(url) === -1) { // If API is valid only after Login
                var isLogin = require('./helper/checkLogin');
                var isLoginRes = await isLogin.init(myObject);
                if (!isLoginRes.status) {
                    response.end(JSON.stringify(isLoginRes), 'utf-8');
                    return;
                }
                myObject.userId = isLoginRes.data.uid;
            }
            var apps = require('./apps' + url);
            res = await apps.init(myObject);
        }
        response.end(JSON.stringify(res), 'utf-8');
    });

}).listen(PORT);


