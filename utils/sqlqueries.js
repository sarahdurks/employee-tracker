// =============================================================
// SQL QUERIES
// =============================================================

// GET
// =============================================================
getAllDepartments 
`SELECT id AS department_id, department_name FROM department ORDER BY id;`
getAllEmployees 
`SELECT employee.id AS employee_id, employee.first_name, employee.last_name, role.title AS job_title, department.dep_name AS department, role.salary, 
CONCAT (manager.first_name , ' ' , manager.last_name) AS manager_name FROM employee 
LEFT JOIN employee manager ON employee.manager_id = manager.id 
JOIN role ON employee.role_id = role.id 
JOIN department ON role.department_id = department.id
ORDER BY employee.id;`
getAllRoles 
`SELECT role.id AS role_id, title AS job_title, department.department_name AS department, salary FROM role 
JOIN department ON department_id = department.id 
ORDER by role.id;`
getEmployeesByManager 
`SELECT employee.id AS employee_id, employee.first_name,  employee.last_name, role.title AS job_title, role.salary, 
CONCAT (manager.first_name , ' ' , manager.last_name) AS manager_name   FROM employee 
LEFT JOIN employee manager ON employee.manager_id = manager.id 
JOIN role ON employee.role_id = role.idWHERE employee.manager_id =?;`,
getEmployeesByDepartment 
`SELECT * FROM department WHERE dep_name = ?;`
getByRole 
`SELECT * FROM role WHERE title = ?;`
getByEmployeeName
`SELECT * FROM employee WHERE first_name = ? AND last_name = ?;`
getByEmployeeId 
`SELECT * FROM employee WHERE id = ?;`
// ADD - align with user inputs
// =============================================================
addDepartment 
`INSERT INTO department(dep_name) VALUES(?);`
addRole 
`INSERT INTO role(title, salary, department_id)VALUES(?, ?, ?);`,
addEmployee 
`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?);`
// UPDATE
// =============================================================
updateEmployeeRole
`UPDATE employee SET role_id = ? WHERE id = ?;`
updateEmployeeManager
`UPDATE employee SET manager_id = ? WHERE id = ?;`
// DELETE
// =============================================================
deleteEmployeeById 
`DELETE FROM employee WHERE id = ?;`
deleteEmployeeByName // need a most efficient way to do this, research, concat needed
//add extra credit if time