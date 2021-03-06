
//TO DO: Make more robust validaiton throughout  https://www.npmjs.com/package/node-input-validator
var validator = require("validator");

const validate = { // salary
  checkNumber(salaryInput) {
    if (validator.isDecimal(salaryInput)) return true;
    return "Salary format invalid. Please enter in this format: 50000.00"; // this is the area of concern. Commas and 0 handling
  },

  isEqual(entry1, entry2) { // dont let someone be their own manager
    if (entry1 === entry2) return true;
  },
};

module.exports = validate;
