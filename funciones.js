$(function () {
    //función para mostrar un listado de la base de datos 
    buscar();
    //función para recuperar el registro que vamos a modificar
    update();
    //cuando tenemos el registro que vamos a modificar, utilizamos el método update_registro() para modificar
    update_registro();
    //Función para mostrar el formulario de insertar los datos
    add();
    //funcion para borrar registros
    delete_registro();
})




/**
 * funcion paa borrar registros
 */
function delete_registro() {
    //btn_delete_mostrar
    $(document).on('click', '#btn_delete', function () {
        //si tenemos el formulario insertar abierto lo cerramos
        $('#btn_add_registro').hide();
        //mostramos el formulario delete
        $('#btn_delete_mostrar').show();
        //ocultamos el formulario UPDATE
        $('#btn_editar_mostrar').hide();
        //recuperamos el ID del registro que vamos a eliminar
        let ID = $(this).attr('data-cod2');
        //nos muestra el código de registro que vamos a borrar
        $('#form_delete').html("¿Quieres borrar el registro? " + ID);
        //botón delete para confirmar el borrado del registro
        $('#btn_borrar_delete').on('click', function () {
            let parametros = {
                'func': 'eliminar',
                'busc': ID
            };
            $.ajax({
                url: 'paso.php',
                method: 'post',
                data: parametros,
                success: function (data) {
                    if (data) {
                        buscar();
                        //si la condición devuelve true es por que el archivo esta borrado
                        $('#form_delete').html('Registro borrado ok');
                    }
                },
                error: function (xhr, status) {
                    alert('Disculpe, existió un problema');
                },
            });
        });

        //botón cerrar para salir del formulario sin borrar
        $('#btn_close_delete').on('click', function () {
            $('#btn_delete_mostrar').hide();
        });

    });
}

/**
 * función update cargamos el formulario para actualizar el stock
 * recuperamos los valores del cod y el nombre del registro
 */
function update() {
    //#btn_editar es el ide del icono update
    $(document).on('click', '#btn_editar', function () {
        //resetar el valor del value input
        $('#update_stock').val("0");
        $('#mensajeError').hide();
        $('#btn_add_registro').hide();
        //recuperamos el cod del registro que vamos actualizar
        let ID = $(this).attr('data-cod1');
        // alert("valor" + ID);
        let parametros = {
            "func": "modificar",
            "busc": ID
        };
        //pasamos los parametros al metodo ajax
        $.ajax({
            url: 'paso.php',
            method: 'post',
            data: parametros,
            success: function (data) {
                data = $.parseJSON(data);
                data.forEach(function (element) {
                    $('#btn_editar_mostrar').show();
                    //guardamos el valor del código en una id oculto
                    $('#cod_oculto').val(element.cod);
                    //mostramos el nombre del campo del nombre que vamos a modificar
                    $('#form_codigo').html("El campo nombre es: " + element.nombre);
                    $('#muestra_el_stock').html("valor del stock: " + element.stock);
                    //ocultamos el formulario delete
                    $('#btn_delete_mostrar').hide();
                });
            },
            error: function (xhr, status) {
                alert("Disculpe existio un problema");
            }
        });
    });
    //cerrar el formulario de update
    $('#btn_close_stock').on('click', function () {
        $('#btn_editar_mostrar').hide();
    })
}

/**
 * función para modificar el registro con dos opciones (update o cancelar)
 */
function update_registro() {
    $(document).on('click', '#btn_update', function () {
        //recuperamos el valor del codigo oculto del registro que vamos a modificar
        let recupero_codigo = $('#cod_oculto').val();
        //recuperamos el valor del dato del input 
        let recupero_stock = $('#update_stock').val();
        //condición que sea distinto de cero.  Puede aumentar el stock ó quitar al stock
        if (recupero_stock != 0) {
            let parametros = {
                'func': 'actualizar_registro',
                'busc1': recupero_codigo,
                'busc2': recupero_stock
            };
            $.ajax({
                url: 'paso.php',
                data: parametros,
                method: 'post',
                success: function (data) {
                    if (data) {
                        //cuando todo es correcto listamos la tabla con ajax
                        buscar();
                        //ocultamos el formulario de editar
                        $('#btn_editar_mostrar').hide();
                    }
                },
                error: function (xhr, statuc) {
                    alert('Disculpe, existió un problema');
                }
            });

        } else {
            //si introducimos un dato incorrecto 
            $('#mensajeError').show();
            $('#mensajeError').html("El campo stock es incorrecto");
        }
    });
}

/**
 * Función buscar con el metodo keyup para una búsqueda en la tabla
 */
