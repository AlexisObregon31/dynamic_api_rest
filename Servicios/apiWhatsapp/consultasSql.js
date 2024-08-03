const odbc = require("odbc");

const conectConfigUtilidades = {
  connectionString: "DSN=utilidades", //;UID=;PWD=',
  connectionTimeout: 60,
  loginTimeout: 60,
};
    //Hacer 3 funciones separadas para cada empresa para obtener los datos
    //Caso sea el mismo mensaje y misma estructura se puede con uno solo al igual que CDE
 async function obtenerDatos(){
    try {
        conectarBDFirebird = await odbc.connect(conectConfigUtilidades);
        console.log("\n Conexión exitosa a la base de datos utilidades");
        arrayDatos = await conectarBDFirebird.query("SELECT * FROM CAD_BANCOS");
        console.log("\n Se ejecutó con éxito la consulta SQL");
        console.log(arrayDatos);
      } catch (error) {
        console.log("Error en la conexión con la BD Utilidades: " + error);
      }
 }

 module.exports = {
    obtenerDatos
 }
