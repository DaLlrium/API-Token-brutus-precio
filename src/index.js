const express = require('express');
const bodyParser = require("body-parser");
const moment = require('moment-timezone');
const fetch = require('node-fetch');

const TronWeb = require('tronweb');

const delay = ms => new Promise(res => setTimeout(res, ms));

const app = express();
const port = process.env.PORT || 3004;
const PEKEY = process.env.APP_PRIVATEKEY;
const API = process.env.APP_GOOGLE_API;

const TRONGRID_API = "https://api.trongrid.io";
const addressContract = "TBRVNF2YCJYGREKuPKaP7jYYP9R1jvVQeq";

tronWeb = new TronWeb(
	TRONGRID_API,
	TRONGRID_API,
	TRONGRID_API,
	PEKEY
);



app.get('/api/v1',async(req,res) => {

    res.send("Conectado y funcionando v1.0");
});


app.get('/api/v1/precio/:moneda',async(req,res) => {

    let moneda = "SITE";

    let consulta = await fetch(API)
    .catch(error =>{console.error(error)})
  	const json = await consulta.json();

  	console.log(json);

  	let precio = json.values[0];
	precio = parseFloat(precio[1]);
	console.log(precio);

  	var response = {};

	let contract = await tronWeb.contract().at(addressContract);
	let RATE = await contract.RATE().call();
	RATE = parseInt(RATE._hex);

	if(RATE != precio*10**6){
		await contract.ChangeRate(precio*10**6).send();
	}

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
