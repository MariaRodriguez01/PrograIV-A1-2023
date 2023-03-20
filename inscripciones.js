Vue.component('component-inscripciones',{
    data() {
        return {
            accion:'nuevo',
            buscar: '',
            inscripciones: [],
            inscripcion:{
                idInscripcion : '',
                numero : '',
                alumno : '',
                codigo : '',
                fecha : '',
               
            }
        }
    },
    methods:{
        guardarInscripcion(){
            this.listar();
            if(this.accion==='nuevo'){
                this.inscripcion.idInscripcion = new Date().getTime().toString(16);
                this.inscripciones.push( JSON.parse( JSON.stringify(this.inscripcion) ) );
            }else if(this.accion==='modificar'){
                let index = this.inscripciones.findIndex(inscripcion=>inscripcion.idInscripcion==this.inscripcion.idInscripcion);
                this.inscripciones[index] = JSON.parse( JSON.stringify(this.inscripcion) );
            }else if(this.accion==='eliminar'){
                let index = this.inscripciones.findIndex(inscripcion=>inscripcion.idInscripcion==this.inscripcion.idInscripcion);
                this.incripciones.splice(index,1);
            }
            localStorage.setItem("inscripciones", JSON.stringify(this.inscripciones) );
            fetch(`private/modulos/inscripciones/inscripciones.php?accion=${this.accion}&inscripciones=${JSON.stringify(this.inscripcion)}`)
            .then(resp=>resp.json())
            .then(resp=>{
                console.log(resp);
            });
            this.nuevoInscripcion();
        },
        eliminarInscripcion(inscripcion){
            if( confirm(`Esta seguro de eliminar a ${inscripcion.numero}?`) ){
                this.accion='eliminar';
                this.inscripcion=inscripcion;
                this.guardarInscripcion();
            }
        },
        nuevoInscripcion(){
            this.accion = 'nuevo';
            this.inscripcion.idInscripcion = '';
            this.inscripcion.numero = '';
            this.inscripcion.alumno = '';
            this.inscripcion.codigo = '';
            this.inscripcion.fecha = '';
           
        },
        modificarInscripcion(inscripcion){
            this.accion = 'modificar';
            this.inscripcion = inscripcion;
        },
        listar(){
            this.inscripciones = JSON.parse( localStorage.getItem('inscripciones') || "[]" )
                .filter(inscripcion=>inscripcion.numero.toLowerCase().indexOf(this.buscar.toLowerCase())>-1);
        }
    },
    template: `
    <div class="row">
    <div class="col-12 col-md-6">
        <div class="card">
            <div class="card-header">REGISTRO DE INSCRIPCIONES</div>
            <div class="card-body">
                <form id="frmInscripciones" @reset.prevent="nuevoInscripcion" v-on:submit.prevent="guardarInscripcion">
                    <div class="row p-1">
                        <div class="col-3 col-md-2">
                            <label for="txtNumeroInscripcion">INSCRIPCION N°:</label>
                        </div>
                        <div class="col-3 col-md-3">
                            <input required pattern="[0-9]{4}[0-9]{2}" 
                                title="Ingrese un numero de inscripcion valido"
                                    v-model="inscripcion.numero" type="text" class="form-control" name="txtNumeroInscripcion" id="txtNumeroInscripcion">
                        </div>
                    </div>
                    <div class="row p-1">
                        <div class="col-3 col-md-2">
                            <label for="txtAlumnoInscripcion">ALUMNO:</label>
                        </div>
                        <div class="col-9 col-md-6">
                            <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                v-model="inscripcion.alumno" type="text" class="form-control" name="txtAlumnoInscripcion" id="txtAlumnoInscripcion">
                        </div>
                    </div>
                    <div class="row p-1">
                        <div class="col-3 col-md-2">
                            <label for="txtCodigoInscripcion">CODIGO:</label>
                        </div>
                        <div class="col-3 col-md-3">
                            <input required pattern="[US|SM]{2}[IS|LI]{2}[0-9]{6}" 
                                title="Ingrese un codigo de alumno valido"
                                    v-model="inscripcion.codigo" type="text" class="form-control" name="txtCodigoInscripcion" id="txtCodigoInscripcion">
                    </div>
                </div>
                    <div class="row p-1">
                        <div class="col-3 col-md-2">
                            <label>FECHA:</label>
                        </div>
                        <div class="col-9 col-md-3">
                            <input required v-model="inscripcion.fecha" type="date" class="form-control">
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
                                        placeholder="Buscar por fecha o numeroinscripcion"></th>
                                </tr>
                                <tr>
                                    <th>FECHA</th>
                                    <th colspan="2">ALUMNO</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="inscripcion in inscripciones" :key="inscripcion.idInscripcion" @click="modificarInscripcion(inscripcion)" >
                                    <td>{{ inscripcion.numero }}</td>
                                    <td>{{ inscripcion.alumno }}</td>
                                    <td>{{ inscripcion.codigo }}</td>
                                    <td>{{ inscripcion.fecha }}</td>
                                    <td><button class="btn btn-danger" @click="eliminarDocente(inscripcion)">ELIMINAR</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `
});