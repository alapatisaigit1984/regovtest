exports.init = async function (p) {
    if(!p.FILTER.isJson(JSON.stringify(p.data))){
        return {
            status:false,
            code : p.CODE.invalidJson.num,
            msg:p.CODE.invalidJson.msg,
            data:p.data
        }

    }
    return {
        status:true,
    }
};