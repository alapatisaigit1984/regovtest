exports.init = function (p) {

    var err = false;
    var DB = p.DB,
        FILTER = p.FILTER;

    //filter
    var check = FILTER.isDefine(p.data, 'product_id', 'number'); 
    if (!check.status) {
        return check;
    }


    return new Promise((resolve, reject) => {
        DB.getConnection(function (poolErr, conn) {
            if (poolErr) {
                conn.release();
                return resolve({
                    status: false,
                    msg: 'PoolError',
                    code: 2
                });
            }
            var sql = "select id from products where id = ? and user_id=? and status=1";
            conn.query(sql, [p.data.product_id,p.userId], async function (err, res) {
                conn.release();
                if (err) {
                    return resolve({
                        status: false,
                        msg: 'ConnError',
                        code: 3
                    });
                }
                console.log("res",res);

                if(res.length == 0){
                    return resolve({
                        status: false,
                        msg: 'No Product Availble',
                        code: 4
                    });
                }
                return resolve({
                    status: true,
                    msg: 'Can Proceed to Delete',
                });
            });
        });
    }).then(function(response){
        if(!response.status){
            return response;
        }
        return new Promise((resolve, reject) => {
            DB.getConnection(function (poolErr, conn) {
                if (poolErr) {
                    conn.release();
                    return resolve({
                        status: false,
                        msg: 'PoolError',
                        code: 5
                    });
                }
                var sql = " update products set status = 10 where id=? and user_id = ? and status=1";
                conn.query(sql, [p.data.product_id,p.userId], async function (err, res) {
                    conn.release();
                    if (err) {
                        return resolve({
                            status: false,
                            msg: 'ConnError',
                            code: 6
                        });
                    }
                    if (res === undefined || res.affectedRows == 0) {
                        return resolve({
                            status: false,
                            msg: 'Not Able to Delete Product',
                            code: 7
                        });
                    }
                    return resolve({
                        status: true,
                        msg: 'Successfully Deleted Product',
                    });
                });
            });
        })
    }).then(function(response){
        if(!response.status){
            return response;
        }
        return new Promise((resolve, reject) => {
            DB.getConnection(function (poolErr, conn) {
                if (poolErr) {
                    conn.release();
                    return resolve({
                        status: false,
                        msg: 'PoolError',
                        code: 5
                    });
                }
                var sql = " update stock_info set stock = 0 , status =10 where product_id=? and user_id = ? ";
                conn.query(sql, [p.data.product_id,p.userId], async function (err, res) {
                    conn.release();
                    if (err) {
                        return resolve({
                            status: false,
                            msg: 'ConnError',
                            code: 6
                        });
                    }
                    return resolve({
                        status: true,
                        msg: 'Successfully Deleted Warehouse',
                    });
                });
            });
        })
    })
};