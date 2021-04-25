
// =============================================================
// DEPENDENCIES
// =============================================================

// Department List
const {
   getDepartmentList,
   addNewDepartment,
   getAllDepartments
} = require("./config/department");

// Employee Logic
const {
   getEmployeeList,
   getEmployees,
   getManagerList,
   getEmployeesByDepartment,
   addEmployee,
   queryEmployeeName,
   queryEmployeeById,
   deleteEmployee,
   updateEmployeeRole
} = require("./config/employees");

// Role Logic
const {
   getRoleList,
   getRoles,
   queryRoles,
   addRole
} = require("./config/roles");
const inquirer = require("inquirer");
/*
https://stackoverflow.com/questions/33589571/module-exports-that-include-all-functions-in-a-single-line
https://stackoverflow.com/questions/31354559/using-node-js-require-vs-es6-import-export?rq=1hello.js
*/

// =============================================================
// Inquirer Series
// =============================================================
const databasePrompt = async () => {
   // aggregate choice lists to display to user
   let managers = await getManagerList();
   let employees = await getEmployeeList();
   let departments = await getDepartmentList();
   let roles = await getRoleList();
   //main menu
   inquirer.prompt([{
            type: "list",
            message: "What are you trying to do? Choose from options below.",
            name: "choice",
            choices: [
                "Add a new department", // inputDepartmentName
                "Add a new role", // inputTitle,  inputSalary, inputFirstName, inputLastName
                "Add a new employee",
                "Update employee role",
                "View all employees",
                "View all departments",
                "View all employee roles",
                "View all employees by department",
                "Remove employee",
                "I'm done"
            ]
        },
         
         { // Add a new department
            type: "input",
            name: "department_name",
            message: "Please enter a name for the new department:",
            when: ({
               choice
            }) => choice === "Add a new department",
            validate: inputDepartmentName => {
               if(inputDepartmentName) {
                  return true;
               } else {
                  console.log("Please enter a name for the new department.");
                  return false;
               }
            }
     },
         { // Add role
            type: "input",
            name: "title",
            message: "Please enter a title for the new role.",
            when: ({
               choice
            }) => choice === "Add a new role",
            validate: inputTitle => {
               if(inputTitle) {
                  return true;
               } else {
                  console.log("Please enter a job title for the new role.");
                  return false;
               }
            }
     },
         { // Add new role salary
            type: "number", // may need a better solution w decimals, think this has to match database
            name: "salary",
            message: "Enter a salary for this new role. Follow format $50000.00",
            when: ({
               choice
            }) => choice === "Add a role",
            validate: inputSalary => {
               if(inputSalary) {
                  return true;
               } else {
                  console.log("Please enter a valid number for salary.");
                  return false;
               }
            }
     },
         { // Add new employee first name
            type: "input",
            name: "first_name",
            message: "Enter the new employee's first name:",
            when: ({
               choice
            }) => choice === "Add an employee",
            validate: inputFirstName => {
               if(inputFirstName) {
                  return true;
               } else {
                  console.log("Please enter the employee's first name.");
                  return false;
               }
            }
     },
         { // Add new employee last name
            type: "input",
            name: "last_name",
            message: "Enter the new employee's last name:",
            when: ({
               choice
            }) => choice === "Add an employee",
            validate: inputLastName => {
               if(inputLastName) {
                  return true;
               } else {
                  console.log("Please enter the employee's last name.");
                  return false;
               }
            }
     },
         
         { // Select department
            type: "list",
            name: "department_name",
            message: "Select the department:", // reuse 
            when: ({
               choice
            }) => choice === "Add a new role" || choice === "View employees by department",
            choices: [...departments]
     },
         
         
         { // Add role for new employee
            type: "list",
            name: "role_title",
            message: "Select the new Employee's role",
            when: ({
               choice
            }) => choice === "Add an employee",
            choices: [...roles],
     },
         { // Select manager name
            type: "list",
            name: "manager_name",
            message: "Select employee's Manager:",
            when: ({
               choice
            }) => choice === "Add an employee",
            choices: [...managers]
     },
         { // Select employee to update role
            type: "list",
            name: "employee_name",
            message: "Select the employee you'd like to update role data for",
            when: ({
               choice
            }) => choice === "Update an employee's role",
            choices: [...employees],
     },
         { // Update role for selected employee
            type: "list",
            name: "job_title",
            message: "Select the updated role for this employee",
            when: ({
               choice
            }) => choice === "Update an employee's role",
            choices: [...employees],
     }
   ]) // Exit route
      .then(response => {
         if(response.choice = "I'm done") {
            userPath(response);
            return true;
         } else {
            console.log("Thanks for using the employee database!");
         }
      });
};

// addNewDepartment // queryDepartment
// addEmployee // queryEmployeeName
// addRole // queryRoles
// updateEmployeeRole // queryEmployeeById
// getEmployees
// getEmployeesByDepartment
// getAllDepartments
// deleteEmployee
// getRoles

// =============================================================
// CASE LOGIC
// =============================================================
databasePrompt();
const userPath = response => {
   switch(response.choice) {
   case "Add a new department":
      addNewDepartment(response)
         .then(response => queryDepartment(response))
         .then(() => databasePrompt());
      break;
   case "Add a new employee":
      addEmployee(response)
         .then(response => queryEmployeeName(response))
         .then(() => databasePrompt());
      break;
   case "Add a new role":
      addRole(response)
         .then(response => queryRoles(response))
         .then(() => databasePrompt());
      break;
   case "Update employee role":
      updateEmployeeRole(response)
         .then(response => queryEmployeeById(response))
         .then(() => databasePrompt());
      break;
   case "View all employees":
      getEmployees(response)
         .then(() => databasePrompt());
      break;
   case "View all employees by department":
      getEmployeesByDepartment(response)
         .then(() => databasePrompt());
      break;
   case "View all departments":
      getAllDepartments(response)
         .then(() => databasePrompt());
      break;
   case "Remove employee":
      deleteEmployee(response)
         .then(() => databasePrompt());
      break;
   case "View all roles":
      getRoles(response)
         .then(() => databasePrompt());
      break;
   }
};