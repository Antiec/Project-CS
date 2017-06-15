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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/search', function(req, res){
    console.log('Request to /search', req.query.query)
    console.log(`SELECT * FROM shops WHERE shop_name LIKE '%${req.query.query}%'`)
    connection.query(`SELECT * FROM shops WHERE shop_name LIKE '%${req.query.query}%'`, function (err, rows, fields) {
        if (err) {
            console.log('errrrrr')
            res.status(404)
            res.send( err.message )
        }else if( rows.length > 0 ){
            console.log('result:', rows)
            const queryResult = `Shop_id: ${rows[0].shop_id}<br>
                  Shop_name: ${rows[0].shop_name}<br>
                  Shop_speciality: ${rows[0].shop_speciality}<br>`
            console.log(rows)
            res.send(rows)
        }else {
            res.status(404)
            res.send('no results')
        }
    })

})

app.listen(3000)
console.log('Server listening at port 3000')
//connection.end()