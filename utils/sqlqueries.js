// =============================================================
// SQL QUERIES
// =============================================================
addDepartment:
getAllDepartments:
getEmployeesByDepartment:

getAllEmployees:
getByEmployeeName:
getByEmployeeId: 
getEmployeesByManager:
addEmployee:
updateEmployeeRole:
updateEmployeeManager:
deleteEmployeeById:

getAllRoles:
getByRole:
addRole:

// =============================================================
module.exports = {
// Department JS Queries
// =============================================================
getAllDepartments:
`SELECT id AS department_id, 
department_name FROM department 
ORDER BY id;`,

addDepartment:
`INSERT INTO department(dep_name) 
VALUES(?);`,

getEmployeesByDepartment:
`SELECT * FROM department 
WHERE dep_name = ?;`,


// =============================================================
// Employee JS Queries
// =============================================================
getAllEmployees:
`SELECT employee.id AS employee_id, 
employee.first_name, 
employee.last_name, 
role.title AS job_title, 
department.dep_name AS department, 
role.salary, 
CONCAT (manager.first_name , ' ' , manager.last_name) 
AS manager_name FROM employee 
LEFT JOIN employee manager 
ON employee.manager_id = manager.id 
JOIN role 
ON employee.role_id = role.id 
JOIN department 
ON role.department_id = department.id
ORDER BY employee.id;`,

getEmployeesByManager:
`SELECT employee.id AS employee_id, 
employee.first_name,  
employee.last_name, 
role.title AS job_title, 
role.salary, 
CONCAT (manager.first_name , ' ' , manager.last_name) 
AS manager_name   FROM employee 
LEFT JOIN employee manager 
ON employee.manager_id = manager.id 
JOIN role ON employee.role_id = role.id 
WHERE employee.manager_id =?;`,

getByEmployeeName:
`SELECT * FROM employee 
WHERE first_name = ? 
AND last_name = ?;`,

getByEmployeeId: 
`SELECT * FROM employee 
WHERE id = ?;`,

addEmployee:
`INSERT INTO employee(first_name, last_name, role_id, manager_id) 
VALUES(?, ?, ?, ?);`,
updateEmployeeRole:
`UPDATE employee SET role_id = ?
 WHERE id = ?;`,
updateEmployeeManager:
`UPDATE employee SET manager_id = ? 
WHERE id = ?;`,
deleteEmployeeById:
`DELETE FROM employee 
WHERE id = ?;`,

// =============================================================
// Roles JS Queries
// =============================================================
getAllRoles:
`SELECT role.id AS role_id, 
title AS job_title, 
department.department_name AS department, 
salary FROM role 
JOIN department ON department_id = department.id 
ORDER by role.id;`,

getByRole:
`SELECT * FROM role 
WHERE title = ?;`,

addRole:
`INSERT INTO role(title, salary, department_id) 
VALUES(?, ?, ?);`

};

