// =============================================================
// DEPENDENCIES
// =============================================================
// Functionality
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const mysql = require('mysql2');
const validate = require("./utils/validation");
const connection = require("./utils/connecting");
// Format
const chalk = require('chalk');
const figlet = require('figlet');
const gradient = require('gradient-string');
const redToGreen = gradient('red', 'green');
const str = '■'.repeat(155);
// =============================================================
// CONNECT AND INITIATE
// =============================================================
connection.connect((error) => {
  if(error) throw error
  console.log(redToGreen(str, {
    interpolation: 'hsv',
    hsvSpin: 'long'
  })); // Using extra console.log to format CLI output with dividers, may be a better way
  console.log(figlet.textSync("Welcome to the Employee Tracker."));
  console.log(redToGreen(str, {
    interpolation: 'hsv',
    hsvSpin: 'long'
  }));
  employeeApp();
});
// =============================================================
// STARTER PROMPT OPTIONS BY TYPE
// =============================================================
const employeeApp = () => {
  inquirer.prompt([{
    name: "choices",
    type: "list",
    message: "What are you trying to do? Choose from options below.",
    choices: ["Add a new department", "Add a new role", "Add a new employee", "Update employee role", "View all employees", "View all departments", "View all employee roles", "View all employees by department", "View Budgets by Department", "Remove employee", "Remove role", "Remove Department", "I'm done"]
    // =============================================================
    // CHOICE LOGIC 
    // =============================================================
  }]).then((responses) => {
    const {
      choices
    } = responses;
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
    // if(choices === "Update Employee Manager") {updateEmployeeManager();}
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
    // if(choices === "Remove role") {removeRole();}
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
// LOGIC GROUPED BY ACTION TYPE
// =============================================================
// ============================================================= 
// ADD TO DATABASE
// =============================================================
//  Add New Department
// =============================================================
const addDepartment = () => {
  inquirer.prompt([{
    type: 'input',
    name: 'addDepartment',
    message: "What is the name of the new department?"
  }]).then((answer) => {
    let sqlQ = `INSERT INTO department(department_name)VALUES (?)`;
    connection.query(sqlQ, answer.addDepartment, (error, response) => {
      if(error) throw error;
      //  New Department Confirmation
      // =============================================================
      console.log(redToGreen(str, {
        interpolation: 'hsv',
        hsvSpin: 'long'
      }));
      console.log("Department was created successfully.");
      viewAllDepartments();
    });
  });
};
//  Add New Role
// =============================================================
const addRole = () => {
  const sqlQ = 'SELECT * FROM department'
  connection.query(sqlQ, (error, response) => {
    if(error) throw error;
    let departmentArray = [];
    response.forEach((department) => {
      departmentArray.push(department.department_name);
    });
    departmentArray.push('Add department to role');
    inquirer.prompt([{
      type: 'list',
      name: 'departmentName',
      message: 'What is the department your new role belongs to?',
      choices: departmentArray
    }]).then((answer) => {
      if(answer.departmentName === 'Add Department') {
        this.addDepartment();
      }
      else {
        addRoleData(answer);
      }
    });
    const addRoleData = (roleData) => {
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
        let departmentNameMatch;
        response.forEach((department) => {
          if(roleData.departmentName === department.department_name) {
            departmentNameMatch = department.id;
          }
        });
        let sqlQ = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
        let criteria = [newRole, answer.salary, departmentNameMatch];
        connection.query(sqlQ, criteria, (error) => {
          if(error) throw error;
          //  New Role confirmation
          // =============================================================
          console.log(redToGreen(str, {
            interpolation: 'hsv',
            hsvSpin: 'long'
          }));
          console.log((`New role type added to database successfully`));
          viewAllEmployeeRoles();
        });
      });
    };
  });
};
//  Add New Employee
// =============================================================
const addEmployee = () => {
  inquirer.prompt([{
    type: "input",
    name: "firstName",
    message: "What is the new employee's first name?", // no blank names
    validate: inputFirst => {
      if(inputFirst) {
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
    validate: inputLast => {
      if(inputLast) {
        return true;
      }
      else {
        console.log("Please enter a last name for the new employee.");
        return false;
      }
    }
  }]).then(answer => {
    const criteria = [answer.firstName, answer.lastName]
    const sqlQ2 = `SELECT role.id, role.title FROM role`;
    connection.query(sqlQ2, (error, data) => {
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
        const sqlQ3 = `SELECT * FROM employee`;
        connection.query(sqlQ3, (error, data) => {
          if(error) throw error;
          const managers = data.map(({
            id,
            first_name,
            last_name
          }) => ({
            name: first_name + " " + last_name,
            value: id
          })); // list full name
          inquirer.prompt([{
            type: "list",
            name: "manager",
            message: "Who is the new employee's manager?",
            choices: managers
          }]).then(selectManager => {
            const manager = selectManager.manager;
            criteria.push(manager);
            const sqlQ4 = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
            connection.query(sqlQ4, criteria, (error) => {
              if(error) throw error;
              //  Employee Added
              // =============================================================
              console.log(redToGreen(str, {
                interpolation: 'hsv',
                hsvSpin: 'long'
              }));
              console.log("The new employee has been added to the databse successfully.");
              viewAllEmployees();
            });
          });
        });
      });
    });
  });
};
// =============================================================
// UPDATE DATABASE
// =============================================================
const updateEmployeeRole = () => {
  const sqlQ2 = `SELECT first_name, last_name, id, role_id FROM employee`;
  connection.query(sqlQ2, (error, data) => {
    if(error) throw error;
    const employees = data.map(employee => ({
      name: employee.first_name + " " + employee.last_name,
      value: employee.id
    }));
    //showing role names, changing ids, then showing updated role name would be better
    inquirer.prompt([{
      type: "list",
      name: "employeeName",
      message: "Which employee's role would you like to update?",
      choices: employees
    }, {
      type: "input",
      name: "role",
      message: "What is the employee's new role?",
    }]).then(function (response) {
      connection.query(`UPDATE employee SET role_id = ${response.role} WHERE id = ${response.employeeName}`, function (error, response) {
        viewAllEmployees();
      });
    })
  })
}
// =============================================================
// VIEW FROM DATABASE
// =============================================================
//  View Employees
// =============================================================
const viewAllEmployees = () => {
  let sqlQ = `SELECT
   employee.id, CONCAT (employee.first_name, " ", employee.last_name) AS 'Employee Name',role.title AS 'Job Title', department.department_name AS 'Department', role.salary AS 'Salary', CONCAT(manager.first_name, " " , manager.last_name) AS 'Manager' FROM employee LEFT JOIN role on employee.role_id=role.id LEFT JOIN department on role.department_id= department.id LEFT JOIN employee manager on manager.id = employee.manager_id;`; //not working
  connection.query(sqlQ, (error, response) => {
    if(error) throw error;
    console.log(``);
    console.log(redToGreen(str, {
      interpolation: 'hsv',
      hsvSpin: 'long'
    }));
    console.log("Review current Employees:");
    console.log(``);
    console.table(response);
    employeeApp();
  });
};
//  View All Departments
// =============================================================
const viewAllDepartments = () => {
  const sqlQ = `SELECT department.id as 'Department ID', department.department_name AS 'Department Name' FROM department`;
  connection.query(sqlQ, (error, response) => {
    if(error) throw error;
    // Departments Displayed
    // =============================================================
    console.log("See all Departments:");
    console.log(redToGreen(str, {
      interpolation: 'hsv',
      hsvSpin: 'long'
    }));
    console.table(response);
    employeeApp();
  });
};
//  View All Employee Roles
// =============================================================
const viewAllEmployeeRoles = () => {
  const sqlQ = `SELECT
   role.id,
   role.title AS 'Job Title',
   role.salary AS 'Salary',
   department.department_name AS 'Department'
   FROM role INNER JOIN department on role.department_id=department.id;`;
  connection.query(sqlQ, (error, response) => {
    if(error) throw error;
    // Roles displayed
    // =============================================================
    console.log("Current Employee Roles:");
    console.log(redToGreen(str, {
      interpolation: 'hsv',
      hsvSpin: 'long'
    }));
    console.table(response);
    employeeApp();
  });
}
//  View Employees By Department
// =============================================================
const viewAllEmployeesByDepartment = () => {
  const sqlQ = `SELECT employee.id, CONCAT (employee.first_name, " ", employee.last_name) AS 'Employee Name', department.department_name AS 'Department' FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY department_name`;
  connection.query(sqlQ, (error, response) => {
    if(error) throw error;
    // Employees Displayed
    // =======================================================
    console.log("See employees by Department:");
    console.log(redToGreen(str, {
      interpolation: 'hsv',
      hsvSpin: 'long'
    }));
    console.table(response);
    employeeApp();
  });
};
// View Budget by Department
// =============================================================
const viewBudgetsByDepartment = () => {
  let sqlQ = `SELECT department_id AS 'Department ID', department.department_name AS 'Department', SUM(salary) AS 'Budget' FROM role INNER JOIN department ON role.department_id = department.id GROUP BY role.department_id`;
  connection.query(sqlQ, (error, response) => {
    if(error) throw error;
    // Budgets Displayed.
    // =============================================================
    console.log(redToGreen(str, {
      interpolation: 'hsv',
      hsvSpin: 'long'
    }));
    console.table(response);
    employeeApp();
  })
}
// =============================================================
// REMOVE
// =============================================================
// Remove Employee
// =============================================================
const removeEmployee = () => {
  const sqlQ = `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;
  connection.query(sqlQ, (error, response) => {
    if(error) throw error;
    let employeeArray = [];
    response.forEach((employee) => {
      employeeArray.push(`${employee.first_name} ${employee.last_name}`);
    });
    inquirer.prompt([{
      name: 'selectedEmployee',
      type: "list",
      message: 'What employee would you like to remove from the database?',
      choices: employeeArray
    }]).then((answer) => {
      let employeeId;
      response.forEach((employee) => {
        if(answer.selectedEmployee === `${employee.first_name} ${employee.last_name}`) {
          employeeId = employee.id;
        }
      });
      const sqlQ = `DELETE FROM employee WHERE employee.id = ?`;
      connection.query(sqlQ, [employeeId], (error) => {
        if(error) throw error;
        // Employee Removed.
        // ==========================================================
        console.log(redToGreen(str, {
          interpolation: 'hsv',
          hsvSpin: 'long'
        }));
        console.log("Employee Successfully Removed");
        viewAllEmployees();
      });
    });
  });
};
// Remove Departments
// =============================================================
const removeDepartment = () => {
  const sqlQ = `SELECT department.id, department.department_name FROM department`;
  connection.query(sqlQ, (error, response) => {
    if(error) throw error;
    let departmentArray = [];
    response.forEach((department) => {
      departmentArray.push(department.department_name);
    });
    inquirer.prompt([{
      name: "selectedDepartment",
      type: "list",
      message: "What department would you like to remove from the database?",
      choices: departmentArray
    }]).then((answer) => {
      let departmentNameMatch;
      response.forEach((department) => {
        if(answer.selectedDepartment === department.department_name) {
          departmentNameMatch = department.id;
        }
      });
      const sqlQ = `DELETE FROM department WHERE department.id = ?`;
      connection.query(sqlQ, [departmentNameMatch], (error) => {
        if(error) throw error;
        // Department Removed
        // =============================================================
        console.log(redToGreen(str, {
          interpolation: 'hsv',
          hsvSpin: 'long'
        }));
        console.log("Selected Department successfully removed from database");
        viewAllDepartments();
      });
    });
  });
};
// =============================================================
// END APPLICATION USE
// =============================================================
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
  console.log("Your session has ended.");
}