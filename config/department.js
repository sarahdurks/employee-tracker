
// =============================================================
// DEPARTMENT DEPENDENCIES
// =============================================================
const { Department } = require("../utils/constructors");
const consoleTable = require("console.table");
const databasePool = require("../utils/connect");
const sql = require("../utils/sqlqueries");

// ============================================================
// Get Department List
// ============================================================
async function getDepartmentList() {
   try {
      let departmentQuery = await databasePool.query(sql.getAllDepartments);
      let departmentNames = [];
      let data = departmentQuery[0];
      for(row in data) {
         departmentNames.push(`${data[row].department_id} ${data[row].department_name}`);
      }
      return departmentNames;
   } catch (err) {
      console.log(`Something with the department list went wrong. Error: ${err}.`)
   }
}
// ============================================================
// Add a New Department
// ============================================================
const addNewDepartment = async response => {
   try {
      await databasePool.query(sql.addDepartment, response.department_name);
   } catch (err) {
      console.error(`Unable to add Department. Error: ${err}. Try again.`);
   }
   return response.department_name;
};
// ============================================================
// Get Department Data
// ============================================================
const getAllDepartments = async () => {
   try {
      const departmentQuery = await databasePool.query(sql.getAllDepartments);
      let departmentList = [];
      let departmentNames = [];
      let data = departmentQuery[0];
      for(row in data) {
         departmentList.push(new Department(data[row].department_id, data[row].department_name));
         departmentNames.push(`${data[row].department_id} ${data[row].department_name}`);
      }
      console.table(departmentList);
      return departmentNames;
   } catch (err) {
      console.log("Something went wrong with returning departments.");
   }
};

// ============================================================
// Export department functions 
// ============================================================
module.exports = {
   getDepartmentList,
   addNewDepartment,
   getAllDepartments
};