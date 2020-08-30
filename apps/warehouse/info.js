exports.init = function (p) {

    var err = false;
    var DB = p.DB,
        FILTER = p.FILTER;

    var check = FILTER.isDefine(p.data, 'warehouse_id', 'number');
    if (!check.status) {
        return check;
    }

    if (p.data.currentPage === undefined & typeof p.data.currentPage !== 'number') {
        p.data.currentPage = 1;
    }
    if (!p.data.perPageCount & typeof p.data.perPageCount !== 'number') {
        p.data.perPageCount = 10;
    }
    var start = p.data.perPageCount * (p.data.currentPage - 1);
    limit = " limit " + start + ", " + p.data.perPageCount;

    return new Promise((resolve, reject) => {   // WareHouse info
        DB.getConnection(function (poolErr, conn) {
            if (poolErr) {
                conn.release();
                return resolve({
                    status: false,
                    msg: 'PoolError',
                    code: 2
                });
            }
            var sql = "select p.name,si.stock from stock_info si \
                   left join products p on si.product_id = p.id and p.status=1\
             where si.user_id = ? and si.warehouse_id= ? and si.status=1 " + limit
            conn.query(sql, [p.userId, p.data.warehouse_id], async function (err, res) {
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
                        msg: 'No Records Found',
                        code: 4,
                    });
                }
                return resolve({
                    status: true,
                    msg: 'List of Warehouse',
                    warehouse: res,

                })
            });
        });
    }).then(function (response) { // Pagination
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
                var sql = "select count(1) as count1 from stock_info where warehouse_id= ? and status=1"
                conn.query(sql, [p.warehouse_id], async function (err, res) {
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
                            msg: 'No Records Found',
                            code: 7
                        });
                    }
                    var count = res[0].count1;
                    var totalPages = Math.ceil(count / p.data.perPageCount);
                    var pagination = {
                        totalRecords: count,
                        totalPages: totalPages,
                        perPageCount: p.data.perPageCount,
                        currentPage: p.data.currentPage,
                    }
                    return resolve({
                        status: true,
                        data: response.warehouse,
                        pagination: pagination,
                    });
                });
            });
        })
    });


}
