//https://dev.to/lisahjung/beginner-s-guide-to-using-mysql-database-in-a-node-js-app-49li

// Dependencies
// =============================================================
const inquirer = require("inquirer")
const Database = require("./config/connect")
const consoleTable = require('console.table');
const mysql = require('mysql2');

// Connect to database
// =============================================================
const connection = mysql.createConnection({
   host: 'localhost',
   port: 3306,
   user: 'root',
   password: 'password',
   database: 'db'
});


// Choices
// =============================================================
async function mainAppPrompt() {
   return inquirer.prompt([{
      type: "list",
      message: "What are you trying to do? See options below.",
      name: "selectAction",
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
        }])
}
async function askUser() {
   let endUser = false;
   while(!endUser) {
      const prompt = await mainAppPrompt();
      switch(prompt.action) {
      case 'Add a new department': {
         let newDepartment = await addNewDepartmentData();
         await addNewDepartment(newDepartment);
         break;
      }
      case 'Add a new employee': {
         let newEmployee = await getNewEmployeeData();
         await addNewEmployee(newEmployee);
         break;
      }
      case 'Add a new role': {
         let newRole = await getNewRoleData();
         await addRole(newRole);
         break;
      }
      case 'Update employee role': {
         let employee = await getUpdateRoleData();
         await updateRole(employee);
         break;
      }
      case 'View all employees': {
         await viewEmployees();
         break;
      }
      case 'View all employees by department': {
         await viewByDepartment();
         break;
      }
      case 'View all departments': {
         await viewDepartments();
         break;
      }
      case 'View all roles': {
         await viewRoles();
         break;
      }
      };
   }
   // Add a department
   // =============================================================
   async function addNewDepartmentData() {
      return inquirer.prompt([{
         type: "input",
         name: "department",
         message: "What is the name of the new department?",
    }])
   }
   async function addNewDepartment(departmentInfo) {
      let departmentName = departmentInfo.departmentName;
      let query = 'INSERT into department (name) VALUES (?)';
      let args = [departmentName];
      const rows = await myData.query(query, args);
      if(err) throw err;
      console.log('New department has successfully been added.')
   }
   // Add a new Employee
   // =============================================================
   async function addNewEmployee(employeeInfo) {
      let roleId = await getRoleId(employeeInfo.role);
      let managerId = await getEmployeeId(employeeInfo.manager);
      let query = "INSERT into employee (first_name, role_id, manager_id) VALUES (?, ?, ?)";
      let args = [employeeInfo.first_name, employeeInfo.last_name, roleId, managerId];
      const rows = await myData.query(query, args);
      if(err) throw err;
      console.log('New employee has been successfully added.')
   }
   async function getRoleId(roleName) {
      let query = "SELECT * FROM role WHERE role.title=?"
      let args = [roleName];
      const rows = await myData.query(query, args);
      return rows[0].id;
   }
   async function getNewEmployeeData() {
      const roles = await getRoles();
      const managers = await getManagerNames();
      return inquirer.prompt([{
            type: "input",
            name: "first_name",
            message: "What is the new employee’s first name?",
        },
         {
            type: "input",
            name: "last_name",
            message: "What is the new employee’s last name?",
        },
         {
            type: "input",
            name: "role",
            message: "What is the new employee’s job title?",
            choices: [...roles]
        },
         {
            type: "input",
            name: "salary",
            message: "What is the new employee’s salary?",
        },
         {
            type: "list",
            name: "manager",
            message: "Who is the employee's manager?",
            choices: [...managers]
        }
    ])
   }
   async function getRoles() {
      let query = "SELECT title FROM role";
      const rows = await myData.query(query);
      let roles = [];
      for(const row of rows) {
         roles.push(row.title);
      }
      return roles;
   }
   // Add Role
   // =============================================================
   async function addRole(roleInfo) {
      let departmentId = await getDepartmentId(roleInfo.departmentName);
      let salary = roleInfo.salary;
      let title = roleInfo.roleName;
      let query = 'INSERT into role (title, salary, department_id) VALUES (?, ?, ?)';
      let args = [title, salary, departmentId];
      const rows = await myData.query(query, args);
      async function getDepartmentId(departmentName) {
         let query = "SELECT * FROM role WHERE department.name=?"
         let args = [departmentName];
         const rows = await myData.query(query, args);
         return rows[0].id;
      }
      // Update a role
      // =============================================================
      async function updateRole(employeeInfo) {
         let roleId = await getRoleId(employeeInfo.role);
         let employee = getFullName(employeeInfo.employeeName);
         let query = 'UPDATE employee SET role_id=? WHERE employee.first_name=? AND employee.last_name=?';
         let args = [roleId, employee[0], employee[1]];
         const rows = await myData.query(query, args);
      }
      async function getUpdateRoleData() {
         const employees = await getEmployeeNames()
         const roles = await getRoles();
         return inquirer.prompt([{
               type: "list",
               name: "update_employee",
               message: "What employee's role do you want to update?",
               choices: [...employees]
        },
            {
               type: "list",
               name: "update_role",
               message: "What is their new role?",
               choices: [...roles]
        }
    ])
      }
      // View all departments
      // =============================================================
      async function viewDepartments() {
         let query = "SELECT name FROM department";
         const rows = await myData.query(query);
         let departments = [];
         for(const row of rows) {
            departments.push(row.names);
         }
         return departments;
      }
      async function viewEmployees() {
         let query = "SELECT * FROM employee";
         const rows = await myData.query(query);
         console.table(rows);
         return rows;
      }
      // View all employees by department
      // =============================================================
      async function viewByDepartment() {
         let query = "SELECT first_name, last_name, deparment.name FROM ((employee INNER JOIN role ON role_id = role.id) INNER JOIN department ON department_id = department.id);";
         const rows = await myData.query(query);
         console.table(rows);
         return rows;
      }
      // View all employee roles
      // =============================================================
      async function viewRoles() {
         let query = "SELECT * FROM employee";
         const rows = await myData.query(query);
         console.table(rows);
         return rows;
      }
      // Remove employees
      // =============================================================
      async function removeEmployee(employeeInfo) {
         let employeeName = getFullName(employeeInfo.employeeName);
         let query = 'DELETE from employee WHERE employee.first_name=? AND employee.last_name=?';
         let args = [employeeName[0], employeeName[1]];
         const rows = await myData.query(query, args);
         async function removeEmployeeData() {
            const employees = await getEmployeeNames();
            return inquirer.prompt([{
               type: "list",
               name: "employeeName",
               message: "What employee would you like to remove?",
               choices: [...employees]
        }])
         }
         async function getEmployeeNames() {
            let query = "SELECT * FROM employee";
            const rows = await myData.query(query);
            let employeeNames = [];
            for(const employee of rows) {
               employeeNames.push(employee.first_name + " " + employee.last_name);
            }
            return employeeNames;
         }
         // redundancy? function getFullName(fullName) {
         //let employee = fullName.split("");
         // return [first_name.trim(), last_name];
      }
   }
}

askUser();