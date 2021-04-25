const validation = require("validator");
const validate = {
   checkSame(str1, str2) {
      if(str1 === str2) return true;
      console.log("Entries match");
   },
   checkNumber(num) {
      if(validaton.isDecimal(num)) return true;
      return "Salary format invalid. Please enter format: 50000.00";
   },
   checkString(str) {
      return str !== '' || "Please enter a valid text string.";
   }
};
module.exports = validate;
//https://www.npmjs.com/package/validator
// May be a more specific node way to do this https://www.npmjs.com/package/node-input-validator