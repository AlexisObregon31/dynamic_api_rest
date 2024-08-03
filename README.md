Este es un proyecto el cual fue creado para una empresa, que necesitaba de una manera dinámica de ejecutar consultas SQL en sus bases de datos.

EL propietario de la empresa, cuenta con 5 empresas en total, usando el mismo sistema pero distintas bases de datos.

La base de datos que utiliza es Firebird.

Este proyecto backend, cuenta con apis individuales para cada base.

Tambien cuenta con una api central que apunta para las 5 apis (bases), junta todo el resultado y devuelve como una sola respuesta es decir,
ejecuta una consulta en las 5 bases.

Obs: Al acceso a las bases de hace a través de ODBC, ya que utilizan firebird como BD, y el uso de librerías para conexión directa a la bd no es tan buena como las bases
de datos estándares como lo son postgres, oracle, mysql, etc.
