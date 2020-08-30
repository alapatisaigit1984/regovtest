exports.init = function (p) {

    var err = false;
    var DB = p.DB,
        FILTER = p.FILTER;

    //filter
    var check = FILTER.isDefine(p.data, 'product_id', 'number');
    if (!check.status) {
        return check;
    }
    var check = FILTER.isDefine(p.data, 'warehouse_id', 'number');
    if (!check.status) {
        return check;
    }
    var check = FILTER.isDefine(p.data, 'quantity', 'number');
    if (!check.status) {
        return check;
    }

    return new Promise((resolve, reject) => { // Check the Product exists
        DB.getConnection(function (poolErr, conn) {
            if (poolErr) {
                conn.release();
                return resolve({
                    status: false,
                    msg: 'PoolError',
                    code: 2
                });
            }
            var sql = "select id from products where id=? and user_id=? and status=1";
            conn.query(sql, [p.data.product_id, p.userId], async function (err, res) {
                conn.release();
                if (err) {
                    return resolve({
                        status: false,
                        msg: 'ConnError',
                        code: 3
                    });
                }

                if (res.length == 0) {
                    return resolve({
                        status: false,
                        msg: 'Product Not availble',
                        code: 4
                    });

                }
                return resolve({
                    status: true,
                    msg: 'Can Proceed to Add',
                });
            });
        });
    }).then(function (response) { // check the warehouse exists
        if (!response.status) {
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
                var sql = "select id from warehouse where id=? and user_id=? and status=1";
                conn.query(sql, [p.data.warehouse_id, p.userId], async function (err, res) {
                    conn.release();
                    if (err) {
                        return resolve({
                            status: false,
                            msg: 'ConnError',
                            code: 6
                        });
                    }

                    if (res.length == 0) {
                        return resolve({
                            status: false,
                            msg: 'Warehouse Not availble',
                            code: 7
                        });
                    }
                    return resolve({
                        status: true,
                        msg: 'Can Proceed to Add',
                    });
                });
            });
        })
    }).then(function (response) { // check the stock exists or not
        if (!response.status) {
            return response;
        }
        return new Promise((resolve, reject) => {
            DB.getConnection(function (poolErr, conn) {
                if (poolErr) {
                    conn.release();
                    return resolve({
                        status: false,
                        msg: 'PoolError',
                        code: 8
                    });
                }
                var sql = "select id from stock_info where product_id=? and warehouse_id=? and user_id =?";
                conn.query(sql, [p.data.product_id, p.data.warehouse_id, p.userId], async function (err, res) {
                    conn.release();
                    if (err) {
                        return resolve({
                            status: false,
                            msg: 'ConnError',
                            code: 9
                        });
                    }
                    if (res[0] !== undefined) {
                        stock_id = res[0].id
                    } else {
                        stock_id = 0;
                    }
                    return resolve({
                        status: true,
                        msg: 'Can Proceed to Add',
                        stock_id: stock_id,
                    });
                });
            });
        })

    }).then(function (response) { // Create or Update Stock
        if (!response.status) {
            return response;
        }
        return new Promise((resolve, reject) => {
            DB.getConnection(function (poolErr, conn) {
                if (poolErr) {
                    conn.release();
                    return resolve({
                        status: false,
                        msg: 'PoolError',
                        code: 10
                    });
                }
                if (response.stock_id == 0) {
                    var sql = "insert into stock_info (`warehouse_id`,`product_id`,`user_id`,`stock`) values (" + p.data.warehouse_id + "," + p.data.product_id + "," + p.userId + "," + p.data.quantity + ")"
                } else {
                    var sql = "update stock_info set stock =stock+" + p.data.quantity + " where id=" + response.stock_id;
                }
                conn.query(sql, async function (err, res) {
                    conn.release();
                    if (err) {
                        return resolve({
                            status: false,
                            msg: 'ConnError',
                            code: 11,
                            sql:sql,
                        });
                    }
                    if (res === undefined || res.affectedRows == 0) {
                        return resolve({
                            status: false,
                            msg: 'Not Able to create Stock',
                            code: 12
                        });
                    }
                    return resolve({
                        status: true,
                        msg: 'Successfully Added Stock',
                    });
                });
            });
        })
    }).then(function(response){ // Create Transaction Log
        if (!response.status) {
            return response;
        }
        return new Promise((resolve, reject) => {
            DB.getConnection(function (poolErr, conn) {
                if (poolErr) {
                    conn.release();
                    return resolve({
                        status: false,
                        msg: 'PoolError',
                        code: 13
                    });
                }
                var sql = "insert into transaction_log (`warehouse_id`,`product_id`,`user_id`,`quantity`,`type`) values (?,?,?,?,?)"
                conn.query(sql,[p.data.warehouse_id,p.data.product_id,p.userId,p.data.quantity,'c'],async function (err, res) {
                    conn.release();
                    if (err) {
                        return resolve({
                            status: false,
                            msg: 'ConnError',
                            code: 14,
                            sql:sql,
                        });
                    }
                    if (res === undefined || res.affectedRows == 0) {
                        return resolve({
                            status: false,
                            msg: 'Not Able to Add Product',
                            code: 15
                        });
                    }
                    return resolve({
                        status: true,
                        msg: 'Successfully Added Stock',
                    });
                });
            });
        })

    })

};