exports.init = function (p) {
    var err = false;
    var DB = p.DB,
        FILTER = p.FILTER,
        ENV = p.ENV;

    //filter
    var check = FILTER.isDefine(p.data, 'token', 'string'); //only number and string
    if (!check.status) {
        return check;
    }
    var check = FILTER.isDefine(p.data, 'secret', 'string'); //only number and string
    if (!check.status) {
        return check;
    }
    
    return new Promise((resolve, reject) => { // Login Validation
        DB.getConnection(function (poolErr, conn) {
            if (poolErr) {
                conn.release();
                return resolve({
                    status: false,
                    msg: 'PoolError'
                });
            }

            var sql = "call login_check(?, ?)";

            conn.query(sql, [p.data.token, p.data.secret], async function (err, data) {
                conn.release();
                if (err) {
                    return resolve({
                        status: false,
                        msg: 'ConnError'
                    });
                }

                if (data[0][0].procStatus == 0) {
                    return resolve({
                        status: false,
                        msg: 'CheckLoginFailed : ' + data[0][0].errorDesc
                    });
                }

                resolve({
                    status: true,
                    data: data[0][0]
                });
            });
        });
    });
};