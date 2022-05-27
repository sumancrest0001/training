const {
    validate,
    notEmpty,
    shouldBeUuid,
    isEmail,
    isMobileNumber
} = require('validation');

const rule = {
    fullName: [
        [notEmpty, 'fullName can not be empty']
    ],
    country: [
        [notEmpty, "Country can not be empty"]
    ],
    email: [
        [notEmpty, "Email can not be empty"],
        [isEmail, "Email should be valid"]
    ]
};

module.exports.validate = async data => validate(rule, data);