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
            choices: ["View Products Sales by Department", "Create New Department"]
        }
    ]).then(function (answers) {
        if(answers.selection === "View Products Sales by Department"){
            showSalesByDepart();
        }
        else if(answers.selection === "Create New Department"){
            createDepart();
        }
    });
});

function showSalesByDepart() {
    var queryString = "select department_id, name, over_head_costs, product_sales from products LEFT JOIN departments on products.department_name = departments.name;"
    connection.query(queryString, function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        for(var i = 0; i < res.length; i++){
            var resI = res[i]
            console.log("ID: " + resI.department_id + ", Department: " + resI.name + ", Over Head Costs: " + resI.over_head_costs + ", Product Sales: " + resI.product_sales + ", Total Profit: " + (parseInt(resI.product_sales) - parseInt(resI.over_head_costs)) + "\n ---------------------------------------------------");
        };
        
      });

      connection.end();
};

function createDepart() {
    inquirer.prompt([
        {
            name: "name",
            message: "Please enter the name of department you'd like to enter: "
        },
        {
            name: "overhead",
            message: "Please enter over head costs: "
        }
    ]).then(function (answers) {
        
        connection.query("INSERT INTO departments Set ?",
            {
                name: answers.name,
                over_head_costs: answers.overhead
            }, function(err, res) {
                console.log("Departments list updated!!");
                connection.end();
        })
        
    });
}