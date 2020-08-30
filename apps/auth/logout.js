exports.init = function (p) {
    var DB = p.DB,
            FILTER = p.FILTER,
            ENV = p.ENV;

      return new Promise((resolve, reject) => { // Logout through Procedure
        p.DB.getConnection(function (poolErr, conn) {
            if (poolErr) {
                return resolve({
                    status: false,
                    msg: 'PoolError',
                    code: 2
                });
            }
            console.log("User Id", p.userId);
            var sql = "call logout(?, ?)";
            conn.query(sql, [p.data.token, p.data.secret], async function (err, data) {
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
                        msg: 'LogoutFailed : ' + data[0][0].errorDesc,
                        code: 4
                    });
                }
                return resolve({
                    status: true,
                    msg: 'LogoutGranted'
                });
            });
        });
    });
};