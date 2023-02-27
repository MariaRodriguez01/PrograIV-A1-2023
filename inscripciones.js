Vue.component('component-inscripciones',{
    data() {
        return {
            accion:'nuevo',
            buscar: '',
            inscripciones: [],
            inscripcion:{
                idinscripcion : '',                
                codigomateria : '',
                nombrealumno : '',
                ingreso : '',

               
            }
        }
    },
    methods:{
        guardarInscripcion(){
            this.listar();
            if(this.accion==='nuevo'){
                this.inscripcion.idinscripcion = new Date().getTime().toString(16);
                this.inscripciones.push( JSON.parse( JSON.stringify(this.inscripcion) ) );
            }else if(this.accion==='modificar'){
                let index = this.inscripciones.findIndex(inscripcion=>inscripcion.idinscripcion==this.inscripcion.idinscripcion);
                this.inscripciones[index] = JSON.parse( JSON.stringify(this.inscripcion) );
            }else if(this.accion==='eliminar'){
                let index = this.inscripciones.findIndex(inscripcion=>inscripcion.idinscripcion==this.inscripcion.idinscripcion);
                this.inscripciones.splice(index,1);
            }
            localStorage.setItem("inscripciones", JSON.stringify(this.inscripciones) );
            this.nuevoInscripcion();
        },
        eliminarInscripcion(inscripcion){
            if( confirm(`Esta seguro de eliminar a ${inscripcion.idinscripcion}?`) ){
                this.accion='eliminar';
                this.inscripcion=inscripcion;
                this.guardarInscripcion();
            }
        },
        nuevoInscripcion(){
            this.accion = 'nuevo';
            this.inscripcion.idinscripcion = '';           
            this.inscripcion.codigomateria = '';
            this.inscripcion.nombrealumno = '';
            this.inscripcion.ingreso = '';
           
        },
        modificarInscripcion(inscripcion){
            this.accion = 'modificar';
            this.inscripcion = inscripcion;
        },
        listar(){
            this.inscripciones = JSON.parse( localStorage.getItem('inscripciones') || "[]" )
                .filter(inscripcion=>inscripcion.idinscripcion.toLowerCase().indexOf(this.buscar.toLowerCase())>-1);
        }
    },
    template: `
        <div class="row">
            <div class="col-12 col-md-6">
                <div class="card">
                    <div class="card-header">REGISTRO DE INSCRIPCIONES</div>
                    <div class="card-body">
                        <form id="frmInscripcion" @reset.prevent="nuevoInscripcion" v-on:submit.prevent="guardarInscripcion">
                            
                           
                             <div class="row p-1">
                             <div class="col-3 col-md-2">
                                 <label for="txtcodigomateriainscripcion">CODIGO MATERIA:</label>
                             </div>
                            
                                  <div class="col-3 col-md-3">
                                      <input required pattern="[0-9]{3}" 
                                          title="Ingrese un id de materia de 3 digitos"
                                             v-model="inscripcion.codigomateria" type="text" class="form-control" name="txtCodigomateriainscripcion" id="txtCodigomateriainscripcion">
                                 </div>
                              </div>
                              <div class="row p-1">
                                <div class="col-3 col-md-2">
                                    <label for="txtNombrealumnoInscricopn">NOMBRE ALUMNO:</label>
                                </div>
                                <div class="col-9 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                        v-model="inscripcion.nombrealumno" type="text" class="form-control" name="txtNombrealumnoInscripcion" id="txtNombrealumnoInscripcion">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">
                                    <label for="txtIngresoInscricopn">NUEVO O ANTIGUO INGRESO:</label>
                                </div>
                                <div class="col-9 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                        v-model="inscripcion.ingreso" type="text" class="form-control" name="txtIngresoInscripcion" id="txtIngresoInscripcion">
                                </div>
                            </div>
                       
                            <div class="row p-1">
                                <div class="col-3 col-md-3">
                                    <input class="btn btn-primary" type="submit" 
                                        value="Guardar">
                                </div>
                                <div class="col-3 col-md-3">
                                    <input class="btn btn-warning" type="reset" value="Nuevo">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div class="col-12 col-md-6">
            <div class="card">
                <div class="card-header">LISTADO DE INSCRIPCIONES</div>
                <div class="card-body">
                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>BUSCAR:</th>
                                <th colspan="2"><input type="text" class="form-control" v-model="buscar"
                                    @keyup="listar()"
                                    placeholder="Buscar por codigo o nombre"></th>
                            </tr>
                            <tr>
                                                       
                                <th>CODIGO MATERIA</th>
                                <th>NOMBRE ALUMNO</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="inscripcion in inscripciones" :key="inscripcion.idInscripcion" @click="modificarInscripcion(inscripcion)" >
                                                          
                                <td>{{ inscripcion.codigomateria }}</td>
                                <td>{{ inscripcion.nombrealumno }}</td>
                                <td>{{ inscripcion.ingreso }}</td>
                                <td><button class="btn btn-danger" @click="eliminarInscripcion(inscripcion)">ELIMINAR</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
`
});