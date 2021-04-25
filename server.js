// Dependencies


// Functions for query types
const { getRoleList, getRoles, queryRoles, addRole} = require("./config/roles");
const { getEmployeeList, getEmployees, queryEmployeeName, queryEmployeeById,  updateEmployeeRole } = require("./config/employees");
const { getDepartmentList, addNewDepartment, getAllDepartments, queryDepartment } = require("./config/department");
//const inquirer = require('inquirer');
// TODO SOME MISSING EMPLOYEE LOGIC


// Question Series / Logic
// =============================================================
async function databasePrompt() {
   // aggregate choice lists to display to user
   let managers = await getManagerList();
   let employees = await getEmployeeList();
   let departments = await getDepartmentList();
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
         
         {// Add department
            type: "input",
            name: "department_name",
            message: "Please enter a name for the new department:",
            when: ({
               action
            }) => action === "Add a new department",
            validate: departmentName => {
               if(departmentName) { //better approach to this?
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
               action
            }) => action === "Add a new role",
            validate: title => {
               if(title) {
                  return true;
               } else {
                  console.log("Please enter a job title for the new role.");
                  return false;
               }
            }
     },
         {// Add new role salary
            type: "number", // may need a better solution w decimals, think this has to match database
            name: "salary",
            message: "Enter a salary for this new role:",
            when: ({
               action
            }) => action === "Add a role",
            validate: salary => {
               if(salary) {
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
            message: "Enter the employee's first name:",
            when: ({
               action
            }) => action === "Add an employee",
            validate: firstName => {
               if(firstName) {
                  return true;
               } else {
                  console.log("Please enter the employee's first name.");
                  return false;
               }
            }
     },
         {// Add new employee last name
            type: "input", 
            name: "last_name",
            message: "Enter the employee's last name:",
            when: ({
               action
            }) => action === "Add an employee",
            validate: lastName => {
               if(lastName) {
                  return true;
               } else {
                  console.log("Please enter the employee's last name.");
                  return false;
               }
            }
     },
         
         {// Select department
            type: "list",
            name: "department_name",
            message: "Select the department:", // reuse 
            when: ({
               action
            }) => action === "Add a new role" || action === "View employees by department",
            choices: [...departments]
     },
         
         
         {// Add role for new employee
            type: "list",
            name: "role_title",
            message: "Select the new Employee's role",
            when: ({
               action
            }) => action === "Add an employee",
            choices: [...roles],
     },
         {// Select manager name
            type: "list",
            name: "manager_name",
            message: "Select employee's Manager:",
            when: ({
               action
            }) => action === "Add an employee",
            choices: [...managers]
     },
         { // Select employee to update role
            type: "list",
            name: "employee_name",
            message: "Select the employee you'd like to update role data for",
            when: ({
               action
            }) => action === "Update an employee's role",
            choices: [...employees],
     },
         {// Update role for selected employee
            type: "list",
            name: "job_title",
            message: "Select the updated role for this employee",
            when: ({
               action
            }) => action === "Update an employee's role",
            choices: [...employees],
     }
   ]) // Exit route
      .then(response => {
         if(response.action = "I'm done") {
            userPath(response);
            return true;
         } else {
            console.log("Thanks for using the employee database!");
         }
      });
};
databasePrompt();

// If/then function logic
const userPath = response => {
   switch(response.action) {

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
   //
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
