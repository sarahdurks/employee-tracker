# employee-tracker

![Frame 62](https://user-images.githubusercontent.com/77648727/114948310-9792c180-9e03-11eb-9af7-3f7bf901ae05.png)


# Name

## SQL Employee Tracker
A command line application to manage a company's employee database, using Node.js, Inquirer, and MySQL2.

#### Built With 🧰
- Node.js
- Inquirer
- MySQL2
- Console.table


### Work Completed
A database was created allowing company users to view and modify information about their workforce, covering salary, departments, role types and more.
#### Visual
![12-sql-homework-demo-01](https://user-images.githubusercontent.com/77648727/114947233-982a5880-9e01-11eb-8c56-f3de32b7bfaf.gif)



   
#### User Story 📖

> AS A business owner     
> I WANT to be able to view and manage the departments, roles, and employees in my company     
> SO THAT I can organize and plan my business     

#### Acceptance Criteria ✅
> GIVEN a command-line application that accepts user input     
> WHEN I start the application     
> THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role     
> WHEN I choose to view all departments     
> THEN I am presented with a formatted table showing department names and department ids     
> WHEN I choose to view all roles     
> THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role     
> WHEN I choose to view all employees     
> THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to     
> WHEN I choose to add a department     
> THEN I am prompted to enter the name of the department and that department is added to the database     
> WHEN I choose to add a role     
> THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database     
> WHEN I choose to add an employee     
> THEN I am prompted to enter the employee’s first name, last name, role, and manager and that employee is added to the database     
> WHEN I choose to update an employee role     
> THEN I am prompted to select an employee to update and their new role and this information is updated in the database      

## Acknowledgement, & Resources 🤝

#### Information and Resources Used

- [Console Table NPM](https://www.npmjs.com/package/console.table)
- [NPM mySQL](https://www.npmjs.com/package/mysql)