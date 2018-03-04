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
    inquirer.prompt([
        {
            name: "selection",
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(function (answers) {
        if(answers.selection === "View Products for Sale"){
            showForSale();
        }
        else if(answers.selection === "View Low Inventory"){
            viewLow();
        }
        else if(answers.selection === "Add to Inventory"){
            addInventory();
        }
        else if(answers.selection === "Add New Product"){
            addProduct();
        }
    });
});

// 

function showForSale() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        for(var i = 0; i < res.length; i++){
            var resI = res[i]
            console.log("ID: " + resI.item_id + ", Item: " + resI.product_name + ", Price: " + resI.price + "\n ---------------------------------------------------");
        };
        
      });

      connection.end();
};

function viewLow() {
    connection.query("SELECT * FROM products", function(err,res) {
        if(err) throw err;
        console.log("Low Quantity Items: ");
        for(var i = 0; i < res.length; i++){
            var resI = res[i]
            if(resI.stock_quantity < 5){
                
                console.log(resI);
            }
        }
    });

    connection.end();
};

function addInventory() {
    connection.query("Select * from products", function(err, res) {
        if(err) throw err;
        inquirer.prompt([
            {
                name: "id",
                message: "Please enter id of item you'd like to update: "
            },
            {
                name: "quant",
                message: "Please enter the amount to be stocked: "
            }
        ]).then(function (answers) {
            
            var itemIndex = answers.id - 1;
            var newStock = parseInt(res[itemIndex].stock_quantity) + parseInt(answers.quant);
            updateFunc(newStock, answers.id);
            
        })
    
    })

};


function updateFunc(stock, id) {
    connection.query("UPDATE products SET ? WHERE ?", 
        [{
            stock_quantity: stock
        }, {
            item_id: id
        }], function(err,res) {
            // console.log(res);
            console.log("Stock Updated....");
            connection.end(); 
        });
};

function addProduct() {
    inquirer.prompt([
        {
            name: "name",
            message: "Please enter the name of product you'd like to enter: "
        },
        {
            type: "list",
            name: "department",
            message: "Please select department for new product: ",
            choices: ["Jewelry & Accesories", "Home & Kitchen", "Musical Instruments", "Tools & Hardware", "Cell Phones", "Beauty and Health"]
        },
        {
            name: "price",
            message: "Please enter price: "
        },
        {
            name: "quant",
            message: "Please enter quantity to be stocked: "
        }
    ]).then(function (answers) {
        
        connection.query("INSERT INTO products Set ?",
            {
                product_name: answers.name,
                department_name: answers.department,
                price: answers.price,
                stock_quantity: answers.quant
            }, function(err, res) {
                console.log("Items list updated!!");
                connection.end();
        })
        
    });

    
};