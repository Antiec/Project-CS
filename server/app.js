var express = require('express');
var app = express();

var mysql = require('mysql')
var connection = mysql.createConnection({
    host     : 'project-cs-db.cvlu01f9qd7k.eu-central-1.rds.amazonaws.com',
    user     : 'Antiec',
    password : '#Project!CS15',
    database : 'projectCS'
})

connection.connect()
app.get('/', function(req, res){
    console.log('Request to /')
    connection.query('SELECT * FROM shops WHERE shop_id=1', function (err, rows, fields) {
        if (err) throw err
        const queryResult = `Shop_id: ${rows[0].shop_id}<br>
                  Shop_name: ${rows[0].shop_name}<br>
                  Shop_speciality: ${rows[0].shop_speciality}<br>`
        console.log(queryResult)
        res.send(queryResult)
    })

})

app.listen(3000)
console.log('Server listening at port 3000')
//connection.end()