
 // Dependencies
// =============================================================
const { Employee } = require("../utils/constructors");

const consoleTable = require("console.table");
const databasePool = require('../utils/connect');
const sql = require("../utils/sqlqueries");


 // Get List of Employees
// =============================================================
async function getEmployeeList() {
    try {
       let queriedEmployee = await databasePool.query(sql.getAllEmployees);
       let employeeNames = [];
       let data = queriedEmployee[0];
       for(row in data) {
          employeeNames.push(`${data[row].employee_id} ${data[row].first_name} ${data[row].last_name}`);
       }
       return employeeNames;
    } catch (err) {
       console.log(`Something went wrong retrieving employee data. Error: ${err}`);
    }
 };


 // Get Employee Data
// =============================================================
 const getEmployees = async () => {
    try {
       let queriedEmployee = await databasePool.query(sql.getAllEmployees);
       let employeeList = [];
       let data = queriedEmployee[0];
       for(row in data) {
          employeeList.push(new Employee(data[row].employee_id, data[row].first_name, data[row].last_name, data[row].job_title, data[row].salary, data[row].manager_name, data[row].department));
       }
       if(employeeList.length <= 0) {
          console.log(`No records to display`);
       } else {
          console.table(employeeList);
       }
    } catch (err) {
       console.log(`There was an issue getting an employee list. Error: ${err}`);
    }
 };


// Get Managers
// =============================================================
async function getManagers() {
    try {
       let data = await databasePool.query(sql.getAllManagers);
       let managerList = [];
       data = data[0];
       for(row in data) {
          managerList.push(`${data[row].manager_id} ${data[row].manager_name}`);
       }
       return managerList;
    } catch (err) {
       console.log(err);
    }
 };


 // Get Employees By Manager
// =============================================================
 const getEmployeesbyManager = async response => {
    let manager_id;
    try {
       if(response.manager_name != 'None') {
          manager_id = parseInt(response.manager_name.split(' ')[0]);
          let queriedEmployee = await databasePool.query(sql.getEmployeesbyManager, manager_id);
          return queriedEmployee[0];
       } else {
          let queriedEmployee = await databasePool.query(sql.getEmployeesbyNoManager);
          return queriedEmployee[0];
       }
    } catch (err) {
       console.log(`There was an issue getting employee data by manager. Error: ${err}`);
    }
 };


// Add New Employee
// =============================================================
 const addNewEmployee = async response => {
    let manager_id;
    if(response.manager_name === 'None') {
       manager_id = null;
    } else {
       manager_id = parseInt(response.manager_name.split(' ')[0]);
    }
    let role_id = parseInt(response.role_title.split(' ')[0]);
    try {
       await databasePool.query(sql.addEmployee, [response.first_name, response.last_name, role_id, manager_id]);
    } catch (err) {
       console.log(`Issue adding new employee: ${err}`);
    }
    return (`${response.first_name}_${response.last_name} added to database.`);
 };


 // Query by Employee Name
// =============================================================
 const queryEmployeeName = async response => {
    try {
       let first_name = (response.split('_')[0]);
       let last_name = (response.split('_')[1]);
       let queriedEmployee = await databasePool.query(sql.getByEmployeeNames, [first_name, last_name]);
       if(queriedEmployee[0].length <= 0) {
          console.log(`No data available by this name.`);
       } else {
          console.table(queriedEmployee[0]);
       }
    } catch (err) {
       console.log(`Unable to identify employee by name. Error: ${err}`);
    }
 };


 // Query by Employee Id
// =============================================================
 const queryEmployeeById = async response => {
    try {
       let queryEmployee = await databasePool.query(sql.getEmployeeById, [response]);
       if(queryEmployee[0].length <= 0) {
          console.log(`No records. Check the data if this seems inaccurate.`);
       } else {
          console.table(queryEmployee[0]);
       }
    } catch (err) {
       console.log(`There was an issue finding employees by Id. Error: ${err}`);
    }
 };

 // Update Employee Role
// =============================================================
 const updateEmployeeRole = async response => {
    try {
       let employee_id = (response.employee_name.split(' ')[0]);
       let role_id = (response.role_title.split(' ')[0]);
       await databasePool.query(sql.updateEmployeeRole, [role_id, employee_id]);
       return employee_id;
    } catch (err) {
       console.error(`Issue updating employee role. Error: ${err}`);
    }
 };

 // Employees by department
// =============================================================
    const getEmployeesByDepartment = async response => {
        try {
            let department_id = parseInt(response.department_name.split(' ')[0]);
            const queryEmployeeByDepartment = await databasePool.query(sql.getEmployeesByDepartment, department_id);
            let employeeList = [];
            let data = queryEmployeeByDepartment[0];
            for (row in data) {
                employeeList.push(new Employee(data[row].employee_id, data[row].first_name, data[row].last_name, data[row].job_title, data[row].salary, data[row].manager_name, data[row].department));
            }
            if (employeeList.length <= 0) {
                console.log(`No Employees to display`);
                return;
            }
            console.table(employeeList);
        } catch (err) {
            console.error(`Unable to view employees by department. Error: ${err}`);
        }
    };
    
 // Delete employee
// =============================================================

 const deleteEmployee = async response => {
    try {
       let employee_id = (response.employee_name.split(' ')[0]);
       let deleteEmployee = await databasePool.query(sql.deleteEmployeeById, employee_id);
       console.log(deleteEmployee[0] `was successfully deleted`);
    } catch (err) {
       console.log(`Unable to delete Employee. Error: ${err}`);
    }
 };



// Export department functions (can i parent these somehow?)
// ============================================================
module.exports =  {getEmployeeList, getEmployees, getManagers,  addNewEmployee, queryEmployeeName, queryEmployeeById, deleteEmployee, updateEmployeeManager, updateEmployeeRole, viewByManager}
