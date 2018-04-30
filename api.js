const express = require('express');
const router = express.Router();
var mysql = require('mysql'); // Mysql include
var connection = mysql.createConnection({ // Mysql Connection
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'camaron',
});
// declare axios for making http requests
const axios = require('axios');
const API = 'https://jsonplaceholder.typicode.com';

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('');
});
    var data = {
  		"error":1,
  		"Temperaturas":""
  	};
// Get all posts
router.post('/temperatura',function(req,res){
    var temp = req.body.temp;
    var d = new Date();
    console.log(typeof(temp));
    var date = (""+d.getFullYear() + "-"+(d.getMonth()+1) + "-"+d.getDate());
    var hour = (""+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
    var data = {
  		"error":1,
  		"Registro":""
  	};
    if(!!temp){
        connection.query("INSERT INTO temperatura VALUES(null,?,?,?,1)",[date,hour,temp],function(err, rows, fields){
            if(!!err){
              console.log("Error");
              	data["Registro"] = err;

            }else{

              console.log("Exitoso");
              data["error"] = 0;
              data["Registro"] = "Registro agegado";

            }
            res.json(data);
        });
    }else{
      console.log("Error Data");
      	data["Registro"] = "Error de ingreso de datos, verificar estructura JSON";

        res.json(data);
    }
});
router.get('/getestanque', (req, res) => {  

        connection.query("SELECT * FROM temperatura ORDER BY idTemperatura DESC LIMIT 10",//[user,pass],
        function(err, rows, fields){
            if(!!err){
              console.log("no existe");
              data["error"] = 1;
              console.log(err);

            }else{

                if(rows.length)
                {
            console.log("existe");
              data["error"] = 0;
        
              data["Temperaturas"] = rows;
               res.json(rows);
                }else{
                    console.log("no existe");
                    console.log("here")
              data["error"] = 1;
         
               res.json(data);
                }
            }
          //     
        });
});
router.get('/estanques', (req, res) => {
    var estanqueid = req.body.estanqueid;
        connection.query("SELECT * FROM estanque",//[user,pass],
        function(err, rows, fields){
            if(!!err){
              console.log("no existe");
              data["error"] = 1;
              console.log(err);

            }else{

                if(rows.length)
                {
            console.log(rows);
              data["error"] = 0;
        
              data["estanques"] = rows;
               res.json(rows);
                }else{
                    console.log("no existe");
                    console.log("here")
              data["error"] = 1;
         
               res.json(data);
                }
            }
          //     
        });
});
module.exports = router;