exports.init = function (p) {

    var err = false;
    var DB = p.DB,
        FILTER = p.FILTER;

    //filter
    var check = FILTER.isDefine(p.data, 'name', 'string'); 
    if (!check.status) {
        return check;
    }
    if(p.data.name.length < 6){
        return {
            status: false,
            msg: 'Minimum Length of name is 6'
        };
    }

    return new Promise((resolve, reject) => { //Check the warehouse already exists or not
        DB.getConnection(function (poolErr, conn) {
            if (poolErr) {
                conn.release();
                return resolve({
                    status: false,
                    msg: 'PoolError',
                    code: 2
                });
            }
            var sql = "select id from warehouse where name = ? and user_id=? and status=1 ";
            conn.query(sql, [p.data.name,p.userId], async function (err, res) {
                conn.release();
                if (err) {
                    return resolve({
                        status: false,
                        msg: 'ConnError',
                        code: 3
                    });
                }

                if(res.length > 0){
                    return resolve({
                        status: false,
                        msg: 'Product Already Exists',
                        code: 4
                    });

                }
                return resolve({
                    status: true,
                    msg: 'Can Proceed to Registration',
                });
            });
        });
    }).then(function(response){ // create the warehouse
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
                var sql = " INSERT INTO `regov`.`warehouse`(`name`,`user_id`)  VALUES (?,?)";
                conn.query(sql, [p.data.name ,p.userId], async function (err, res) {
                    conn.release();
                    if (err) {
                        return resolve({
                            status: false,
                            msg: 'ConnError',
                            code: 6,
                        });
                    }
                    if (res === undefined || res.affectedRows == 0) {
                        return resolve({
                            status: false,
                            msg: 'Not Able to create Warehouse',
                            code: 7
                        });
                    }
                    return resolve({
                        status: true,
                        msg: 'Successfully created House',
                        warehousename : p.data.name,
                        warehouseId : res.insertId
                    });
                });
            });
        })
    })
};