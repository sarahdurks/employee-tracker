
// =============================================================
// DEPENDENCIES
// =============================================================
const dotenv = require('dotenv')
const inquirer = require("inquirer");
const consoleTable = require('console.table');
const validation = require("validator");


// =============================================================
// Inquirer Series
// =============================================================
const databasePrompt = () => {
   inquirer.prompt([{
            type: "list",
            message: "What are you trying to do? Choose from options below.",
            name: "choice",
            choices: [
                "Add a new department", // inputDepartmentName
                "Add a new role", // inputTitle,  inputSalary, inputFirstName, inputLastName
                "Add a new employee",
                "Update employee role",
                "Update Employee Manager", //
                "View all employees",
                "View all departments",
                "View all employee roles",
                "View all employees by department",
                "Remove employee",
                "Remove role",
                "Remove Department",
                "View Budgets by Department", // optional
                "I'm done"
            ]
        }
      ])
      .then((answers) => {
         const {choices} = answers;
   
           if (choices === "Add a new department") {
            addDepartment();
           }
   
           if (choices ===   "Add a new role") {
            addRole();
         }
   
           if (choices ===       "Add a new employee") {
            addEmployee ();
           }
   
           if (choices ===      "Update employee role") {
            updateEmployeeRole();
           }
   
           if (choices ===   "Update Employee Manager") {
            updateEmployeeManager();
        }
           if (choices ===  "View all employees") {
               viewAllEmployees();
           }
   
           if (choices ===  "View all departments") {
               viewAllDepartments();
           }
   
           if (choices === "View all employee roles") {
               viewAllEmployeeRoles();
           }
   
           if (choices === "View all employees by department") {
               viewAllEmployeesByDepartment();
           }
   
           if (choices === "Remove employee") {
               ();
           }
   
           if (choices === "Remove role") {
               xx();
           }
   
           if (choices === "Remove Departnent") {
              xx();
           }
   
           if (choices === "View Budgets by Department") {
               xx();
           }
   
       
   
           if (choices === "I'm done") {
               connection.end();
           }
         });
      };

      // "Add a new department"

      const addDepartment = () => {
         inquirer
           .prompt([
             {
               name: 'addDepartment',
               type: 'input',
               message: "What is the name of thenew department?",
               validate: validation.checkString
             }
           ])
           .then((answer) => {
             let sqlQuery = 
             `INSERT INTO department (department_name) 
             VALUES (?)`;
             connection.query(sqlQuery, answer.addDepartment, (error, response) => {
               if (error) throw error;
               console.log(answer.addDepartment + `department was created successfully!`);
               viewAllDepartments(); // should have new department listed
             });
           });

     
     // "Add a new role"

      const addRole = (departmentDatabase) => {
         inquirer
           .prompt([
             {
               name: 'newRole',
               type: 'input',
               message: 'What is the name of your new role?',
               validate: validation.checkString
             },
             {
               name: 'salary',
               type: 'input',
               message: 'What is the salary for the new role?',
               validate: validation.checkNumber
             }
           ])
           .then((answer) => {
             let newRole = answer.newRole;
             let departmentId;
     
             response.forEach((department) => { // check here
               if (departmentDatabase.departmentName === department.department_name) {departmentId = department.id;}
             });
             let sqlQuery =   
             `INSERT INTO role (title, salary, department_id) 
             VALUES (?, ?, ?)`;
             let criteria = [newRole, answer.salary, departmentId];
             connection.promise().query(sqlQuery, criteria, (error) => {
               if (error) throw error;
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
            if (inputFirstName) {
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
            if (inputLastName) {
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
        const sqlQuery = `SELECT role.id, role.title FROM role`;
        connection.promise().query(sqlQuery, (error, data) => {
          if (error) throw error; 
          const roles = data.map(({ id, title }) => ({ name: title, value: id }));
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
                  connection.promise().query(sqlQuery, (error, data) => {
                    if (error) throw error;
                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
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
                        if (error) throw error;
                        console.log("The new employee has been added to the databse successfully.")
                        viewAllEmployees(); // show with new employee added
                  });
                });
              });
            });
         });
      });

      //"Update employee role",

      const updateEmployeeRole = () => {
         let sqlQuery =       
         `SELECT employee.id, 
         employee.first_name, 
         employee.last_name, 
         role.id AS "role_id"
         FROM employee, role, 
         department WHERE department.id = role.department_id 
         AND role.id = employee.role_id`;
         connection.promise().query(sqlQuery, (error, response) => {
           if (error) throw error;
           let employeeNameList = [];
           response.forEach((employee) => {employeeNameList.push(`${employee.first_name} ${employee.last_name}`);});
     
           let sqlQuery =     
           `SELECT role.id, role.title 
           FROM role`;
           connection.promise().query(sqlQuery, (error, response) => {
             if (error) throw error;
             let roleList = [];
             response.forEach((role) => {roleList.push(role.title);});
             inquirer
               .prompt([
                 {
                   name: 'selectedEmployee',
                   type: "list",
                   message: 'Which employee has a new role?',
                   choices: employeeNameList
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
                   if (answer.selectedRole === role.title) {
                     newTitleId = role.id;
                   }
                 });
     
                 response.forEach((employee) => {
                   if (
                     answer.selectedEmployee ===
                     `${employee.first_name} ${employee.last_name}`
                   ) {
                     employeeId = employee.id;
                   }
                 });
     
                 let sqlQuery =    
                 `UPDATE employee SET employee.role_id = ? 
                 WHERE employee.id = ?`;
                 connection.query(
                     sqlQuery ,
                   [newTitleId, employeeId],
                   (error) => {
                     if (error) throw error;
                     console.log("Employee role updated.");
                     databasePrompt();
                   }
                 );
               });
           });
         });
       };
     



      //"Update Employee Manager", //

      const updateEmployeeManager = () => {
         let sqlQuery =       
         `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id
         FROM employee`;
          connection.promise().query(sqlQuery, (error, response) => {
           let employeeNameList = [];
           response.forEach((employee) => {employeeNameList.push(`${employee.first_name} ${employee.last_name}`);});
           inquirer
             .prompt([
               {
                 name: 'selectedEmployee',
                 type: "list",
                 message: 'Which employee would you like to update the manager for?',
                 choices: employeeNameList
               },
               {
                 name: 'newManager',
                 type: "list",
                 message: 'Select the new manager for this emoloyee:',
                 choices: employeeNameList
               }
             ])
             .then((answer) => {
               let employeeId, managerId;
               response.forEach((employee) => {
                 if (
                   answer.selectedEmployee === `${employee.first_name} ${employee.last_name}`
                 ) {
                   employeeId = employee.id;
                 }
     
                 if (
                   answer.newManager === `${employee.first_name} ${employee.last_name}`
                 ) {
                   managerId = employee.id;
                 }
               });
               if (validation.isSame(answer.selectedEmployee, answer.newManager)) {
                 console.log("IYour manager selection did not work. Please try again.");
                
                 databasePrompt();
               } else {
                 let sqlQuery = 
                 `UPDATE employee 
                 SET employee.manager_id = ? 
                 WHERE employee.id = ?`;
     
                 connection.query(
                   sqlQuery,
                   [managerId, employeeId],
                   (error) => {
                     if (error) throw error;
                     console.log("Employee Manager successfully updated");
                     databasePrompt();
                   }
                 );
               }
             });
         });
     };
     
      "View all employees",

      const viewAllEmployees = () => {
         let sqlQuery = 
         `SELECT employee.id,  employee.first_name,  employee.last_name, role.title, department.department_name AS 'department', 
          role.salary FROM employee, role, department 
         WHERE department.id = role.department_id 
         AND role.id = employee.role_id
         ORDER BY employee.id`;
         connection.promise().query(sqlQuery, (error, response) => {
           if (error) throw error;
           console.log("Review current Employees:");
           console.table(response);
           promptDatabase();
         });
       };
     
      "View all departments",

      const viewAllDepartments = () => {
         let sqlQuery =   
         `SELECT department.id 
         AS id, department.department_name 
         AS department FROM department`; 
         connection.promise().query(sqlQuery, (error, response) => {
           if (error) throw error;
           console.log("Review all Departments:");
           console.table(response);
           promptDatabase();
         });
       };
     

       
      "View all employee roles",

      const viewAllEmployeeRoles = () => {
         let sqlQuery =     
         `SELECT role.id, role.title, department.department_name AS department
         FROM role
         INNER JOIN department ON role.department_id = department.id`;
         connection.promise().query(sqlQuery, (error, response) => {
           if (error) throw error;
           console.log("Current Employee Roles:");
             response.forEach((role) => {console.log(role.title);});
             promptDatabase();
         });
       };
     
      "View all employees by department",

      const viewAllEmployeesByDepartment = () => {
    let sqlQuery =     
    `SELECT employee.first_name,  employee.last_name, department.department_name AS department
     FROM employee 
     LEFT JOIN role ON employee.role_id = role.id 
     LEFT JOIN department ON role.department_id = department.id`;
    connection.query(sqlQuery, (error, response) => {
      if (error) throw error;
        console.log("See employees by Department:");
        console.table(response);
        promptDatabase();
      });
  };
      "Remove employee",
      "Remove role",
      "Remove Department",
      "View Budgets by Department", // optional
      const viewDepartmentBudgets = () => {
         let sqlQuery =     
         `SELECT department_id AS id, 
          department.department_name AS department,
          SUM(salary) AS budget
          FROM role  
          INNER JOIN department ON role.department_id = department.id 
          GROUP BY  role.department_id`;
         connection.query(sqlQuery, (error, response) => {
           if (error) throw error;
           console.log("See budgets By Department:");
             console.table(response);
             promptDatabase();
         });
       };
      "I'm done"
        
           






















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


{ // Add a new department
   type: "input",
   name: "department_name",
   message: "Please enter a name for the new department:",
   when: ({
      choice
   }) => choice === "Add a new department", // future to do: add logic check if already a dept?
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
