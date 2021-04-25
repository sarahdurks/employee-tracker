// Dependencies
// =============================================================
const { Department } = require("../utils/constructors");
const consoleTable = require("console.table");
const databasePool = require('../utils/connect');
const sql = require("../utils/sqlqueries");




async function getDepartmentList() {
    try {
       let departmentQuery = await databasePool.query(sql.getAllDepartments)
       let departmentNames = [];
       let data = departmentQuery[0];
       for(row in data) {
          departmentNames.push(`{data[row].department_id} ${data[row].department_name}`);
       }
       return departmentNames;
    } catch (err) {
       console.log(`Something with the department list went wrong. Error: ${err}.`)
    }
 }

 // Add a New Department
// =============================================================
 const addNewDepartment  = async () => {
    try {
       await databasePool.query(sql.addDepartment, response.department_name);
    } catch (err) {
       console.error(`Unable to add Department. Error: ${err}. Try again.`);
    }
    return response.department_name;
 };

 // Get Department Data
// =============================================================
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
       console.log(`Was not able to get all departments. Error ${err}.`);
    }
 };

// Delete Department
// =============================================================
 const deleteDepartment  = async () => {
         try {
             let department_id = parseInt(response.department_name.split(" ")[0]);
             let deleteDepartmentAction = await databasePool.query(sql.deleteById, department_id);
              console.log(deleteDepartmentAction[0]);
              } catch (err) {
               console.log(`Unable to delete Department. Error: ${err}.`);
                      }
                    };



// Export department functions 
// ============================================================
 module.exports =  {getDepartmentList, addNewDepartment, getAllDepartments, deleteDepartment };


