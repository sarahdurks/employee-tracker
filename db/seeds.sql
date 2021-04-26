
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
("Matt", "Hanner", 1, 6),
("Derek", "Cool", 2, 5),
("Megan", "Milli", 3, 2),
("Anna", "Zanzy", 4, 8),
("Jenny", "Banner", 4, 8),
("Sarah", "Donner", 4, 1),
("Larry", "Hax", 6, 12),
("Anne", "Cow", 7, 12),
("Barry", "Moon", 7, 10),
("Justin", "Zoo", 4, 10),
("Matthew", "Bae", 4, 11),
("Meigan", "Dee", 12, 11),
-- Executive Team 
-- -----------------------------------------------------
("Patrick", "Keene", 11, NULL),
("Chad", "Millman", 10, NULL),
("Ari", "Zan", 12, NULL),
("Melissa", "Boon", 8, NULL),
("Kristen", "Danner", 8, NULL);