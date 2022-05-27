const {
    validate,
    notEmpty,
    shouldBeUuid,
    isEmail,
    isMobileNumber
} = require('validation');

const rule = {
    name: [
        [notEmpty, 'Name can not be empty']
    ]
};

module.exports.validate = async data => validate(rule, data);