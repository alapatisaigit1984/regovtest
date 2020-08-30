exports.isJson = function (str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};
exports.isDefine = function (p, o, t) {
    if (typeof p[o] === 'undefined' || p[o] === null || p[o] === '') {
        return {
            status: false,
            msg: 'Missing parameter: ' + o
        };
    }
    if (typeof p[o] !== t) {
        return {
            status: false,
            msg: "Expected '" + t + "' on key '" + o + "'"
        };
    }
    return {
        status: true
    };
};