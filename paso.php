<?php

//conexion a la base de datos
include_once 'DB.php';

//comprobamos que existe la variable func
if (filter_has_var(INPUT_POST, 'func')) {
    $func = filter_input(INPUT_POST, 'func');
    //comprobamos la condición con un switch
    switch ($func) {
        case 'editar':
            //muestra un listado de la base de datos por nombre
            $nombre = filter_input(INPUT_POST, 'busc');
            $resultado = DB::editar($nombre);
            echo json_encode($resultado);
            break;

        case 'modificar':
            //devuelve un registro buscado por el codigo
            $cod = filter_input(INPUT_POST, 'busc');
            $resultado = DB::modificar($cod);
            echo json_encode($resultado);
            break;

        case 'actualizar_registro':
            $codigo = filter_input(INPUT_POST, 'busc1');
            $stock = filter_input(INPUT_POST, 'busc2');
            $resultado = DB::devuelve_stock($codigo, $stock);
            echo json_encode($resultado);
            break;

        case 'editar_combobox':
            $resultado = DB::editar_combobox();
            echo json_encode($resultado);
            break;

        case 'validar_add':
            $addCodigo = filter_input(INPUT_POST, 'busc');
            $resultado = DB::validar_codigo($addCodigo);
            echo json_encode($resultado);
            break;


        case 'insertar':
            $cod = filter_input(INPUT_POST, 'busc1');
            $nombre = filter_input(INPUT_POST, 'busc2');
            $descripcion = filter_input(INPUT_POST, 'busc3');
            $PVP = filter_input(INPUT_POST, 'busc4');
            $familia = filter_input(INPUT_POST, 'busc5');
            $stock = filter_input(INPUT_POST, 'busc6');
            $resultado = DB::insertar($cod, $nombre, $descripcion, $PVP, $familia, $stock);
            echo json_encode($resultado);
            break;

        case 'eliminar':
            //borramos registros de la base de datos pasamos un código
            $cod_delete = filter_input(INPUT_POST, 'busc');
            $resultado = DB::eliminar($cod_delete);
            echo json_encode($resultado);
            break;

        default:
            break;
    }
}
