
const apiWhatss = require('./Servicios/apiWhatsapp/apiWhatsapp');
var express = require('express');
//const config = require('config');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 3000;

//app.set('port', process.env.PORT || 3525);

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.status(200).send({
        message: '/La API está siendo ejecutada y los servicios están activos!'
    });
});

app.listen(port, function () {
    console.log(`Server running in http://localhost:${port}`);
    console.log('Defined routes:');
    console.log(`[GET] http://localhost:${port}/`);
    console.log(`[GET] http://177.73.102.10:${port}/`);
    //console.log("Ejecutando proceso de envío de mensajes");
    const rutas = require('./rutas/consultaDinamica')(app);
    //apiWhatss.apiWhatss(); Para cuando se programe envío de mensajes por Whatsapp

});