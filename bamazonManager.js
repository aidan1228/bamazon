var inquirer = require("inquirer");

var mysql = require("mysql");

inquirer.prompt([
    {
        name: "selection",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }
]).then(function (answers) {
    
})