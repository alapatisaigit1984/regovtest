const API = [
    '/auth/login',
    '/auth/logout',

    '/user/registration',

    '/product/add',
    '/product/delete',
    '/product/list',


    '/warehouse/add',
    '/warehouse/delete',
    '/warehouse/list',
    '/warehouse/info',

    '/stock/add',
    '/stock/unstock',



];
const APINOLOGIN = [
    '/auth/login',

    '/user/registration'
];

exports.get = function () {
    return API;
};

exports.getUrlUnLogin = function(){
    return APINOLOGIN;
}