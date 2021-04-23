DROP DATABASE IF EXISTS db;
CREATE database db;
USE db;


-- -----------------------------------------------------
-- Table `department`
-- -----------------------------------------------------
CREATE TABLE department (
  id INTEGER NOT NULL IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(30)
);


-- -----------------------------------------------------
-- Table `role`
-- -----------------------------------------------------
CREATE TABLE role (
  id INTEGER NOT NULL IDENTITY(1,1) PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INTEGER,
  FOREIGN KEY (department_id) REFERENCES department(id)
);


-- -----------------------------------------------------
-- Table `employee`
-- -----------------------------------------------------
CREATE TABLE employee (
  id INTEGER NOT NULL IDENTITY(1,1) PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INTEGER,
  manager_id INTEGER,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES role(id)
);
