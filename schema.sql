DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  id INTEGER(10) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  department_name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  stock_quantity INTEGER(10) DEFAULT 0,
  PRIMARY KEY(id)
);

CREATE TABLE departments (
  department_id INTEGER(10) AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(255) NOT NULL,
  over_head_costs DECIMAL(10,2) DEFAULT 0,
  PRIMARY KEY(department_id)
);

ALTER TABLE products
ADD product_sales DECIMAL(10,2) DEFAULT 0;