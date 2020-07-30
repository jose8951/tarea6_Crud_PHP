<?php

require_once 'claseProducto.php';

//datos para la conexion a la base de datos
define('DB_HOST', 'mysql:host=localhost;dbname=amazonia');
define('DB_USER', "root");
define('DB_PASS', "");


class DB
{
    //variables privadas
    private static $instancia;
    private $con;
    // $opc = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8");


    /**
     * constructor a la base de datos
     */
    private function __construct()
    {
        try {
            $this->con = new PDO(DB_HOST, DB_USER, DB_PASS);
            $this->con->exec("set names utf8");
            // $this->con->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            //si tenemos un error a la base de datos
            $this->con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            // echo "conexion ok";
        } catch (PDOException $e) {
            //Exception a la la base de datos
            die("<p>No se ha conectado a la DB " . $e->getMessage());
        }
    }


    /**
     * Método estático que devuelve la conexión a la base de datos. En caso de
     * no haberse realizado la conexión se instancia el constructor a si mismo.
     * En el caso de haber sido ya instanciada devuelve el valor de la instancia
     * @return Objeto
     */
    private static function conexion()
    {
        if (!isset(self::$instancia)) {
            self::$instancia = new DB;
        }
    }

    /**
     * devuelve la consulta preparada
     * $sql es la consulta
     */
    private static function prepare($sql)
    {
        return self::$instancia->con->prepare($sql);
    }

    /**
     * funcion para listar la base de datos
     * $nombre filta un listado por el nombre
     */
    public static function editar($nombre)
    {
        self::conexion();
        $sql = "SELECT * FROM producto where nombre LIKE '%$nombre%' order BY cod";
        try {
            $resultado = self::prepare($sql);
            //$resultado = self::$instancia->con->prepare($sql);
            $resultado->execute();
            $validar = false;
            $aux = $resultado->fetchAll(PDO::FETCH_ASSOC);
            if (!empty($aux)) {
                return $aux;
            } else {
                return $validar;
            }
        } catch (PDOException $e) {
            echo "Error en la conexion " . $e->getMessage();
        }
    }

    /**
     * Función devuelve el valor de resgistro de la base de datos
     * $cod busca un registro por el $cod
     */
    public static function modificar($cod)
    {
        //recuperamos la conexión
        self::conexion();
        $sql = "SELECT cod, nombre, descripcion, PVP, familia, stock FROM producto WHERE cod=?";
        try {
            //llamamos a la preparacion de la consulta 
            $resultado = self::prepare($sql);
            //introducimos los correspondientes parametros de la consulta
            $resultado->bindParam(1, $cod);
            $resultado->execute();
            $aux = $resultado->fetchAll(PDO::FETCH_ASSOC);
            if (!empty($aux)) {
                return $aux;
            } else
                return null;
        } catch (PDOException $e) {
            echo "Error en la conexion " . $e->getMessage();
        }
    }

    /**
     * Función para actualizar el stock pasamos por parametro el codigo
     */
    public static function devuelve_stock($codigo, $stock)
    {
        self::conexion();
        $sql = "SELECT * FROM producto WHERE cod=?";
        try {
            //llamamos a la preparacion de la consulta 
            $resultado = self::prepare($sql);
            $resultado->bindParam(1, $codigo);
            $resultado->execute();
            $aux = $resultado->fetch(PDO::FETCH_ASSOC);
            //sumamos la variable del stock
            $suma = $aux['stock'] + $stock;
            $sqll = "UPDATE producto SET stock ='$suma' WHERE cod=?";
            $result = self::prepare($sqll);
            $result->bindParam(1, $codigo);
            $result->execute();
            return true;
        } catch (PDOException $e) {
            echo "Error en la conexión " . $e->getMessage();
        }
    }


    /**
     * muestra un combox
     * pasamos un array con los valores de la tabla
     */
    public static function editar_combobox()
    {
        self::conexion();
        $sql = "SELECT * FROM listas_reproduccion";
        try {
            $resultado = self::prepare($sql);
            $resultado->execute();
            $aux = $resultado->fetchAll(PDO::FETCH_ASSOC);
            if (!empty($aux)) {
                return $aux;
            } else {
                return null;
            }
        } catch (PDOException $e) {
            echo 'ERRor  en la conexion: ', $e->getMessage();
        }
    }

    /**
     * Comprobamos el codigo que este en la base de datos
     * si exite devuelve el codigo
     */
    public static function validar_codigo($addCodigo)
    {
        self::conexion();
        $sql = 'SELECT * from producto WHERE cod=?';
        try {
            $resultado = self::prepare($sql);
            $resultado->bindParam(1, $addCodigo);
            $resultado->execute();
            $aux = $resultado->fetch(PDO::FETCH_ASSOC);
            if (!empty($aux)) {
                return $aux['cod'];
            } else {
                return false;
            }
        } catch (PDOException $e) {
            echo 'Error en la conexion  ' . $e->getMessage();
        }
    }

    /**
     * insertamos los valores en la base de datos
     */
    public static function insertar($cod, $nombre, $descripcion, $PVP, $familia, $stock)
    {
        self::conexion();
        $sql = "INSERT INTO producto (cod,nombre,descripcion, PVP, familia, stock) VALUES (?,?,?,?,?,?)";
        try {
            //llamamos a la preparacion de la consulta 
            $resultado = self::prepare($sql);
            $resultado->bindParam(1, $cod);
            $resultado->bindParam(2, $nombre);
            $resultado->bindParam(3, $descripcion);
            $resultado->bindparam(4, $PVP);
            $resultado->bindparam(5, $familia);
            $resultado->bindparam(6, $stock);
            $resultado->execute();
            return true;
        } catch (PDOException $e) {
            echo "se ha producido un error:  El mensaje de error es:" . $e->getMessage();
        }
        return false;
    }

    /**
     * función para el borrado de registros
     * $cod_delete código del registro a borrar
     */
    public static function eliminar($cod_delete)
    {
        //recuperamos la conexión
        self::conexion();
        $sql = "DELETE FROM producto WHERE cod=?";
        try {
            //llamamos a la preparacion de la consulta 
            $resultado = self::prepare($sql);
            //introducimos los correspondientes parametros de la consulta
            $resultado->bindParam(1, $cod_delete);
            $resultado->execute();
            //si encuentra registro devuelve 1 si no encuentra devuelve 0
            return $resultado->rowCount();
        } catch (PDOException $e) {
            echo "Se ha producido un error: el mensaje de error es: " . $e->getMessage();
        }

        return false;
    }
}


/*
$a= DB::eliminar('1111');
var_dump($a);
*/

/*
$a = DB::insertar('aaaa','bb','te4xto',4,'cpmsodo',4);
var_dump($a);
*/
/*
$a= DB::validar_codigo('3DSNG');
var_dump($a);
*/
/*
$a=DB::editar_combobox();
var_dump($a);
*/

/*
$a = db::editar('acer');
var_dump($a);
*/

/*
$a= DB::modificar('3DSNG');
var_dump($a);
*/

/*
$a = DB::devuelve_stock('3DSNG', 10);
var_dump($a);
*/