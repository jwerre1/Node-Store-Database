function prompt() {
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

          return true;
        }
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
      console.log("worked");
      var chosenItem;
      for (j = 0; j < results.length; j++) {
        if (results[j].id === parseInt(answer.prodSelect)) {
          chosenItem = results[j];
        }
      }

      console.log(chosenItem);

      if (chosenItem.stock_quantity >= parseInt(answer.prodAmount)) {
        console.log("working - ENOUGH");
        var difference = chosenItem.stock_quantity - parseInt(answer.prodAmount);
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: difference
            },
            {
              id: chosenItem.id
            }
          ],
          function (error) {
            if (error) throw error;
            console.log("Bid placed successfully!");
            // start();
          }
        );
      }

      else {
        console.log("working - not enough")
      }
      // connection.end();
    })
  }