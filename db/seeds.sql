
-- -----------------------------------------------------
-- SEED DATA
-- -----------------------------------------------------
USE employee_database;
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
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES 
-- Employees
-- -----------------------------------------------------
("Matt", "Hanner", 10, 1),
("Derek", "Cool", 15, 5),
("Megan", "Milli", 16, 2),
("Anna", "Zanzy", 17, 4),
("Jenny", "Banner", 18, 4),
("Sarah", "Donner", 19, 1),
("Larry", "Hax", 4, 1),
("Anne", "Cow", 15, 5),
("Barry", "Moon", 16, 2),
("Justin", "Zoo", 4, 2),
("Matthew", "Bae", 18, 4),
("Meigan", "Dee", 19, 1),
-- Executive Team 
-- -----------------------------------------------------
("Patrick", "Keene", 10, NULL),
("Chad", "Millman", 15, NULL),
("Brian", "Maxon", 16, NULL),
("Ari", "Zan", 17, NULL),
("Melissa", "Boon", 18, NULL),
("Kristen", "Danner", 19, NULL);