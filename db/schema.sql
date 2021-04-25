
-- -----------------------------------------------------
-- CLEARING PAST DATA
-- -----------------------------------------------------
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS employee;


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
  id INTEGER NOT NULL AUTO_INCREMENT 
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2)
  department_id INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);

-- -----------------------------------------------------
-- Table `employee`
-- -----------------------------------------------------
CREATE TABLE employee (
  id INTEGER NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES role(id)
);
