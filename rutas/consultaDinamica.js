module.exports = (app) => {
  var { attach } = require("node-firebird");
  const { json } = require("body-parser");
  var express = require("express");
  const { exec } = require("child_process");
  const axios = require("axios");
  const odbc = require("odbc");
  let arrayDatos = [];

  let conectarBDFirebird;
  var bdUtilidades = undefined;
  var bdTransportes = undefined;
  var bdBratacarejo = undefined;
  var bdPanelart = undefined;
  var bdBrutilidades = undefined;

  const conectConfigPrueba = {
    connectionString: "DSN=prueba", //;UID=;PWD=',
    connectionTimeout: 60,
    loginTimeout: 60,
  };

  const conectConfigUtilidades = {
    connectionString: "DSN=utilidades", //;UID=;PWD=',
    connectionTimeout: 60,
    loginTimeout: 60,
  };

  const conectConfigTransportes = {
    connectionString: "DSN=transportes", //;UID=;PWD=',
    connectionTimeout: 60,
    loginTimeout: 60,
  };

  const conectConfigBratacarejo = {
    connectionString: "DSN=bratacarejo", //;UID=;PWD=',
    connectionTimeout: 60,
    loginTimeout: 60,
  };

  const conectConfigPanelart = {
    connectionString: "DSN=panelart", //;UID=;PWD=',
    connectionTimeout: 60,
    loginTimeout: 60,
  };

  const conectConfigBrutilidades = {
    connectionString: "DSN=brutilidades", //;UID=;PWD=',
    connectionTimeout: 60,
    loginTimeout: 60,
  };

  //Funciones específicas----------------------------------------------------------------

  //Función que toma un String Cuerpo, recibe una palabra y la reemplaza por otra
  function findAllReplace(str, palabraBuscar, palabraReemplazar) {
    const regex = new RegExp("(?<!\\()\\b" + palabraBuscar + "\\b", "g");
    const resultado = str.replace(regex, palabraReemplazar);
    return resultado;
  }

  //-------------------------------------------------------------------------------------
  /*
    async function conectarABasesDeDatos(db_name) {
      //Puede ser todos, o el nombre específico de una base
      console.log("Conectando a las bases de datos...");
      if (db_name == "todos" || db_name == "utilidades") {
        try {
          bdUtilidades = await odbc.connect(conectConfigUtilidades);
          console.log("\n Conexión exitosa a la base de datos Utilidades");
        } catch (error) {
          console.log(
            "Error en la conexión a la base de datos Utilidades" + error
          );
        }
      }
  
      if (db_name == "todos" || db_name == "transportes") {
        try {
          bdTransportes = await odbc.connect(conectConfigTransportes);
          console.log("Conexión exitosa a la Base de Datos Transportes");
        } catch (error) {
          console.log(
            "Error en la conexión a la Base de Datos Transportes" + error
          );
        }
      }
  
      if (db_name == "todos" || db_name == "br_atacarejo") {
        try {
          bdBratacarejo = await odbc.connect(conectConfigBratacarejo);
          console.log("Conexión exitosa a la Base de Datos BRatacarejo");
        } catch (error) {
          console.log(
            "Error en la conexión a la Base de Datos BRatacarejo" + error
          );
        }
      }
  
      if (db_name == "todos" || db_name == "panelart") {
        try {
          bdPanelart = await odbc.connect(conectConfigPanelart);
          console.log("Conexión exitosa a la Base de Datos Panelart");
        } catch (error) {
          console.log("Error en la conexión a la Base de Datos Panelart" + error);
        }
      }
  
      if (db_name == "todos" || db_name == "br_utilidades") {
        try {
          bdBrutilidades = await odbc.connect(conectConfigBrutilidades);
          console.log("Conexión exitosa a la Base de Datos BrUtilidades");
        } catch (error) {
          console.log(
            "Error en la conexión a la Base de Datos BrUtilidades" + error
          );
        }
      }
  
      console.log("Api Rest lista para ser consumida...");
      return;
    }
  
    conectarABasesDeDatos("todos");*/

  // http://localhost:3000/sql_prueba
  app.get("/sql_prueba", async (req, res) => {
    try {
      conectarBDFirebird = await odbc.connect(conectConfigPrueba);
      console.log("\n Conexión exitosa a la base de datos prueba");
      arrayDatos = await conectarBDFirebird.query("SELECT * FROM clientes");
      console.log("\n Se ejecutó con éxito la consulta SQL");
    } catch (error) {
      console.log(`Ocurrió un error en la BD: \n`);
      console.log(error);
    }
    res.json(arrayDatos);
  });

  //------------------------------------------------------------------------------------------------------------------

  //localhost:3000/restart_api = para acceder externamente
  app.post("/restart_api", async (req, res) => {
    var auth = req.body.auth;
    let status;

    try {
      if (auth == "user_autorized_anglo") {
        res.json("Reiniciado API REST");
        console.log("Reiniciando API REST...");

        exec("pm2 restart apiRestServidor", (error, stdout, stderr) => {
          if (error) {
            status = `ERROR al Reiniciar la API REST, \n ${error}`;
            //console.error(`Error al reiniciar la el servicio: ${error}`);
            //return;
            //status = `Error al detener el servicio: ${error}`;
            //console.log(status);
            console.log("ERROR al DETENER servicios API REST...");
          } else {
            status = "detenido";
            console.log("Deteniendo servicios API REST...");
            //console.log(`Aplicación reiniciada: ${stdout}`);
          }
        });
      } else {
        status = `User no authorized to restart server...`;
      }

      res.json(status);
    } catch (error) {
      status = `ERROR al Reiniciar la API REST, \n ${error}`;
      console.error(`Hubo un error al ejecutar los comandos EXEC, \n ${error}`);
      res.json(status);
    }
  });

  //------------------------------------------------------------------------------------------------------------------

  //http://localhost:3000/sql_union_dbs
  //localhost:3000/sql_union_dbs = para acceder externamente
  app.post("/sql_union_dbs", async (req, res) => {
    //Definimos una variable para la consulta modificada
    var sql_recebido_new = "";

    //Extraemos el listado de bases que queremos excluir de la ejecución de la consulta
    var exclude_dbs = req.body.exclude_dbs;

    //Definimos una varible para almacenar la lista de bases a excluir en formato array.
    let list_exclude_dbs = [];

    //Definimos un interruptor para verificar el acceso al bucle por primera vez.
    var sw = 0;

    if (exclude_dbs) {
      try {
        //Convertimos el string separado por comas en un array
        list_exclude_dbs = exclude_dbs.split(",");

        //Quitando espacios de cada elemento
        list_exclude_dbs = list_exclude_dbs.map((item) => item.trim());
      } catch (error) {
        console.log(`Llamada Sin Exclusion de Bases \n ${error}`);
      }
    }

    let arrayDatos = [];
    let auxArray = [];
    let cantiDbs = 6;
    let api_name;
    let responseAxios = [];
    let req_dynamic;

    try {
      //Recorremos un array para cambiar el nombre de las bases conforme recorre el bucle
      //Se define cantiDbs = 6, para recorrer 5 veces el array, para las 5 bases
      for (let i = 1; i < cantiDbs; i++) {
        sql_recebido_new = req.body.sql_recebido;

        if (i === 1) {
          api_name = "bratacarejo";
        } else {
          if (i === 2) {
            api_name = "utilidades";
          } else {
            if (i === 3) {
              api_name = "anglo";
            } else {
              if (i === 4) {
                api_name = "panelart";
              } else {
                api_name = "brutilidades";
              }
            }
          }
        }

        // Verifica si api_name está en list_exclude_dbs
        if (list_exclude_dbs.includes(api_name)) {
          console.log(`Excluyendo '${api_name}'`);

          // Salta esta iteración del bucle y pasa a la siguiente y no se ejecuta la consulta
          continue;
        }

        try {
          let auxStr = sql_recebido_new.toString().toUpperCase();
          //Se llama una función que reemplaza el String (consulta sql) y agrega un campo al inicio de nombre DB_NAME.
          sql_recebido_new = findAllReplace(
            auxStr,
            `SELECT`,
            `SELECT '${api_name}' as DB_NAME, `
          );
        } catch (error) {
          console.error(
            `Error al Asignar Nombres para las bases en UNION DBs: \n  ${error}`
          );
        }

        // Se almacena la nueva consulta con el campo DB_NAME en un objeto con el formato de la API que apunta a la BD.
        req_dynamic = { sql_recebido: sql_recebido_new };

        try {
          //Se hace la solicitud POST a la API en cada iteración dinamizando el nombre de la base con el padrón sql_"nombre_base"
          responseAxios = await axios.post(
            `http://localhost:3000/sql_${api_name}`,
            req_dynamic
          );
          auxArray = responseAxios.data;
        } catch (error) {
          console.error(
            `Error al ejecutar consulta en ${api_name} para UNION DBs \n ${error}`
          );
        }

        //Verificamos que sea la primera vez que se cargó datos en el array
        //Si es la primera vez, solo carga el array resultante.
        if (sw === 0) {
          arrayDatos = auxArray;
          sw = 1;
        } else {
          //Desde la segunda vez en adelante, junta el resultado con la pila de array que está acumulando los resultados.
          arrayDatos = arrayDatos.concat(auxArray);
        }
      }
    } catch (error) {
      console.error(`Error al consumir api en UNION DBs: \n ${error}`);
      arrayDatos = {
        status: 500,
        success: false,
        error: { code: 500, message: error.message },
      };
    }

    //Retorna la respuesta ya sea si fue exitosa o tuvo algún error.
    res.json(arrayDatos);
  });

  //------------------------------------------------------------------------------------------------------------------

  //SOLO está documentado la primera API /sql_utilidades, ya que el resto tiene el mismo padrón de código.

  //------------------------------------------------------------------------------------------------------------------

  //http://localhost:3000/sql_utilidades
  app.post("/sql_utilidades", async (req, res) => {
    //Obtenemos el body la clave sql_recibido el cual contiene la consulta sql en texto plano.
    var sql_recebido = req.body.sql_recebido;
    let arrayDatos = [];

    let newConnection;

    try {
      //Creamos nueva conexión a la BD
      newConnection = await odbc.connect(conectConfigUtilidades);
      //Ejecutamos la consulta a la BD
      arrayDatos = await newConnection.query(`${sql_recebido}`);
      console.log("Consulta exitosa a la bd Utilidades");
    } catch (error) {
      console.log(`Ups ! Error en la consulta a BD utilidades: \n`);
      console.error(error);
      arrayDatos = error.message;
    }

    try {
      //Cerramos la conexión creada.
      await newConnection.close();
    } catch (error) {
      console.log(`Error al cerrar conexión en bd Utilidades ${error}`);
    }
    //Retornamos la respuesta.
    res.json(arrayDatos);
  });

  //------------------------------------------------------------------------------------------------------------------

  //http://localhost:3000/sql_anglo
  app.post("/sql_anglo", async (req, res) => {
    var sql_recebido = req.body.sql_recebido;
    let arrayDatos = [];

    let newConnection;
    //let bdIsActive = 'si';
    try {
      newConnection = await odbc.connect(conectConfigTransportes); //Creamos nueva conexión a la BD
      arrayDatos = await newConnection.query(`${sql_recebido}`);
      console.log("Consulta exitosa a la bd Transportes");
    } catch (error) {
      console.log(`Ups ! Error en la consulta a BD Transportes: \n`);
      console.error(error);
      arrayDatos = error;
    }

    try {
      await newConnection.close();
    } catch (error) {
      console.log(`Error al cerrar conexión en BD Transportes ${error}`);
    }

    res.json(arrayDatos);
  });

  //------------------------------------------------------------------------------------------------------------------

  //http://localhost:3000/sql_bratacarejo
  app.post("/sql_bratacarejo", async (req, res) => {
    var sql_recebido = req.body.sql_recebido;
    let arrayDatos = [];

    let newConnection;
    //let bdIsActive = 'si';
    try {
      newConnection = await odbc.connect(conectConfigBratacarejo); //Creamos nueva conexión a la BD
      arrayDatos = await newConnection.query(`${sql_recebido}`);
      console.log("Consulta exitosa a la bd Bratacarejo");
    } catch (error) {
      console.log(`Ups ! Error en la consulta a BD Bratacarejo: \n`);
      console.error(error);
      arrayDatos = error;
    }

    try {
      await newConnection.close();
    } catch (error) {
      console.log(`Error al cerrar conexión en BD Bratacarejo ${error}`);
    }

    res.json(arrayDatos);
  });

  //------------------------------------------------------------------------------------------------------------------

  //http://localhost:3000/sql_panelart
  app.post("/sql_panelart", async (req, res) => {
    var sql_recebido = req.body.sql_recebido;
    let arrayDatos = [];

    let newConnection;
    try {
      newConnection = await odbc.connect(conectConfigPanelart); //Creamos nueva conexión a la BD
      arrayDatos = await newConnection.query(`${sql_recebido}`);
      console.log("Consulta exitosa a la BD Panelart");
    } catch (error) {
      console.log(`Ups ! Error en la consulta a BD Panelart: \n`);
      console.error(error);
      arrayDatos = error;
    }

    try {
      await newConnection.close();
    } catch (error) {
      console.log(`Error al cerrar conexión en BD Panelart ${error}`);
    }

    res.json(arrayDatos);
  });

  //------------------------------------------------------------------------------------------------------------------

  //http://localhost:3000/sql_brutilidades
  app.post("/sql_brutilidades", async (req, res) => {
    var sql_recebido = req.body.sql_recebido;
    let arrayDatos = [];

    let newConnection;

    try {
      newConnection = await odbc.connect(conectConfigBrutilidades); //Creamos nueva conexión a la BD
      arrayDatos = await newConnection.query(`${sql_recebido}`);
      console.log("Consulta exitosa a la BD BrUtilidades");
    } catch (error) {
      console.log(`Ups ! Error en la consulta a BD BrUtilidades: \n`);
      console.error(error);
      arrayDatos = error;
    }

    try {
      await newConnection.close();
    } catch (error) {
      console.log(`Error al cerrar conexión en bd BrUtilidades ${error}`);
    }

    res.json(arrayDatos);
  });
}; //Fin
