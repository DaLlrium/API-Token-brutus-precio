const express = require('express');
const bodyParser = require("body-parser");
const moment = require('moment-timezone');
const fetch = require('node-fetch');

const delay = ms => new Promise(res => setTimeout(res, ms));

const app = express();
const port = process.env.PORT || 3004;


app.get('/api/v1',async(req,res) => {

    res.send("Conectado y funcionando v1.0");
});

app.get('/api/v1/precio/:moneda',async(req,res) => {

    let moneda = req.params.moneda;

    let consulta = await fetch('https://spreadsheets.google.com/feeds/cells/1syF1VTlhrc64a3RkZiMLjvVZqb39qij7UBpoX1bbLvk/1/public/values?alt=json')
    .catch(error =>{console.error(error)})
  	const json = await consulta.json();

  	//console.log(json);

  	let precio = parseFloat(json.feed.entry[1].gs$cell.numericValue);

  	var response = {};

	if (moneda == "BRUT" || moneda == "brut" || moneda == "brut_usd" || moneda == "BRUT_USD") {
		response = {
				"Ok": true,
		    	"Message": "",
		    	"Data": {
		    		"precio": precio,
		    		"par": "BRUT_USD"
				}
		}
	    res.send(response);

	}else{

		response = {
				"Ok": false,
		    	"Message": "No exciste o está mal escrito verifica que tu token si esté listado",
		    	"Data": {}
		}
	    res.send(response);

	}
});


app.listen(port, ()=> console.log('Escuchando Puerto: ' + port))
