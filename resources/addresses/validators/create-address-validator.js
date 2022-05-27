const {
    validate,
    notEmpty,
    shouldBeUuid,
    isEmail,
    isMobileNumber
} = require('validation');

const rule = {
    street: [
        [notEmpty, 'Street can not be empty']
    ],
    city: [
        [notEmpty, "City can not be empty"]
    ],
    country: [
        [notEmpty, "Country can not be empty"]
    ],
    name: [
        [notEmpty, "Name can not be empty"]
    ]
};

module.exports.validate = async data => validate(rule, data);