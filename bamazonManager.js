var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');


var connection = mysql.createConnection({
    host: "localhost",

    port: 8889,

    user: "root",

    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
    begin();
});

function begin() {
    inquirer.prompt([
        {
            type: "list",
            message: "Main Menu:",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
            name: "action"
        }
    ]).then(function (answer) {
        switch (answer.action) {
            case "View Products for Sale":
                prodSale();
                break;

            case "View Low Inventory":
                inventLow();
                break;

            case "Add to Inventory":
                inventAdd();
                break;

            case "Add New Product":
                prodAdd();
                break;

            case "Exit":
                connection.end();
        }
    })
}

function prodSale() {
    connection.query("SELECT * FROM `products`", function (err, results) {
        if (err) throw err;
        var table = new Table({
            head: ['ID', 'Product Name', 'Department', 'Price', 'Stock Quantity']
            , colWidths: [5, 20, 20, 10, 17]
        });

        for (i = 0; i < results.length; i++) {
            table.push(
                [results[i].id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
            );
        }

        console.log("\n" + table.toString() + "\n");
        begin();
    });

}


function inventLow() {
    connection.query("SELECT * FROM `products` where `stock_quantity` < 5", function (err, results) {
        if (err) throw err;
        var table = new Table({
            head: ['ID', 'Product Name', 'Department', 'Price', 'Stock Quantity']
            , colWidths: [5, 20, 20, 10, 17]
        });

        for (i = 0; i < results.length; i++) {
            table.push(
                [results[i].id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
            );
        }

        console.log("\n" + table.toString() + "\n");
        begin();
    });
}

function inventAdd() {

    connection.query("SELECT * FROM `products`", function (err, results) {
        if (err) throw err;
        var table = new Table({
            head: ['ID', 'Product Name', 'Department', 'Price', 'Stock Quantity']
            , colWidths: [5, 20, 15, 10, 17]
        });

        // table is an Array, so you can `push`, `unshift`, `splice` and friends
        for (i = 0; i < results.length; i++) {
            table.push(
                [results[i].id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
            );
        }

        console.log("\n" + table.toString() + "\n");

        inquirer.prompt([

            {
                type: "input",
                message: "What is the ID of the product you would like to add more to?",
                name: "prodSelect"
                ,
                validate: function (answer) {
                    if (isNaN(answer) === true) {
                        return 'Please enter a number.';
                    }

                    return true;
                },
            },
            {
                type: "input",
                message: "How many units would you like to add?",
                name: "prodAmount",

                validate: function (answer) {
                    if (isNaN(answer) === true) {
                        return 'Please enter a number.';
                    }

                    return true;
                }
            }

        ]).then(function (answer) {
            // console.log("worked");
            var chosenItem;
            for (j = 0; j < results.length; j++) {
                if (results[j].id === parseInt(answer.prodSelect)) {
                    chosenItem = results[j];
                }
            }

            // console.log(chosenItem);

            var additional = chosenItem.stock_quantity + parseInt(answer.prodAmount);
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: additional
                    },
                    {
                        id: chosenItem.id
                    }
                ],
                function (error) {
                    if (error) throw error;
                    console.log("\n" + answer.prodAmount + " " + chosenItem.product_name + " units added.\n");
                    begin();
                }
            );
        })
    });
}

function prodAdd() {
    connection.query("SELECT `id` FROM `products`", function (err, results) {
        if (err) throw err;
        // console.log(results);
        var existID = [];

        for (i = 0; i < results.length; i++) {
            existID.push(results[i].id);
        }
        // console.log(existID);

        inquirer.prompt([

            {
                type: "input",
                message: "What is the ID of the product you would like to add more to?",
                name: "newID"
                ,
                validate: function (answer) {
                    if (existID.indexOf(parseInt(answer)) !== -1) {
                        console.log(existID);
                        console.log(answer);
                        return 'Please enter a unique.';
                    }
                    return true;
                },
            },
            {
                type: "input",
                message: "What is the product name?",
                name: "name"
            },
            {
                type: "input",
                message: "What is the product department?",
                name: "department"
            },
            {
                type: "input",
                message: "What is the product price?",
                name: "price",

                validate: function (answer) {
                    if (isNaN(answer) === true) {
                        return 'Please enter a number.';
                    }

                    return true;
                }
            },
            {
                type: "input",
                message: "How many units would you like to add?",
                name: "amount",

                validate: function (answer) {
                    if (isNaN(answer) === true) {
                        return 'Please enter a number.';
                    }

                    return true;
                }
            }

        ]).then(function (answer) {
            var price = parseFloat(answer.price);
            var priceTwoInt = parseFloat(price.toFixed(2));
            var submitID = parseInt(answer.newID);
            var submitAmount = parseInt(answer.amount);
            var query = connection.query(
                "INSERT INTO products (id, product_name, department_name, price, stock_quantity) VALUES (?)",
                [
                    [
                    submitID, answer.name, answer.department, priceTwoInt, submitAmount
                    ]
                ],
                function (error) {
                    // console.log(query.sql);
                    if (error) throw error;
                    console.log("\n" + answer.name + " added to the inventory.\n");
                    begin();
                }
            );

        })
    });    
}

