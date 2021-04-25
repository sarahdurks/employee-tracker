
-- -----------------------------------------------------
-- CLEARING PAST DATA
-- -----------------------------------------------------
DROP DATABASE IF EXISTS employee_database;
CREATE DATABASE employee_database;
USE employee_database;

-- -----------------------------------------------------
-- Table `department`
-- -----------------------------------------------------
CREATE TABLE department (
  id INTEGER NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

-- -----------------------------------------------------
-- Table `role`
-- -----------------------------------------------------
CREATE TABLE role (
  id INTEGER NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);

-- -----------------------------------------------------
-- Table `employee`
-- -----------------------------------------------------
CREATE TABLE employee (
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER DEFAULT NULL,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES role(id)
);