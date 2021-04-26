// =============================================================
// DEPENDENCIES
// =============================================================
// Functionality
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const validate = require("./utils/validation");
const mysql = require('mysql2');

//Format
const chalk = require('chalk');
const figlet = require('figlet');
const gradient = require('gradient-string');
const redToGreen = gradient('red', 'green');
const str = '■'.repeat(155);
// Connection
const connection = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   port: 3306,
   password: 'password',
   database: "employee_database"
});
// Initiate
connection.connect((error) => {
   if(error) throw error
   console.log(redToGreen(str, {
      interpolation: 'hsv',
      hsvSpin: 'long'
   }));
   console.log(figlet.textSync("Welcome to the Employee Tracker."));
   console.log(redToGreen(str, {
      interpolation: 'hsv',
      hsvSpin: 'long'
   }));
   console.log(``);
   console.log(``);
   databasePrompt();
});
// =============================================================
// INQUIRER CORE QUESTIONS
// =============================================================
const databasePrompt = () => {
   inquirer.prompt([{
      name: "choices",
      type: "list",
      message: "What are you trying to do? Choose from options below.",
      choices: ["Add a new department", "Add a new role", "Add a new employee", "Update employee role", "Update Employee Manager", "View all employees", "View all departments", "View all employee roles", "View all employees by department", "Remove employee", "Remove role", "Remove Department", "View Budgets by Department", "I'm done"]
   }]).then((answers) => {
      const {
         choices
      } = answers;
      // Add
      if(choices === "Add a new department") {
         addDepartment();
      }
      if(choices === "Add a new role") {
         addRole();
      }
      if(choices === "Add a new employee") {
         addEmployee();
      }
      //Update
      if(choices === "Update employee role") {
         updateEmployeeRole();
      }
      if(choices === "Update Employee Manager") {
         updateEmployeeManager();
      }
      // View
      if(choices === "View all employees") {
         viewAllEmployees();
      }
      if(choices === "View all departments") {
         viewAllDepartments();
      }
      if(choices === "View all employee roles") {
         viewAllEmployeeRoles();
      }
      if(choices === "View all employees by department") {
         viewAllEmployeesByDepartment();
      }
      if(choices === "View Budgets by Department") {
         viewBudgetsByDepartment();
      }
      // Remove
      if(choices === "Remove employee") {
         removeEmployee();
      }
      if(choices === "Remove role") {
         removeRole();
      }
      if(choices === "Remove Department") {
         removeDepartment();
      }
      // Close application
      if(choices === "I'm done") {
         closeApplication();
         connection.end();
      }
   });
};
// =============================================================
// APPLICATION LOGIC
// =============================================================
// "Add a new department"
const addDepartment = () => {
   inquirer.prompt([{
      type: 'input',
      name: 'addDepartment',
      message: "What is the name of the new department?"
   }]).then((answer) => {
      let sqlQuery = `INSERT INTO department(department_name)VALUES (?)`;
      connection.query(sqlQuery, answer.addDepartment, (error, response) => {
         if(error) throw error;
         console.log(redToGreen(str, {
            interpolation: 'hsv',
            hsvSpin: 'long'
         }));
         console.log("Department was created successfully.");
         viewAllDepartments(); // should have new department listed
      });
   });
};
// "Add a new role"
const addRole = () => {
   const sqlQuery = 'SELECT * FROM department'
   connection.query(sqlQuery, (error, response) => {
      if(error) throw error;
      let departmentList = [];
      response.forEach((department) => {
         departmentList.push(department.department_name);
      });
      departmentList.push('Add department');
      inquirer.prompt([{
         type: 'list',
         name: 'departmentName',
         message: 'What is the department your new role belongs to?',
         choices: departmentList
      }]).then((answer) => {
         if(answer.departmentName === 'Add Department') {
            this.addDepartment();
         }
         else {
            addRoleDetails(answer);
         }
      });
      const addRoleDetails = (roleData) => {
         inquirer.prompt([{
            type: 'input',
            name: 'newRole',
            message: 'What is the name of the new role?'
         }, {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for the new role?'
         }]).then((answer) => {
            let newRole = answer.newRole;
            let departmentId;
            response.forEach((department) => {
               if(roleData.departmentName === department.department_name) {
                  departmentId = department.id;
               }
            });
            let sqlQuery = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            let criteria = [newRole, answer.salary, departmentId];
            connection.query(sqlQuery, criteria, (error) => {
               if(error) throw error;
               console.log((`New role type added to database successfully`));
               viewAllEmployeeRoles(); // show user with role added 
            });
         });
      };
   });
};
// "Add a new employee",
const addEmployee = () => {
   inquirer.prompt([{
      type: "input",
      name: "firstName",
      message: "What is the new employee's first name?",
      validate: inputFirstName => {
         if(inputFirstName) {
            return true;
         }
         else {
            console.log("Please enter a first name for the new employee.");
            return false;
         }
      }
   }, {
      type: "input",
      name: "lastName",
      message: "What is the new employee's last name?",
      validate: inputLastName => {
         if(inputLastName) {
            return true;
         }
         else {
            console.log("Please enter a last name for the new employee.");
            return false;
         }
      }
   }]).then(answer => {
      const criteria = [answer.firstName, answer.lastName]
      const sqlQuery2 = `SELECT role.id, role.title FROM role`;
      connection.query(sqlQuery2, (error, data) => {
         if(error) throw error;
         const roles = data.map(({
            id,
            title
         }) => ({
            name: title,
            value: id
         }));
         inquirer.prompt([{
            type: "list",
            name: "role",
            message: "What is the new employee's role?",
            choices: roles
         }]).then(selectRole => {
            const role = selectRole.role;
            criteria.push(role);
            const sqlQuery3 = `SELECT * FROM employee`;
            connection.query(sqlQuery3, (error, data) => {
               if(error) throw error;
               const managers = data.map(({
                  id,
                  first_name,
                  last_name
               }) => ({
                  name: first_name + " " + last_name,
                  value: id
               }));
               inquirer.prompt([{
                  type: "list",
                  name: "manager",
                  message: "Who is the new employee's manager?",
                  choices: managers
               }]).then(selectManager => {
                  const manager = selectManager.manager;
                  criteria.push(manager);
                  const sqlQuery4 = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                  connection.query(sqlQuery4, criteria, (error) => {
                     if(error) throw error;
                     console.log(redToGreen(str, {
                        interpolation: 'hsv',
                        hsvSpin: 'long'
                     }));
                     console.log("The new employee has been added to the databse successfully.");
                     viewAllEmployees(); // show with new employee added
                  });
               });
            });
         });
      });
   });
};
//"Update employee role",
const updateEmployeeRole = () => {
   const sqlQuery = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id" FROM employee, role, department  WHERE department.id = role.department_id AND role.id = employee.role_id`;
   connection.query(sqlQuery, (error, response) => {
      if(error) throw error;
      let employeeList = [];
      response.forEach((employee) => {
         employeeList.push(`${employee.first_name} ${employee.last_name}`);
      });
      const sqlQuery = `SELECT role.id, role.title FROM role`;
      connection.query(sqlQuery, (error, response) => {
         if(error) throw error;
         let roleList = [];
         response.forEach((role) => {
            roleList.push(role.title);
         });
         inquirer.prompt([{
            name: 'selectedEmployee',
            type: "list",
            message: 'Which employee has a new role?',
            choices: employeeList
         }, {
            name: 'selectedRole',
            type: "list",
            message: "What is the employee's new role?",
            choices: roleList
         }]).then((answer) => {
            let newTitleId, employeeId;
            response.forEach((role) => {
               if(answer.selectedRole === role.title) {
                  newTitleId = role.id;
               }
            });
            response.forEach((employee) => {
               if(answer.selectedEmployee === `${employee.first_name} ${employee.last_name}`) {
                  employeeId = employee.id;
               }
            });
            const sqlQuery = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
            connection.query(sqlQuery, [newTitleId, employeeId], (error) => {
               if(error) throw error;
               console.log(redToGreen(str, {
                  interpolation: 'hsv',
                  hsvSpin: 'long'
               }));
               console.log("Employee role updated.");
               console.log(redToGreen(str, {
                  interpolation: 'hsv',
                  hsvSpin: 'long'
               }));
               databasePrompt();
            });
         });
      });
   });
};
// "Update Employee Manager"
const updateEmployeeManager = () => {
   const sqlQuery = `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id
    FROM employee`;
   connection.query(sqlQuery, (error, response) => {
      if(error) throw error;
      let employeeList = [];
      response.forEach((employee) => {
         employeeList.push(`${employee.first_name} ${employee.last_name}`);
      });
      inquirer.prompt([{
         name: 'selectedEmployee',
         type: "list",
         message: 'Which employee would you like to update the manager for?',
         choices: employeeList
      }, {
         name: 'newManager',
         type: "list",
         message: 'Select the new manager for this emoloyee:',
         choices: employeeList
      }]).then((answer) => {
         let employeeId, managerId;
         response.forEach((employee) => {
            if(answer.selectedEmployee === `${employee.first_name} ${employee.last_name}`) {
               employeeId = employee.id;
            }
            if(answer.newManager === `${employee.first_name} ${employee.last_name}`) {
               managerId = employee.id;
            }
         });
         if(validate.isEqual(answer.selectedEmployee, answer.newManager)) {
            console.log(redToGreen(str, {
               interpolation: 'hsv',
               hsvSpin: 'long'
            }));
            console.log("Your manager selection did not work. Please try again.");
            console.log(redToGreen(str, {
               interpolation: 'hsv',
               hsvSpin: 'long'
            }));
            databasePrompt();
         }
         else {
            const sqlQuery = `UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`;
            connection.query(sqlQuery, [managerId, employeeId], (error) => {
               if(error) throw error;
               console.log(redToGreen(str, {
                  interpolation: 'hsv',
                  hsvSpin: 'long'
               }));
               console.log("Employee Manager successfully updated");
               console.log(redToGreen(str, {
                  interpolation: 'hsv',
                  hsvSpin: 'long'
               }));
               databasePrompt();
            });
         }
      });
   });
};
//"View all employees",
const viewAllEmployees = () => {
   let sqlQuery = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS 'department', role.salary FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id ORDER BY employee.id`; //not working
   connection.query(sqlQuery, (error, response) => {
      if(error) throw error;
      console.log(``);
      console.log(``);
      console.log(redToGreen(str, {
         interpolation: 'hsv',
         hsvSpin: 'long'
      }));
      console.log("Review current Employees:");
      console.log(``);
      console.table(response);
      databasePrompt();
   });
};
//"View all departments",
const viewAllDepartments = () => {
   const sqlQuery = `SELECT department.id AS id, department.department_name AS department FROM department`;
   connection.query(sqlQuery, (error, response) => {
      if(error) throw error;
      console.log(redToGreen(str, {
         interpolation: 'hsv',
         hsvSpin: 'long'
      }));
      console.log("Review all Departments:");
      console.table(response);
      console.log(redToGreen(str, {
         interpolation: 'hsv',
         hsvSpin: 'long'
      }));
      databasePrompt();
   });
};
// "View all employee roles",
const viewAllEmployeeRoles = () => {
   const sqlQuery = `SELECT role.id, role.title, department.department_name AS department FROM role INNER JOIN department ON role.department_id = department.id`;
   connection.query(sqlQuery, (error, response) => {
      if(error) throw error;
      console.log("Current Employee Roles:");
      console.log(redToGreen(str, {
         interpolation: 'hsv',
         hsvSpin: 'long'
      }));
      response.forEach((role) => {
         console.log(role.title);
      });
      databasePrompt();
   });
}
// "View all employees by department",
const viewAllEmployeesByDepartment = () => {
   const sqlQuery = `SELECT employee.first_name,  employee.last_name, department.department_name AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY department_name`;
   connection.query(sqlQuery, (error, response) => {
      if(error) throw error;
      console.log(redToGreen(str, {
         interpolation: 'hsv',
         hsvSpin: 'long'
      }));
      console.log("See employees by Department:");
      console.table(response);
      console.log(redToGreen(str, {
         interpolation: 'hsv',
         hsvSpin: 'long'
      }));
      databasePrompt();
   });
};
// "Remove employee",
const removeEmployee = () => {
   const sqlQuery = `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;
   connection.query(sqlQuery, (error, response) => {
      if(error) throw error;
      let employeeList = [];
      response.forEach((employee) => {
         employeeList.push(`${employee.first_name} ${employee.last_name}`);
      });
      inquirer.prompt([{
         name: 'selectedEmployee',
         type: "list",
         message: 'What employee would you like to remove from the database?',
         choices: employeeList
      }]).then((answer) => {
         let employeeId;
         response.forEach((employee) => {
            if(answer.selectedEmployee === `${employee.first_name} ${employee.last_name}`) {
               employeeId = employee.id;
            }
         });
         const sqlQuery = `DELETE FROM employee WHERE employee.id = ?`;
         connection.query(sqlQuery, [employeeId], (error) => {
            if(error) throw error;
            console.log(redToGreen(str, {
               interpolation: 'hsv',
               hsvSpin: 'long'
            }));
            console.log("Employee Successfully Removed");
            console.log(redToGreen(str, {
               interpolation: 'hsv',
               hsvSpin: 'long'
            }));
            viewAllEmployees();
         });
      });
   });
};
//"Remove role"
const removeRole = () => {
   const sqlQuery = `SELECT role.id, role.title FROM role`;
   connection.query(sqlQuery, (error, response) => {
      if(error) throw error;
      let roleList = [];
      response.forEach((role) => {
         roleList.push(role.title);
      });
      inquirer.prompt([{
         name: "selectedRole",
         type: "list",
         message: "What role would you like to remove?",
         choices: roleList
      }]).then((answer) => {
         let roleId;
         response.forEach((role) => {
            if(answer.selectedRole === role.title) {
               roleId = role.id;
            }
         });
         const sqlQuery = `DELETE FROM role WHERE role.id = ?`;
         connection.query(sqlQuery, [roleId], (error) => {
            if(error) throw error;
            console.log(redToGreen(str, {
               interpolation: 'hsv',
               hsvSpin: 'long'
            }));
            console.log("Role was successfully removed from the database.");
            console.log(redToGreen(str, {
               interpolation: 'hsv',
               hsvSpin: 'long'
            }));
            ployeeRoles();
         });
      });
   });
};
//"Remove Department",
const removeDepartment = () => {
   const sqlQuery = `SELECT department.id, department.department_name 
   FROM department`;
   connection.query(sqlQuery, (error, response) => {
      if(error) throw error;
      let departmentList = [];
      response.forEach((department) => {
         departmentList.push(department.department_name);
      });
      inquirer.prompt([{
         name: "selectedDepartment",
         type: "list",
         message: "What department would you like to remove from the database?",
         choices: departmentList
      }]).then((answer) => {
         let departmentId;
         response.forEach((department) => {
            if(answer.selectedDepartment === department.department_name) {
               departmentId = department.id;
            }
         });
         const sqlQuery = `DELETE FROM department 
               WHERE department.id = ?`;
         connection.query(sqlQuery, [departmentId], (error) => {
            if(error) throw error;
            console.log(redToGreen(str, {
               interpolation: 'hsv',
               hsvSpin: 'long'
            }));
            console.log("Selected Department successfully removed from database");
            console.log(redToGreen(str, {
               interpolation: 'hsv',
               hsvSpin: 'long'
            }));
            viewAllDepartments();
         });
      });
   });
};
const viewBudgetsByDepartment = () => {
   let sqlQuery = `SELECT department_id AS id, department.department_name AS department, SUM(salary) AS budget FROM role INNER JOIN department ON role.department_id = department.id GROUP BY role.department_id`;
   connection.query(sqlQuery, (error, response) => {
      if(error) throw error;
      console.log(redToGreen(str, {
         interpolation: 'hsv',
         hsvSpin: 'long'
      }));
      console.table(response);
      console.log(redToGreen(str, {
         interpolation: 'hsv',
         hsvSpin: 'long'
      }));
      databasePrompt();
   })
}
const closeApplication = () => {
   console.log(redToGreen(str, {
      interpolation: 'hsv',
      hsvSpin: 'long'
   }));
   console.log(figlet.textSync("Thank you!"));
   console.log(redToGreen(str, {
      interpolation: 'hsv',
      hsvSpin: 'long'
   }));
   console.log(``);
   console.log("Your session has ended.");
   console.log(``);
}