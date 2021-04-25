
-- -----------------------------------------------------
-- SEED DATA
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Table `department` Seed Data
-- -----------------------------------------------------
INSERT INTO department (department_name) 
VALUES 
("Engineering"),
("Product"),
("Operations"),
("Sales"),
("Customer Service"),
("Marketing"),
("Editorial"),
("Creative");

-- -----------------------------------------------------
-- Table `role` Seed Data
-- -----------------------------------------------------
INSERT INTO role (title, salary, department_id) 
VALUES 
-- Engineering 
-- -----------------------------------------------------
("Sr. Engineer", 200000.00, 1),
("Engineer I", 222222.00, 1),
("Engineer II", 233333.00, 1),
-- Customer Service
-- -----------------------------------------------------
("Customer Service Associate", 222222.00, 2),
-- Sales
-- -----------------------------------------------------
("Head of Sales", 233333.00, 3),
("Sales Associate", 233333.00, 3),
-- Product
-- -----------------------------------------------------
("VP of Product", 300222.00, 4),
("Product Manager", 300222.00, 4),
-- Operations
-- -----------------------------------------------------
("Head of Finance", 165000.00, 5),
("Head of Data", 160000.00, 5),
("CEO", 500000.00, 5),
("Executive Assistant", 50000.00, 5);

-- -----------------------------------------------------
-- Table `employee` Seed Data
-- -----------------------------------------------------
INSERT into employee (first_name, last_name, role_id, manager_id) 
VALUES 
-- Employees
-- -----------------------------------------------------
("Matt", "H", 10, 1),
("Derek", "C", 15, 5),
("Megan", "M", 16, 2),
("Anna", "Z", 17, 4),
("Jenny", "B", 18, 4),
("Sarah", "D", 19, 1),
("Larry", "H", 4, 1),
("Anne", "C", 15, 5),
("Barry", "M", 16, 2),
("Justin", "Z", 4, 2),
("Matthew", "B", 18, 4),
("Meigan", "D", 19, 1),
-- Executive Team 
-- -----------------------------------------------------
("Patrick", "K", 10, NULL),
("Chad", "M", 15, NULL),
("Brian", "M", 16, NULL),
("Ari", "Z", 17, NULL),
("Melissa", "B", 18, NULL),
("Kristen", "D", 19, NULL);