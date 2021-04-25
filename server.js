// Dependencies
// =============================================================
const inquirer = require("inquirer")
//
const Database = require("./utils/connect")
const consoleTable = require('console.table');
const mysql = require('mysql2');  

const { xyz } = require(("./config/department");
const{ xyz }  = require("./config/employees");
const { xyz }  = require("./config/roles");

getDepartmentList
addNewDepartment
getAllDepartments
queryDepartment
deleteDepartment 

getEmployeeList
getEmployees
getManagers
getEmployeesbyManager
addNewEmployee
queryEmployeeName
queryEmployeeById
updateEmployeeManager
updateEmployeeRole 
viewByManager
deleteEmployee

getRoleList
egtRoles
queryRoles
addRole


// Question Series / Logic
// =============================================================
async function databasePrompt() {
   // aggregate choice lists to display to user
   let managers = await getManagerList();
   let employees = await getEmployeeList();
   let departments = await getDepartmentlist();
   let roles = await getRoleList();
   //main menu
   inquirer.prompt([{
            type: "list",
            message: "What are you trying to do? Choose from options below.",
            name: "action",
            choices: [
                "Add a new department",
                "Add a new employee",
                "Add a new role",
                "Update employee role",
                "View all employees",
                "View all employees by department",
                "View all departments",
                "View all employee roles",
                "Remove employee",
                "I'm done"
            ]
        },
         
         {
            type: 'input',
            name: 'department_name',
            message: 'Please enter a name for the new department:',
            when: ({
               action
            }) => action === 'Add a new department',
            validate: departmentName => {
               if(departmentName) { //better approach to this?
                  return true;
               } else {
                  console.log('Please enter a name for the new department.');
                  return false;
               }
            }
     },
         {
            type: 'input',
            name: 'title',
            message: 'Please enter a title for the new role.',
            when: ({
               action
            }) => action === 'Add a new role',
            validate: title => {
               if(title) {
                  return true;
               } else {
                  console.log('Please enter a job title for the new role.');
                  return false;
               }
            }
     },
         {
            type: 'number', // may need a better solution w decimals, think this has to match database
            name: 'salary',
            message: 'Enter a salary for this new role:',
            when: ({
               action
            }) => action === 'Add a role',
            validate: salary => {
               if(salary) {
                  return true;
               } else {
                  console.log('Please enter a valid number for salary.');
                  return false;
               }
            }
     },
         {
            type: 'input', // could use better validation
            name: 'first_name',
            message: "Enter the employee's first name:",
            when: ({
               action
            }) => action === 'Add an employee',
            validate: firstName => {
               if(firstName) {
                  return true;
               } else {
                  console.log("Please enter the employee's first name.");
                  return false;
               }
            }
     },
         {
            type: 'input', // could use better validation
            name: 'last_name',
            message: "Enter the employee's last name:",
            when: ({
               action
            }) => action === 'Add an employee',
            validate: lastName => {
               if(lastName) {
                  return true;
               } else {
                  console.log("Please enter the employee's last name.");
                  return false;
               }
            }
     },
         
         {
            type: 'list',
            name: 'department_name',
            message: 'Select the department:', // reuse 
            when: ({
               action
            }) => action === 'Add a new role' || action === "View employees by department",
            choices: [...departments]
     },
         
         
         {
            type: 'list',
            name: 'role_title',
            message: "Select the   new Employee's role",
            when: ({
               action
            }) => action === 'Add an employee',
            choices: [...roles],
     },
         {
            type: 'list',
            name: 'manager_name',
            message: "Select Employee's Manager:",
            when: ({
               action
            }) => action === 'Add an employee',
            choices: [...managers]
     },
         {
            type: 'list',
            name: 'employee_name',
            message: "Select the employee you'd like to update role data for",
            when: ({
               action
            }) => action === "Update an employee's role",
            choices: [...employees],
     },
         {
            type: 'list',
            name: 'job_title',
            message: "Select the updated role for this employee",
            when: ({
               action
            }) => action === "Update an employee's role",
            choices: [...employees],
     }
   ])
      .then(response => {
         if(response.action = "I'm done") {
            userPath(response);
            return true;
         } else {
            console.log("Thanks for using the employee database!");
         }
      });
};
databasePrompt()


const userPath = response => {
   switch(response.action) {
   case 'Add a new department': {
      XYZ(response)
         .then(response => XYZ(response))
         .then(() => databasePrompt());
      break;
   }
   case 'Add a new employee': {
      XYZ(response)
         .then(response => XYZ(response))
         .then(() => databasePrompt());
      break;
   }
   case 'Add a new role': {
      XYZ(response)
         .then(response => xxx(response))
         .then(() => databasePrompt());
      break;
   }
   case 'Update employee role': {
     updateEmployeeRole(response)
         .then(response => xxx(response))
         .then(() => databasePrompt());
      break;
   }
   case 'View all employees': {
      getEmployees(response)
         .then(() => databasePrompt());
      break;
   }
   case 'View all employees by department': {
      getEmployeesByDepartment(response)
         .then(() => databasePrompt());
      break;
   }
   case 'View all departments': {
      getDepartments(response)
   .then(() => databasePrompt());
   break;
   }
   case 'View all roles': {
      getRoles(response)
      .then(() => databasePrompt());
      break;
   }
};