function buscar() {
    $('#input_buscador').keyup(function () {
        //recuperamos el valor de input a buscar
        var nombre = $(this).val();
        //console.log(nombre);
        //parametros a pasar
        var parametros = {
            "func": "editar",
            "busc": nombre
        };
        $.ajax({
            url: "paso.php", //archivo php donde tenemos el menu switch
            method: "post",
            data: parametros,
            success: function (data) {
                data = $.parseJSON(data);
                if (data) {
                    //funcion para mostrar los datos de la base de datos
                    muestraResultados(data);
                } else {
                    $('#tabla').html("no hay datos en la búsqueda");
                }
            },
            error: function (xhr, status) {
                alert('Disculpe, existió un problema');
            },
        });
    }).keyup();
}

/**
 * muestra un listado en la tabla. De la tabla productos
 * @param {*} data 
 */
function muestraResultados(data) {
    let resultado = "";
    resultado += '<table><tr>';
    resultado += '<th>Código</th>';
    resultado += '<th>Nombre</th>';
    resultado += '<th>Descripcion</th>';
    resultado += '<th>PVP</th>';
    resultado += '<th>Familia</th>';
    resultado += '<th>Stock</th>';
    resultado += '<th>Update</th>';
    resultado += '<th>Delete</th>';
    resultado += '</tr>';
    //foreach para mostrar los valores de la base de datos
    data.forEach(function (element) {
        resultado += '<tr><td>' + element.cod + '</td>';
        resultado += '<td>' + element.nombre + '</td>';
        resultado += '<td>' + element.descripcion + '</td>';
        resultado += '<td>' + element.PVP + '</td>';
        resultado += '<td>' + element.familia + '</td>';
        resultado += '<td>' + element.stock + '</td>';
        //muestra los iconos update y delete
        resultado += '<td><button id="btn_editar" data-cod1=' + element.cod + '><span class="far fa-edit btn btn-success"></span></button></td>';
        resultado += '<td><button id="btn_delete" data-cod2=' + element.cod + '><span class="far fa-trash-alt btn btn-danger"></span></button></td>';
        resultado += '</tr>';
    });
    resultado += '</table>';
    //muestra el resultado en el html
    $('#tabla').html(resultado);
}


/**
 * Función para mostrar el formulario de insertar los datos
 */
