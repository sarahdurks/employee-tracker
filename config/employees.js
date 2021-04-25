
// Dependencies
const { Employee } = require("../utils/constructors");


const consoleTable = require("console.table");
const databasePool = require('../utils/connect');
const sql = require("../utils/sqlqueries");

async function getEmployeeList() {
    try {
       const queriedEmployee = await databasePool.query(sql.getAllEmployees);
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
 const getEmployees = async () => {
    try {
       const queriedEmployee = await databasePool.query(sql.getAllEmployees);
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
const getManagers = async () => {
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


 const getEmployeesbyManager = async response => {
    let manager_id;
    try {
       if(response.manager_name != 'None') {
          manager_id = parseInt(response.manager_name.split(' ')[0]);
          const queriedEmployee = await databasePool.query(sql.getEmployeesbyManager, manager_id);
          return queriedEmployee[0];
       } else {
          const queriedEmployee = await databasePool.query(sql.getEmployeesbyNoManager);
          return queriedEmployee[0];
       }
    } catch (err) {
       console.log(`There was an issue getting employee data by manager. Error: ${err}`);
    }
 };
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
       console.log(`Issue adding new Id: ${err}`);
    }
    return (`${response.first_name}_${response.last_name}`);
 };
 const queryEmployeeName = async response => {
    try {
       let first_name = (response.split('_')[0]);
       let last_name = (response.split('_')[1]);
       const queriedEmployee = await databasePool.query(sql.getByEmployeeNames, [first_name, last_name]);
       if(queriedEmployee[0].length <= 0) {
          console.log(`No data.`);
       } else {
          console.table(queriedEmployee[0]);
       }
    } catch (err) {
       console.log(`Unable to identify employee by name. Error: ${err}`);
    }
 };
 const queryEmployeeById = async response => {
    try {
       const queryEmployee = await databasePool.query(sql.getEmployeeById, [response]);
       if(queryEmployee[0].length <= 0) {
          console.log(`No records. Check the data if this seems inaccurate.`);
       } else {
          console.table(queryEmployee[0]);
       }
    } catch (err) {
       console.log(`There was an issue finding employees by Id. Error: ${err}`);
    }
 };
 const updateEployeeManager = async response => {
    try {
       let manager_id;
       if(response.manager_name === 'None') {
          manager_id = null;
       } else {
          manager_id = parseInt(response.manager_name.split(' ')[0]);
       }
       const employee_id = (response.employee_name.split(' ')[0]);
       await databasePool.query(sql.updateManager, [manager_id, employee_id]);
       return employee_id;
    } catch (err) {
       console.log(`Issue in updating employee manager. Error: ${err}`);
    }
 };
 const updateEmployeeRole = async response => {
    try {
       const employee_id = (response.employee_name.split(' ')[0]);
       const role_id = (response.role_title.split(' ')[0]);
       await databasePool.query(sql.updateEmployeeRole, [role_id, employee_id]);
       return employee_id;
    } catch (err) {
       console.error(`Issue updating employee role. Error: ${err}`);
    }
 };
 const displayByManager = response => {
    let employeeList = [];
    for(row in response) {
       employeeList.push(new EmployeebyManager(response[row].employee_id, response[row].first_name, response[row].last_name, response[row].job_title, response[row].salary, response[row].manager_name));
    }
    if(employeeList.length <= 0) {
       console.log(`No employees to display by manager.`);
    } else {
       console.table(employeeList);
    }
 };
 const deleteEmployee = async response => {
    try {
       const employee_id = (response.employee_name.split(' ')[0]);
       const deleteEmployee = await databasePool.query(sql.deleteEmployeeById, employee_id);
       console.log(deleteEmployee[0] `was successfully deleted`);
    } catch (err) {
       console.log(`Unable to delete Employee. Error: ${err}`);
    }
 };