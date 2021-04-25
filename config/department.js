// Dependencies
// =============================================================
const { Department } = require("../utils/constructors");
const consoleTable = require("console.table");
const databasePool = require('../utils/connect');
const sql = require("../utils/sqlqueries");


// Get Department List
// =============================================================

async function getDepartmentList() {
    try {
       let departmentQuery = await databasePool.query(sql.getAllDepartments)
       let departmentName = [];
       let data = departmentQuery[0];
       for(row in data) {
          departmentName.push(`{data[row].department_id} ${data[row].department_name}`);
       }
       return departmentName;
    } catch (err) {
       console.log(`Something with the department list went wrong. Error: ${err}.`)
    }
 }

 // Add a New Department
// =============================================================
 const addNewDepartment = async response => {
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
       let departmentName = [];
       let data = departmentQuery[0];
       for(row in data) {
          departmentList.push(new Department(data[row].department_id, data[row].department_name));
          departmentName.push(`${data[row].department_id} ${data[row].department_name}`);
       }
       console.table(departmentList);
       return departmentName;
    } catch (err) {
       console.log(`Was not able to get all departments. Error ${err}.`);
    }
 };

 // Query Department
// =============================================================
 const queryDepartment = async response => {
          try {
             let queryDepartment = await databasePool.query(sql.getByDepartment_name, response);
             if(queryDepartment[0].length <= 0) {
                console.log("No department records");
             } else {
                console.log("Department added!");
                console.table(queryDepartment[0]);
                carch(err) {
                   console.log("Error with query adding department")
                }
             };

// Delete Department
// =============================================================
 const deleteDepartment = async response => {
         try {
             let department_id = parseInt(response.department_name.split(" ")[0]);
             let deleteDepartmentAction = await databasePool.query(sql.deleteById, department_id);
              console.log(deleteDepartmentAction[0]);
              } catch (err) {
               console.log(`Unable to delete Department. Error: ${err}.`);
                      }
                    }