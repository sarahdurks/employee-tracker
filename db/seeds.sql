
-- -----------------------------------------------------
-- Table `department` Seed Data
-- -----------------------------------------------------
INSERT into department (name) VALUES 
("Engineering"),
("Product"),
("Finance"),
("Sales");
-- -----------------------------------------------------
-- Table `role` Seed Data
-- -----------------------------------------------------
INSERT into role (title, salary, department_id) 
VALUES 
("Sr.Engineer", 200000, 1),
("Engineer I", 222222, 1),
("Engineer II", 233333, 1),
("Head of Data", 212000, 2);

-- -----------------------------------------------------
-- Table `employee` Seed Data
-- -----------------------------------------------------
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES 
("Matt", "H", 10, 1),
("Derek", "C", 15, null),
("Megan", "Mell", 16, 2),
("Anna", "Zepplin", 17, 4),
("Jenny", "Block", 18, 4),
("Sarah", "D", 19, 1)


