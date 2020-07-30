<?php

class claseProducto
{

    protected $cod;
    protected $nombre;
    protected $descripcion;
    protected $PVP;
    protected $familia;
    protected $stock;

    public function __construct($row)
    {
        $this->cod = $row['cod'];
        $this->nombre = $row['nombre'];
        $this->descripcion = $row['descripcion'];
        $this->PVP = $row['PVP'];
        $this->familia = $row['familia'];
        $this->stock = $row['stock'];
    }

    public function getCod()
    {
        return $this->cod;
    }
    public function getNombre()
    {
        return $this->nombre;
    }
    public function getDescripcion()
    {
        return $this->descripcion;
    }
    public function getPVP()
    {
        return $this->PVP;
    }
    public function getFamilia()
    {
        return $this->familia;
    }
    public function getStock()
    {
        return $this->stock;
    }
}
