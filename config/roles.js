
 // Dependencies
// =============================================================
const { Role } = require("../utils/constructors");

const consoleTable = require("console.table");
const databasePool = require('../utils/connect');
const sql = require("../utils/sqlqueries");


 // Get list of roles
// =============================================================
async function getRoleList() {
    try {
        let roleQuery = await databasePool.query(sql.getAllEmployeeRoles);
        let roles = [];
        let data = roleQuery[0];
        for (row in data) {
            roles.push(`${data[row].role_id} ${data[row].job_title}`);
        }
        return roles;
    } catch (err) {
        console.log(err);
    }
};


// Get role data
// =============================================================
const getRoles = async () => {
    try {
        let roleQuery = await databasePool.query(sql.getAllEmployeeRoles);
        let roleList = [];
        let data = roleQuery[0];
        for (row in data) {
            roleList.push(new Role(data[row].role_id, data[row].job_title, data[row].department, data[row].salary));
        }
        console.table(roleList);
    } catch (err) {
        console.error(`Error in executing Query ${err}`);
    }
};
 // Query Employee Roles
// =============================================================
const queryRoles = async response => {
    try {
        let queryRole = await databasePool.query(sql.getByRoleTitle, response);
        if (queryRole[0].length <= 0) {
            console.log(`There are no records to display for this role.`);
        } else {
            console.log(`New role added successfully`);
            console.table(queryRole[0]);
        }
    }
    catch (err) {
        console.error(`There was a problem in performing role query: ${err}`);
    }
};


 // Add Employee Role
// =============================================================
const addRole = async response => {
    let department_id = parseInt(response.department_name.split(' ')[0]);
    try {
        await databasePool.query(sql.addRole, [response.title, response.salary, department_id]);
    }
    catch (err) {
        console.error(`Unable to add role. Error type: ${err}`);
    }
    return response.title;
};

// Export department functions 
// ============================================================
//module.exports = { getRoleList, getRoles, queryRoles, addRole }
