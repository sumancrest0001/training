const {
  validate,
  notEmpty,
  shouldBeUuid,
  isEmail,
  isMobileNumber,
} = require("validation");

const minLength = (value, obj) => {
  if (!value) return false;
  return value.trim().length >= 7;
};

const rule = {
  name: [[notEmpty, "Name can not be empty"]],
  aadharNumber: [
    [notEmpty, "Aadhar number can not be empty"],
    [minLength, "Aadhar number should have at least 7 characters"],
  ],
};

module.exports.validate = async (data) => validate(rule, data);
