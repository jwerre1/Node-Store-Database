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
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    genTable();
    startFunc();
    
    connection.end();
  });

  function genTable() {

    connection.query("SELECT * FROM `products`", function(err, results) {
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
         
        console.log(table.toString());
      });

  }

  function startFunc() {

    // connection.query("SELECT * FROM `products`", function(err, result) {
    //     if (err) throw err;

    //     var inventoryList = [];

    //     for (i = 0; i < result.length; i++) {
    //         inventoryList.push("ID: " + result[i].id + " || Name: " + result[i].product_name + " || Price: " + result[i].price)
    //     }
    //   });

    inquirer.prompt([
        {
            type: "input",
            message: "What is the ID of the product you would like to buy?",
            name: "productSelect"
        }
    ]).then(function (answer) {
        console.log(answer.productSelect);
    })
}