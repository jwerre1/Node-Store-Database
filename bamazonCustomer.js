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
  startFunc();
});

function startFunc() {

  connection.query("SELECT * FROM `products`", function (err, results) {
    if (err) throw err;
    var table = new Table({
      head: ['ID', 'Product Name', 'Department', 'Price', 'Stock Quantity']
      , colWidths: [5, 20, 20, 10, 17]
    });

    // table is an Array, so you can `push`, `unshift`, `splice` and friends
    for (i = 0; i < results.length; i++) {
      table.push(
        [results[i].id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
      );
    }
   
    console.log("\n" + table.toString() + "\n");

    var existID = [];

    for (i = 0; i < results.length; i++) {
        existID.push(results[i].id);
    }

    inquirer.prompt([

      {
        type: "input",
        message: "What is the ID of the product you would like to buy?",
        name: "prodSelect"
        ,
        validate: function (answer) {
          if (isNaN(answer) === true) {
            return 'Please enter a number.';
          }


          else if (existID.indexOf(parseInt(answer)) === -1) {
            // console.log(existID);
            // console.log(answer);
            return "Please enter an existing ID.";
        }

          return true;
        },
      },
      {
        type: "input",
        message: "How many units would you like to buy?",
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

      if (chosenItem.stock_quantity >= parseInt(answer.prodAmount)) {
        
        var difference = chosenItem.stock_quantity - parseInt(answer.prodAmount);
        var totalCost = parseInt(answer.prodAmount) * chosenItem.price;
        var totalCostDecimal = totalCost.toFixed(2);
        var totalProductSales = parseFloat(totalCostDecimal) + parseFloat(chosenItem.product_sales);
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: difference,
              product_sales: totalProductSales
            },
            {
              id: chosenItem.id
            }
          ],
          function (error) {
            if (error) throw error;
            console.log("Order fulfilled!");
            console.log("Total Cost: " + totalCostDecimal + ".");
          }
        );
      }

      else {
        console.log("Insufficient quantity!")
      }
      connection.end();
    })
  });
}






   