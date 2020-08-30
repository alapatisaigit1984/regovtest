exports.init = function (p) {

    var err = false;
    var DB = p.DB,
        FILTER = p.FILTER;

    //filter
    var check = FILTER.isDefine(p.data, 'username', 'string'); //only number and string
    if (!check.status) {
        return check;
    }
    var check = FILTER.isDefine(p.data, 'password', 'string'); //only number and string
    if (!check.status) {
        return check;
    }

    return new Promise((resolve, reject) => { //Login through Procedure
        DB.getConnection(function (poolErr, conn) {
            if (poolErr) {
                conn.release();
                return resolve({
                    status: false,
                    msg: 'PoolError',
                    code: 2
                });
            }
            var sql = "call login(?, ?)";
            conn.query(sql, [p.data.username, p.data.password], async function (err, data) {
                conn.release();
                if (err) {
                    return resolve({
                        status: false,
                        msg: 'ConnError',
                        code: 3
                    });
                }

                if (data[0][0].procStatus == 0) {
                    return resolve({
                        status: false,
                        msg: data[0][0].errorDesc,
                        code: 4
                    });
                }

                return resolve({
                    status: true,
                    msg: 'LoginGranted',
                    data: {
                        token: data[0][0].token,
                        secret: data[0][0].secret,
                        userId: data[0][0].userId,
                    }
                });
            });
        });
    })
};
