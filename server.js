// =============================================================
// DEPENDENCIES
// =============================================================

const inquirer = require("inquirer");
const connection = require("./utils/connect");
const consoleTable = require('console.table');
const validate = require("./utils/validation");


//import { createRequire } from 'module';
//const require = createRequire(import.meta.url);

connection.connect((error) => {
   if (error) throw error;
   console.log("Something went wrong with connecting to the database.");
   databasePrompt();
});
// =============================================================
// INQUIRER CORE QUESTIONS
// =============================================================
const databasePrompt = () => {
   inquirer.prompt([{
            type: "list",
            message: "What are you trying to do? Choose from options below.",
            name: "choice",
            choices: [
                "Add a new department",
                "Add a new role",
                "Add a new employee",
                "Update employee role",
                "Update Employee Manager", 
                "View all employees",
                "View all departments",
                "View all employee roles",
                "View all employees by department",
                "Remove employee",
                "Remove role",
                "Remove Department",
                "View Budgets by Department",
                "I'm done"
            ]
        }
      ])
      .then((answers) => {
         const {
            choices
         } = answers;
         if(choices === "Add a new department") {
            addDepartment();
         }
         if(choices === "Add a new role") {
            addRole();
         }
         if(choices === "Add a new employee") {
            addEmployee();
         }
         if(choices === "Update employee role") {
            updateEmployeeRole();
         }
         if(choices === "Update Employee Manager") {
            updateEmployeeManager();
         }
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
         if(choices === "Remove employee") {
            removeEmployee();
         }
         if(choices === "Remove role") {
            removeRole();
         }
         if(choices === "Remove Department") {
            removeDepartment();
         }
         if(choices === "View Budgets by Department") {
            viewBudgetsByDepartment();
         }
         if(choices === "I'm done") {
            connection.end();
         }
      });
};

// =============================================================
// APPLICATION LOGIC
// =============================================================

