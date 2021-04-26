var validator = require('validator');

const validate = {
   checkNumber(num) {
      if(validator.isDecimal(num)) return true;
      return "Salary format invalid. Please enter format: 50000.00"; // this is the area of concern. Commas and 0 handling
   
},

isEqual(str1, str2) {
   if (str1 === str2) return true;
 }
};

module.exports = validate;
//https://www.npmjs.com/package/validator
// May be a more specific node way to do this https://www.npmjs.com/package/node-input-validator