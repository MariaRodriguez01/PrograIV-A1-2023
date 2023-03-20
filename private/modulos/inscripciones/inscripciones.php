<?php
include '../../Config/Config.php';
extract($_REQUEST);

$inscripciones = isset($inscripciones) ? $inscripciones : '[]';
$accion = isset($accion) ? $accion : '';
$class_inscripcion = new Inscripcion($conexion);
print_r($class_inscripcion->recibir_datos($inscripciones));

class Inscripcion{
    private $datos=[], $db, $respuesta=['msg'=>'ok'];

    public function __construct($db){
        $this->db = $db;
    }
    public function recibir_datos($inscripcion){
        $this->datos = json_decode($inscripcion, true);
        return $this->validar_datos();
    }
    private function validar_datos(){
        if(empty($this->datos['idInscripcion'])){
            $this->respuesta['msg'] = 'Nose pudo seleccionar el ID';
        }
        if(empty($this->datos['numero'])){
            $this->respuesta['msg'] = 'Por favor ingrese el numero de inscripcion';
        }
        if(empty($this->datos['alumno'])){
            $this->respuesta['msg'] = 'Por favor ingrese el alumno';       
        }
        if(empty($this->datos['codigo'])){
            $this->respuesta['msg'] = 'Por favor ingrese el codigo';
        }
        if(empty($this->datos['fecha'])){
            $this->respuesta['msg'] = 'Por favor ingrese la fecha';
        }
        return $this->administrar_inscripcion();
    }
    private function administrar_inscripcion(){
        global $accion;
        if( $this->respuesta['msg']=='ok' ){
            if($accion=='nuevo'){
                return $this->db->consultas(
                    'INSERT INTO inscripciones VALUES(?,?,?)',
                    $this->datos['idInscripcion'], $this->datos['numero'], $this->datos['alumno'], $this->datos['codigo'], $this->datos['fecha']
                );
            }else if($accion=='modificar'){
                return $this->db->consultas(
                    'UPDATE inscripciones SET numero=?, alumno=?, codigo=?,  fecha=? WHERE idInscripcion=?',
                    $this->datos['numero'], $this->datos['alumno'], $this->datos['codigo'], $this->datos['fecha'], $this->datos['idInscripcion']
                );
            }else if($accion=='eliminar'){
                return $this->db->consultas(
                    'DELETE inscripciones FROM inscripciones WHERE idInscripcion=?',
                );
            }
        }else{
            return $this->respuesta;
        }
    }
    public function consultar(){
        $this->db->consultas('SELECT * FROM inscripciones');
        return $this->db->obtener_datos();
    }
}
?>