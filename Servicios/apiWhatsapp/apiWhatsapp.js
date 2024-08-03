let apiWhatss = function () {
  const consultaSql = require("./consultasSql");
  codLocation = "@c.us";
  const alexis = "595982823930" + codLocation;
  const jose = "554599119758" + codLocation;
  const alan = "595975640900" + codLocation;
  const marcelo = "554599544243" + codLocation;
  const miguel = "595985444884" + codLocation;
  const junior = "554599766382" + codLocation;
  const sandro = "595974812000" + codLocation;
  const derlis = "595981265810" + codLocation;
  const fabiana = "595974599258" + codLocation;

  var msg;
  const qrcode = require("qrcode-terminal");
  var fecha = new Date();
  var msgDiario, msgMensual;
  var datos = {};
  var horaActual = fecha.getHours();
  var minutoActual = fecha.getMinutes();
  var sw = 1;
  var diaActual = fecha.getDay();

  const iconAsu = ":*  🌆";
  const iconEncar = ":*  🏖️";

  var swVeri = 0;
  var swError = 0;
  //var fecha = new Date();
  var hoy = fecha.toLocaleDateString();
  var mes = fecha.getMonth() + 1;
  var año = fecha.getFullYear();
  var fechaInicialMes = "01/0" + mes + "/" + año;
  let iniciar;
  var msgDiarioAsu;
  var msgDiarioEncar;
  var msgMensuAsu;
  var msgMensuEncar;
  var ejecutarIntervalo;

  var icono;

  const { Client, LocalAuth } = require("whatsapp-web.js");

  const client = new Client({
    authStrategy: new LocalAuth(),
  });

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    try {
      console.log("\n El dia actual es: " + diaActual);

      console.log("El cliente está listo");
      traerDatos();
      //verificarHorario(); habilitar una vez se configure todo para enviar mensajes
    } catch (error) {
      console.log(error);
    }
  });

  function volverAVerificar(res) {
    if (res == "noCumple") {
      setTimeout(verificarHorario, 110000);
    }
  }

  client.initialize();

  function verificarHorario() {
    fecha = new Date();
    //console.log("\n Verificando horario para la ejecución. \n");

    //if (fecha.getDay() == 6 && fecha.getHours() > 7 && fecha.getHours() < 12)

    if ( fecha.getHours() >= 8 && fecha.getMinutes() > 29 && fecha.getHours() < 18 && fecha.getDay() != 0 ) {
      swVeri = 0;
      traerDatos();
    } else {
      if (swVeri == 0) {
        console.log(
          "\n La hora actual no corresponde al rango de 08:30 hs a 18:30 hs o el día actual es Domingo"
        );
        swVeri = 1;
      }
      volverAVerificar("noCumple");
    }
  }

  function repetirCadaUnaHora() {
    swVeri = 0;
    console.log(
      "Ejecutando proceso de retardo por 1 hora hasta volver a ejecutar el proceso"
    );
    setTimeout(traerDatos, 3600000);
  }

  async function traerDatos() {
    consultaSql.obtenerDatos();
  }
};

module.exports = { apiWhatss };
