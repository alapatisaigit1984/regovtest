var md5 = require('md5');
exports.init = function (p) {

    var err = false;
    var DB = p.DB,
        FILTER = p.FILTER;
    //Validation 
    //filter
    var check = FILTER.isDefine(p.data, 'username', 'string'); 
    if (!check.status) {
        return check;
    }
    if(p.data.username.length < 6){
        return {
            status: false,
            msg: 'Minimum Length of username is 6'
        };
    }
    var check = FILTER.isDefine(p.data, 'password', 'string'); 
    if (!check.status) {
        return check;
    }
    if(p.data.password.length < 6){
        return {
            status: false,
            msg: 'Minimum Length of username is 6'
        };
    }
    var check = FILTER.isDefine(p.data, 'confirm_password', 'string'); 
    if (!check.status) {
        return check;
    }
    var check = FILTER.isDefine(p.data, 'first_name', 'string'); 
    if (!check.status) {
        return check;
    }
    var check = FILTER.isDefine(p.data, 'last_name', 'string'); 
    if (!check.status) {
        return check;
    }
    if(p.data.password !== p.data.confirm_password){
        return {
            status: false,
            msg: 'Password & Confirm Password Not Matching'
        };
    }

    return new Promise((resolve, reject) => { // Check the user exists or not
        DB.getConnection(function (poolErr, conn) {
            if (poolErr) {
                conn.release();
                return resolve({
                    status: false,
                    msg: 'PoolError',
                    code: 2
                });
            }
            var sql = "select id from users where username = ? ";
            conn.query(sql, [p.data.username], async function (err, res) {
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
                        msg: 'Username Already Exists',
                        code: 4
                    });

                }
                return resolve({
                    status: true,
                    msg: 'Can Proceed to Registration',
                });
            });
        });
    }).then(function(response){ // Created The User
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
                var sql = " INSERT INTO `regov`.`users`(`username`, `first_name`,  `last_name`,  `password`)  VALUES (?,?,?,?)";
                conn.query(sql, [p.data.username , p.data.first_name,p.data.last_name,md5(p.data.password)], async function (err, res) {
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
                            msg: 'Not Able to create User',
                            code: 7
                        });
    
                    }
                    return resolve({
                        status: true,
                        msg: 'Successfully created User, Can Proceed to Login',
                        username : p.data.username,
                        userId : res.insertId
                    });
                });
            });
        })
    })
};