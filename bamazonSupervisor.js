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
            choices: ["View Products Sales by Department", "Create New Department", "Exit"],
            name: "action"
        }
    ]).then(function (answer) {
        switch (answer.action) {
            case "View Products Sales by Department":
                prodSalesDept();
                break;

            case "Create New Department":
                createDept();
                break;

            case "Exit":
                connection.end();
        }
    })
}

function prodSalesDept() {
    var query = connection.query("SELECT departments.department_id AS department_id, departments.department_name AS department_name, departments.over_head_costs AS over_head_costs, SUM(products.product_sales) AS product_sales FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY department_id ORDER BY department_id ASC", function (err, results) {
        if (err) throw err;
        // console.log(results);

        var table = new Table({
            head: ['department_id', 'department_name', 'over_head_costs', 'product_sales', 'total_profit']
            , colWidths: [15, 17, 17, 15, 15]
        });

        // var deptIDs = [];
        // // pulls the unique department_id's
        // for (a = 0; a < results.length; a++) {
        //     if (deptIDs.indexOf(results[a].department_id) === -1) {
        //         deptIDs.push(results[a].department_id);
        //     }
        // }

        // // sorts the department_id's in ascending order
        // deptIDs.sort(function(a, b){return a - b});

        // console.log(deptIDs);

        for (i = 0; i < results.length; i++) {
            var totalProfit = results[i].product_sales - results[i].over_head_costs;
            if (results[i].product_sales === null) {
                results[i].product_sales = 0;
            }

            var totalProfitTwo = totalProfit.toFixed(2);
            table.push(
                [results[i].department_id, results[i].department_name, results[i].over_head_costs, results[i].product_sales, totalProfitTwo]
            );
        }

        console.log("\n" + table.toString() + "\n");
        begin();
    });
    // console.log(query.sql);

}

function createDept() {
    connection.query("SELECT department_id, department_name FROM departments", function (err, results) {
        if (err) throw err;
        // console.log(results);
        var existID = [];
        var existName = [];

        for (i = 0; i < results.length; i++) {
            existID.push(results[i].department_id);
        }

        for (i = 0; i < results.length; i++) {
            existName.push(results[i].department_name);
        }
        // console.log(existID);

        inquirer.prompt([

            {
                type: "input",
                message: "What is the ID of the product you would like to add more to?",
                name: "newID"
                ,
                validate: function (answer) {
                    if (isNaN(answer) === true) {
                        return "Please enter a number.";
                    }
              
                    else if (existID.indexOf(parseInt(answer)) !== -1) {
                        // console.log(existID);
                        // console.log(answer);
                        return "Please enter a unique ID.";
                    }
                    return true;
                },
            },
            {
                type: "input",
                message: "What is the department name?",
                name: "name",
                validate: function (answer) {

                   if (existName.indexOf(answer) !== -1) {
                        // console.log(existID);
                        // console.log(answer);
                        return "Please enter a unique department name.";
                    }
                    return true;
                },
            },
            {
                type: "input",
                message: "What are the over head costs?",
                name: "cost",

                validate: function (answer) {
                    if (isNaN(answer) === true) {
                        return 'Please enter a number.';
                    }

                    return true;
                }
            }

        ]).then(function (answer) {
            var cost = parseFloat(answer.cost);
            var costTwoInt = parseFloat(cost.toFixed(2));
            var submitID = parseInt(answer.newID);
            var query = connection.query(
                "INSERT INTO departments (department_id, department_name, over_head_costs) VALUES (?)",
                [
                    [
                    submitID, answer.name, costTwoInt
                    ]
                ],
                function (error) {
                    // console.log(query.sql);
                    if (error) throw error;
                    console.log("\n" + answer.name + " added to the department list.\n");
                    begin();
                }
            );

        })
    });    
}