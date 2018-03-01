var inquirer = require("inquirer");

var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "Harekrishna1",
    database: "bamazonDB"
  });

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    logValues();
});

function logValues(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        for(var i = 0; i < res.length; i++){
            var resI = res[i]
            console.log("ID: " + resI.item_id + ", Item: " + resI.product_name + ", Price: " + resI.price + "\n ---------------------------------------------------");
        };
        promptUser();
        
      });
};

function promptUser() {
    connection.query("Select * from products", function(err, res) {
         if(err) throw err;
        inquirer.prompt([
            {
                name: "id",
                message: "Please enter ID number of item you would like to buy"
            }, {
                name: "quant",
                message: "How much would you like to buy?"
            }
        ]).then(function(answers){
        
           

            var itemIndex = answers.id - 1;
            var total = res[itemIndex].price * answers.quant;
            if(res[itemIndex].stock_quantity > answers.quant){
                var stockCredit = res[itemIndex].stock_quantity - answers.quant;
                stockReset(stockCredit, answers.id);
                console.log("Total: $" + total);
            }
            else{
                console.log("Insufficient Stock!");
                promptUser();
            }
            
        });

    });
    
    connection.end();
};

function stockReset(newStock, id) {
    // console.log(newStock);
    connection.query("UPDATE products SET ? WHERE ?",
    [{
        stock_quantity: newStock
    }, {
        item_id: id
    }],
    function(err, res) {

        console.log("Stock Updated");
    });
};