function add() {
    /*  $(document).on('click', '#insertar', function () {});*/

    $('#insertar').on('click', function () {
        //si abrimos insertar ocultamos el formulario delete y el formulario update
        $('#btn_delete_mostrar').hide();
        $('#btn_editar_mostrar').hide();

        //mostramos el formulario de insertar datos   
        // $('#btn_editar_mostrar').show();    
        $('#btn_add_registro').show();
        resetAnadir();
        validar_codigo();
        mostrarCombo();
    });


    /**
     * Función para validar el codigo (cod) utilizando la functión keyup() y ajax
     */
    function validar_codigo() {
        $('#add_codigo').keyup(function () {
            //Recuperamos el valor del codigo introduccido en el momento
            let valor_codigo = $(this).val();
            //pasamos los parametros para comprobar si el código esta en la base de datos
            let parametros = {
                'func': 'validar_add',
                'busc': valor_codigo
            };
            $.ajax({
                url: 'paso.php',
                method: 'post',
                data: parametros,
                success: function (data) {
                    data = $.parseJSON(data);
                    validarPutaCodigo(data, valor_codigo);
                },
                error: function (xhr, status) {
                    alert('Disculpe, existió un problema');
                }
            });
        }).keyup();
    }

    let bol_datos_cod = false;
    let bol_datos_nombre = false;
    let bol_datos_PVP = false;
    let bol_datos_familia = false;
    let bol_datos_stock = false;
    let bol_datos_descripcion = false;

    /**
     * función para controlar el ingreso de datos por medio del formulario.
     * tenemos el codigo validado a true
     */
    function validarPutaCodigo(data, valor_codigo) {
        if (valor_codigo.length > 3 && valor_codigo.length < 13) {
            if (data) {
                $("#cod_mensaje_error").html("<p class='codigo_error'><i class='fas fa-times'></i>  Este código esta en la BD.</p>");
                bol_datos_cod = false;
            } else {
                $("#cod_mensaje_error").html("<p class='codigo_ok'><i class='fas fa-check'></i> Código no repetido</p>");
                bol_datos_cod = true;
            }
        } else if (!valor_codigo.length == 0) {
            $("#cod_mensaje_error").html("<p class='codigo_error'><i class='fas fa-times'></i>  Código fuera de rango.</p>");
            bol_datos_cod = false;
        }


        /**
         * El método keyup () activa el evento keyup o adjunta una función para que se ejecute cuando ocurre.
         * controlando el valor del nombre
         */
        $('#add_nombre').keyup(function () {
            let nombre = $(this).val();
            if (nombre.length >= 3 && nombre.length <= 20) {
                $('#nombre_mensaje_error').html("<p class='codigo_ok'><i class='fas fa-check'></i> Datos correctos.</p>")
                bol_datos_nombre = true;
            } else {
                $("#nombre_mensaje_error").html("<p class='codigo_error'><i class='fas fa-times'></i> No puede estar vacío ni fuera de rango</p>");
                bol_datos_nombre = false;
            }
        });



        /**
         * El método keyup () activa el evento keyup o adjunta una función para que se ejecute cuando ocurre.
         * controlando el valor del PVP
         */
        $('#add_PVP').keyup(function () {
            let PVP = $(this).val();
            //regex solo permite 10 digitos con uno o dos decimales
            // 33.44 o 33.4
            //let regex=/^[0-9]{1,10}(\.[0-9]{1,2})?$/;
            let regex = /^\d{1,5}(\.\d{1,2})?$/;
            if (regex.test(PVP)) {
                $("#PVP_mensaje_error").html("<p class='codigo_ok'><i class='fas fa-check'></i> Numero decimal valido</p>");
                bol_datos_PVP = true;
            } else {
                $("#PVP_mensaje_error").html("<p class='codigo_error'><i class='fas fa-times'></i> Numero no valido Ejemplo 12.34</p>");
                bol_datos_PVP = false;
            }
        });


        /**
         * El método click () activa el evento 
         * controlando el valor de la familia
         */
        $('#lista_reproduccion').on('click', function () {
            let valor_combox = "";
            let la_lista = $('#lista_reproduccion').val();
            if (la_lista == 0) {
                $("#familia_mensaje_error").html("<p class='codigo_error'><i class='fas fa-times'></i> Combobox no seleccionado</p>");
                bol_datos_familia = false;
            } else {
                $("#familia_mensaje_error").html("<p class='codigo_ok'><i class='fas fa-check'></i> Combo seleccionado </p>");
                valor_combox = $('#lista_reproduccion option:selected').text();
                bol_datos_familia = true;
            }
        });


        /**
         * El método keyup () activa el evento keyup o adjunta una función para que se ejecute cuando ocurre.
         * controlando el valor del stock solo puede tener 1 a 11 digitos
         */
        $('#add_stock').keyup(function () {
            //recuperamos el valor de stock
            let stock = $(this).val();
            //console.log(stock);
            //regex solo permite de 1 a 11 dígitos
            //let regex= /^[0-9]{1,11}$/;
            let regex = /^\d{1,11}$/;
            if (regex.test(stock)) {
                $("#stock_mensaje_error").html("<p class='codigo_ok'><i class='fas fa-check'></i> Numero de stock valido</p>");
                bol_datos_stock = true;
            } else {
                $("#stock_mensaje_error").html("<p class='codigo_error'><i class='fas fa-times'></i> Numero no de stock no valido</p>");
                bol_datos_stock = false;
            }
        });

        /**
         * El método keyup () activa el evento keyup o adjunta una función para que se ejecute cuando ocurre.
         * controlando el valor de textarea
         */
        $('textarea').keyup(function () {
            //recuperamos el valor de descripcion
            let des = $(this).val();
            if (des != "") {
                $('#descripcion_mensaje_error').html("<p class='codigo_ok'><i class='fas fa-check'></i> Datos introduccidos.</p>");
                bol_datos_descripcion = true;
            } else {
                $('#descripcion_mensaje_error').html("<p class='codigo_error'><i class='fas fa-times'></i> El campo descripción no puede estar vació.</p>");
                bol_datos_descripcion = false;
            }
        });
    }

    /**
     * Cuando todo es correcto en el formulario insertar. 
     * recuperamos los valores
     * Podemos pulsar Guardar datos del formula insertar
     */
    $('#btn_guardar_add').on('click', function () {
        //recuperamos los datos del formulario.
        //pasamos a mayusculas el cod
        let valor_cod = $('#add_codigo').val().toUpperCase().trim();
        //quitamos los espacio en blanco 
        let insertar_cod = valor_cod.replace(/ /g, "");
        //console.log(insertar_cod);
        let nombre = $('#add_nombre').val();
        //console.log(nombre);
        let PVP = $('#add_PVP').val();
        //console.log(PVP);
        //console.log(bol_datos_PVP);
        let valor_combox = $('#lista_reproduccion option:selected').text();
        //console.log(valor_combox);//0k
        //console.log(bol_datos_familia);
        let stock = $('#add_stock').val();
        // console.log(stock);
        let descripcion = $('#add_descripcion').val();

        //comprobamos que no esten vacio
        if (insertar_cod == "") {
            $('#cod_mensaje_error').html("<p class='codigo_error'><i class='fas fa-times'></i> No puede estar vacío el código.</p>")
        }
        if (nombre == "") {
            $("#nombre_mensaje_error").html("<p class='codigo_error'><i class='fas fa-times'></i> No puede estar vacío ni fuera de rango.</p>");
        }
        if (PVP == "") {
            $("#PVP_mensaje_error").html("<p class='codigo_error'><i class='fas fa-times'></i> No puede estar vacío.</p>");
        }
        if (valor_combox == "Elige una opcion") {
            $("#familia_mensaje_error").html("<p class='codigo_error'><i class='fas fa-times'></i> No puede estar vacío.</p>");
        }
        if (stock == "") {
            $("#stock_mensaje_error").html("<p class='codigo_error'><i class='fas fa-times'></i>  No puede estar vacío.</p>");
        }
        if (descripcion == "") {
            $('#descripcion_mensaje_error').html("<p class='codigo_error'><i class='fas fa-times'></i> No puede estar vacío.</p>");
        }

        //console.log(bol_datos_cod, bol_datos_nombre, bol_datos_PVP, bol_datos_familia, bol_datos_stock, bol_datos_descripcion);
        if (bol_datos_cod && bol_datos_nombre && bol_datos_PVP && bol_datos_familia && bol_datos_stock && bol_datos_descripcion) {
            //tenemos los valores en parametros
            let parametros = {
                'func': 'insertar',
                'busc1': insertar_cod,
                'busc2': nombre,
                'busc3': descripcion,
                'busc4': PVP,
                'busc5': valor_combox,
                'busc6': stock
            };
            //utilizamos ajax para trasmitir los datos
            $.ajax({
                url: 'paso.php',
                method: 'post',
                data: parametros,
                success: function (data) {
                    if (data) {
                        // si todo es correcto confirmamos con un mensaje
                        mostar_confirmar_insertado();
                        //mostromos listado de la base de datos actualizado
                        buscar();
                        //boton de cerrar el formulario
                        cerrar_Formulario_Insertar();
                    }
                },
                error: function (xhr, status) {
                    alert('disculpe, existio un problema');
                }
            });
        } else {
            // console.log("Faltan datos");
        }
    });


    /**
     * boton cerrar el formulario insertar datos
     */
    $('#btn_close_add').on('click', function () {
        $('#btn_add_registro').hide();
    });

}


