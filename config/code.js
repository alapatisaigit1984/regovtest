const CODELIST = {
    invalidJson: {num: 1, msg: 'Invalid Json Format'},
    success: {num: 200, msg: 'Success'},
    successConditional: {num: 201, msg: 'Success With Condition'}
};

exports.code = function () {
    return CODELIST;
};