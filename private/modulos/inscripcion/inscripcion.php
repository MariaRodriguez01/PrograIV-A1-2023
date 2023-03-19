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
        if(empty($this->datos['numeroInscripcion'])){
            $this->respuesta['msg'] = 'Por favor ingrese el numero de inscripcion';
        }
        if(empty($this->datos['fecha'])){
            $this->respuesta['msg'] = 'Por favor ingrese la fecha';
        }
        if(empty($this->datos['pago'])){
            $this->respuesta['msg'] = 'Por favor ingrese el pago';
        }
        if(empty($this->datos['alumno'])){
            $this->respuesta['msg'] = 'Por favor ingrese el alumno';
        }
        if(empty($this->datos['id'])){
            $this->respuesta['msg'] = 'Por favor ingrese el id';
        }
        return $this->administrar_inscripcion();
    }
    private function administrar_inscripcion(){
        global $accion;
        if( $this->respuesta['msg']=='ok' ){
            if($accion=='nuevo'){
                return $this->db->consultas(
                    'INSERT INTO inscripciones VALUES(?,?,?)',
                    $this->datos['idInscripcion'], $this->datos['numeroInscripcion'], $this->datos['fecha'], $this->datos['pago'], $this->datos['alumno'], $this->datos['id']
                );
            }else if($accion=='modificar'){
                return $this->db->consultas(
                    'UPDATE inscripciones SET numeroInscripcion=?, fecha=?, pago=?,  alumno=?,  id=? WHERE idInscripcion=?',
                    $this->datos['numeroInscripcion'], $this->datos['fecha'], $this->datos['pago'], $this->datos['alumno'], $this->datos['id'], $this->datos['idInscripcion']
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