// "Add a new department"
const addDepartment = () => {
   inquirer.prompt([
         {
            name: 'addDepartment',
            type: 'input',
            message: "What is the name of thenew department?",
            validate: validate.checkString
             }
           ])
      .then((answer) => {
         let sqlQuery = 
            `INSERT INTO department (department_name) 
             VALUES (?)`;
         connection.query(sqlQuery, answer.addDepartment, (error, response) => {
            if(error) throw error;
            console.log(answer.addDepartment + `department was created successfully!`);
            viewAllDepartments(); // should have new department listed
         });
      });
};
// "Add a new role"
const addRole = (departmentDatabase) => {
   inquirer.prompt([
         {
            name: 'newRole',
            type: 'input',
            message: 'What is the name of your new role?',
            validate: validate.checkString
             },
         {
            name: 'salary',
            type: 'input',
            message: 'What is the salary for the new role?',
            validate: validate.checkNumber
             }
           ])
      .then((answer) => {
         let newRole = answer.newRole;
         let departmentId;
         response.forEach((department) => { // check here
            if(departmentDatabase.departmentName === department.department_name) {
               departmentId = department.id;
            }
         });
         let sqlQuery = 
         `INSERT INTO role (title, salary, department_id) 
         VALUES (?, ?, ?)`;
         let criteria = [newRole, answer.salary, departmentId];
         connection.promise()
            .query(sqlQuery, criteria, (error) => {
               if(error) throw error;
               console.log((`New role type added to database successfully`));
               viewAllRoles(); // show user with role added 
            });
      });
};
// "Add a new employee",
const addEmployee = () => {
   inquirer.prompt([
         {
            type: "input",
            name: "firstName",
            message: "What is the new employee's first name?",
            validate: inputFirstName => {
               if(inputFirstName) {
                  return true;
               } else {
                  console.log("Please enter a first name for the new employee.");
                  return false;
               }
            }
        },
         {
            type: "input",
            name: "lastName",
            message: "What is the new employee's last name?",
            validate: inputLastName => {
               if(inputLastName) {
                  return true;
               } else {
                  console.log("Please enter a last name for the new employee.");
                  return false;
               }
            }
        }
      ])
      .then(answer => {
         const criteria = [answer.fistName, answer.lastName]
         const sqlQuery = 
         `SELECT role.id, role.title FROM role`;
         connection.promise()
            .query(sqlQuery, (error, data) => {
               if(error) throw error;
               const roles = data.map(({
                  id,
                  title
               }) => ({
                  name: title,
                  value: id
               }));
               inquirer.prompt([
                     {
                        type: "list",
                        name: "role",
                        message: "What is the new employee's role?",
                        choices: roles // pull from data dynamically
                }
              ])
                  .then(selectRole => {
                     const role = selectRole.role;
                     criteria.push(role);
                     const sqlQuery = 
                     `SELECT * FROM employee`;
                     connection.promise()
                        .query(sqlQuery, (error, data) => {
                           if(error) throw error;
                           const managers = data.map(({
                              id,
                              first_name,
                              last_name
                           }) => ({
                              name: first_name + " " + last_name,
                              value: id
                           }));
                           inquirer.prompt([
                                 {
                                    type: "list",
                                    name: "manager",
                                    message: "Who is the new employee's manager?",
                                    choices: managers
                      }
                    ])
                              .then(selectManager => {
                                 const manager = selectManager.manager;
                                 criteria.push(manager);
                                 const sqlQuery = 
                                 `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                 VALUES (?, ?, ?, ?)`;
                                 connection.query(sqlQuery, criteria, (error) => {
                                    if(error) throw error;
                                    console.log("The new employee has been added to the databse successfully.")
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
   let sqlQuery = 
   `SELECT employee.id, employee.first_name, employee.last_name, role.id 
   AS "role_id"
   FROM employee, role, department 
   WHERE department.id = role.department_id 
   AND role.id = employee.role_id`;
   connection.promise()
      .query(sqlQuery, (error, response) => {
         if(error) throw error;
         let employeeList = [];
         response.forEach((employee) => {
            employeeList.push(`${employee.first_name} ${employee.last_name}`);
         });
         let sqlQuery = 
         `SELECT role.id, role.title 
          FROM role`;
         connection.promise()
            .query(sqlQuery, (error, response) => {
               if(error) throw error;
               let roleList = [];
               response.forEach((role) => {
                  roleList.push(role.title);
               });
               inquirer.prompt([
                     {
                        name: 'selectedEmployee',
                        type: "list",
                        message: 'Which employee has a new role?',
                        choices: employeeList
                 },
                     {
                        name: 'selectedRole',
                        type: "list",
                        message: "What is the employee's new role?",
                        choices: roleList
                 }
               ])
                  .then((answer) => {
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
                     let sqlQuery = 
                     `UPDATE employee 
                     SET employee.role_id = ? 
                     WHERE employee.id = ?`;
                     connection.query(sqlQuery,
                   [newTitleId, employeeId],
                        (error) => {
                           if(error) throw error;
                           console.log("Employee role updated.");
                           databasePrompt();
                        });
                  });
            });
      });
};
// "Update Employee Manager"
const updateEmployeeManager = () => {
   let sqlQuery = 
   `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id
    FROM employee`;
   connection.promise()
      .query(sqlQuery, (error, response) => {
         let employeeList = [];
         response.forEach((employee) => {
            employeeList.push(`${employee.first_name} ${employee.last_name}`);
         });
         inquirer.prompt([
               {
                  name: 'selectedEmployee',
                  type: "list",
                  message: 'Which employee would you like to update the manager for?',
                  choices: employeeList
               },
               {
                  name: 'newManager',
                  type: "list",
                  message: 'Select the new manager for this emoloyee:',
                  choices: employeeList
               }
             ])
            .then((answer) => {
               let employeeId, managerId;
               response.forEach((employee) => {
                  if(answer.selectedEmployee === `${employee.first_name} ${employee.last_name}`) {
                     employeeId = employee.id;
                  }
                  if(answer.newManager === `${employee.first_name} ${employee.last_name}`) {
                     managerId = employee.id;
                  }
               });
               if(validate.isSame(answer.selectedEmployee, answer.newManager)) {
                  console.log("IYour manager selection did not work. Please try again.");
                  databasePrompt();
               } else {
                  let sqlQuery = 
                 `UPDATE employee 
                 SET employee.manager_id = ? 
                 WHERE employee.id = ?`;
                  connection.query(sqlQuery,
                   [managerId, employeeId],
                     (error) => {
                        if(error) throw error;
                        console.log("Employee Manager successfully updated");
                        databasePrompt();
                     });
               }
            });
      });
};
//"View all employees",
const viewAllEmployees = () => {
   let sqlQuery = 
   `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name 
   AS 'department', 
   role.salary FROM employee, role, department 
   WHERE department.id = role.department_id 
   AND role.id = employee.role_id
   ORDER BY employee.id`;
   connection.promise()
      .query(sqlQuery, (error, response) => {
         if(error) throw error;
         console.log("Review current Employees:");
         console.table(response);
         databasePrompt();
      });
};

//"View all departments",
const viewAllDepartments = () => {
   let sqlQuery = 
   `SELECT department.id 
   AS id, department.department_name 
   AS department FROM department`;
   connection.promise()
      .query(sqlQuery, (error, response) => {
         if(error) throw error;
         console.log("Review all Departments:");
         console.table(response);
         databasePrompt();
      });
};
// "View all employee roles",
const viewAllEmployeeRoles = () => {
   let sqlQuery = 
   `SELECT role.id, role.title, department.department_name AS department
   FROM role
   INNER JOIN department ON role.department_id = department.id`;
   connection.promise()
      .query(sqlQuery, (error, response) => {
         if(error) throw error;
         console.log("Current Employee Roles:");
         response.forEach((role) => {
            console.log(role.title);
         });
         databasePrompt();
      });
};
// "View all employees by department",
const viewAllEmployeesByDepartment = () => {
   let sqlQuery = 
   `SELECT employee.first_name,  employee.last_name, department.department_name 
   AS department
   FROM employee 
   LEFT JOIN role ON employee.role_id = role.id 
   LEFT JOIN department ON role.department_id = department.id`;
   connection.query(sqlQuery, (error, response) => {
      if(error) throw error;
      console.log("See employees by Department:");
      console.table(response);
      databasePrompt();
   });
};
// "Remove employee",
const removeEmployee = () => {
   let sqlQuery = 
   `SELECT employee.id, employee.first_name, employee.last_name 
   FROM employee`;
   connection.promise()
      .query(sqlQuery, (error, response) => {
         if(error) throw error;
         let employeeList = [];
         response.forEach((employee) => {
            employeeList.push(`${employee.first_name} ${employee.last_name}`);
         });
         inquirer.prompt([
               {
                  name: 'selectedEmployee',
                  type: "list",
                  message: 'What employee would you like to remove from the database?',
                  choices: employeeList
               }
             ])
            .then((answer) => {
               let employeeId;
               response.forEach((employee) => {
                  if(answer.selectedEmployee === `${employee.first_name} ${employee.last_name}`) {
                     employeeId = employee.id;
                  }
               });
               let sqlQuery = 
               `DELETE FROM employee 
               WHERE employee.id = ?`;
               connection.query(sqlQuery, [employeeId], (error) => {
                  if(error) throw error;
                  console.log("Employee Successfully Removed");
                  viewAllEmployees();
               });
            });
      });
};
//"Remove role"
const removeRole = () => {
   let sqlQuery = 
   `SELECT role.id, role.title 
   FROM role`;
   connection.promise()
      .query(sqlQuery, (error, response) => {
         if(error) throw error;
         let roleList = [];
         response.forEach((role) => {
            roleList.push(role.title);
         });
         inquirer.prompt([
               {
                  name: "selectedRole",
                  type: "list",
                  message: "What role would you like to remove?",
                  choices: roleList
               }
             ])
            .then((answer) => {
               let roleId;
               response.forEach((role) => {
                  if(answer.selectedRole === role.title) {
                     roleId = role.id;
                  }
               });
               let sqlQuery = 
               `DELETE FROM role 
               WHERE role.id = ?`;
               connection.promise()
                  .query(sqlQuery, [roleId], (error) => {
                     if(error) throw error;
                     console.log("Role was successfully removed from the database.");
                     viewAllRoles();
                  });
            });
      });
};
//"Remove Department",
const removeDepartment = () => {
   let sqlQuery = 
   `SELECT department.id, department.department_name 
   FROM department`;
   connection.promise()
      .query(sqlQuery, (error, response) => {
         if(error) throw error;
         let departmentList = [];
         response.forEach((department) => {
            departmentList.push(department.department_name);
         });
         inquirer.prompt([
               {
                  name: "selectedDepartment",
                  type: "list",
                  message: "What department would you like to remove from the database?",
                  choices: departmentList
               }
             ])
            .then((answer) => {
               let departmentId;
               response.forEach((department) => {
                  if(answer.selectedDepartment === department.department_name) {
                     departmentId = department.id;
                  }
               });
               let sqlQuery = 
               `DELETE FROM department 
               WHERE department.id = ?`;
               connection.promise()
                  .query(sqlQuery, [departmentId], (error) => {
                     if(error) throw error;
                     console.log("Selected Department successfully removed from database");
                     viewAllDepartments();
                  });
            });
      });
};
// "View Budgets by Department", // optional
const viewBudgetsByDepartment = () => {
   let sqlQuery = 
   `SELECT department_id AS id, 
   department.department_name AS department,
   SUM(salary) AS budget
   FROM role  
   INNER JOIN department 
   ON role.department_id = department.id 
   GROUP BY  role.department_id`;
   connection.query(sqlQuery, (error, response) => {
      if(error) throw error;
      console.log("See budgets by department:");
      console.table(response);
      databasePrompt();
   });
};