/**
 * función que cierra el formulario de insertar datos 
 */
function cerrar_Formulario_Insertar() {
    $("#btn_add_registro").hide(); //boton de cerrar el formulario de insertar datos
    $("#mensajeError_add").html(""); //ocultamos el mensaje de error
    // $("#inserta_correctametne").hide(); //ocultamos el mensaje de todo correcto
}

/**
 * Muestra un mensaje que todo ha ido bien, tenemos la opción de cerrar el formulario
 */
function mostar_confirmar_insertado() {
    $("#inserta_correctametne").show();
    $("#mensaje_insertado_ok").html("<p class='alert alert-success'><i class='fas fa-check'></i> Registro guardado correctamente</p>");
    //pulsamos en cerrar con la función cerramos los mensejes
    $('#boton_cerrar_insertar').on('click', function () {
        $('#inserta_correctametne').hide();
    })
}

/**
 * muestra los valores del combobox de la tabla Tabla: listas_reproduccion
 */
function mostrarCombo() {
    let parametros = {
        'func': 'editar_combobox'
    }
    $.ajax({
        url: 'paso.php',
        method: 'post',
        data: parametros,
        success: function (data) {
            data = $.parseJSON(data);
            //muestra la opcion 0
            let resultado = '<option value="0">Elige una opcion</option>';
            data.forEach(function (element) {
                resultado += '<option value=' + element.id + '>' + element.nombre + '</option>';
            });
            $('#lista_reproduccion').html(resultado);
        },
        error: function (xhr, status) {
            alert('Disculpe, existio un problema');
        }
    });
}

/**
 * reseteamos los valores del insertar datos
 */
function resetAnadir() {
    $('#cod_mensaje_error').html("");
    $('#nombre_mensaje_error').html("");
    $('#PVP_mensaje_error').html("");
    $('#familia_mensaje_error').html("");
    $('#stock_mensaje_error').html("");
    $('#descripcion_mensaje_error').html("");


    $('#add_codigo').val("");
    $('#add_nombre').val("");
    $('#add_PVP').val("");
    // $('#add_familia')[0].selecteIndex=0;
    $('#add_stock').val("");
    $('#add_descripcion').val("");

    bol_datos_cod = false;
    bol_datos_nombre = false;
    bol_datos_PVP = false;
    bol_datos_familia = false;
    bol_datos_stock = false;
    bol_datos_descripcion = false;
}