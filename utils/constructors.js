
// =============================================================
// CONSTRUCTOR CLASSES
// =============================================================

// =============================================================
// Department
// =============================================================

class Department {
    constructor (department_id, department_name){
        this.department_id = department_id;
        this.department_name = department_name;
    }
}
// =============================================================
// Employee
// =============================================================
class Employee {
    constructor (employee_id, first_name, last_name, job_title, salary, department, manager_name){
    this.employee_id =  employee_id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.job_title = job_title;
    this.salary = salary;
    this.department = department;
    this.manager_name = manager_name;
}
}
// =============================================================
// Role
// =============================================================
class Role {
    constructor (role_id, job_title, department, salary){
        this.role_id = role_id;
        this.job_title = job_title;
        this.department = department;
        this.salary = salary;
    }
}

module.exports = { Department, Employee, Role };