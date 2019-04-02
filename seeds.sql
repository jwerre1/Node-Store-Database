INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bananas", "Grocery", 0.54, 1000),
("Cold Medicine", "Pharmacy", 5.00, 50),
("Alligator", "Pet", 200.00, 2),
("Diet Coke", "Grocery", 1.00, 100),
("Cat", "Pet", 89.99, 10),
("Multi-Vitamin", "Pharmacy", 10.50, 20),
("Pens", "Office Supplies", 1.49, 70),
("Ostrich", "Pet", 2999.99, 12),
("Frozen Pizza", "Grocery", 6.99, 80),
("Computer", "Office Supplies", 1000.00, 15);


SELECT * FROM products;

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Grocery", 10000),
("Luxury", 75000),
("Office Supplies", 20000),
("Pet", 15000),
("Pharmacy", 35000);