Vue.component('v-select-alumnos', VueSelect.VueSelect);
Vue.component('component-inscripciones',{
    data() {
        return {
            accion:'nuevo',
            buscar: '',
            inscripciones: [],
            alumnos : [],
            materias : [],
            inscrpcion:{
                idInscripcion :'',
                numeroInscripcion  : '',
                fecha     : '',
                pago      : false,               
                alumno    : {
                    id    : '',
                   
                },
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
                this.inscripciones.splice(index,1);
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
            if( confirm(`Esta seguro de eliminar a ${inscripcion.alumno.label}?`) ){
                this.accion='eliminar';
                this.inscripcion=inscripcion;
                this.guardarInscripcion();
            }
        },
        nuevoInscripcion(){
            this.accion = 'nuevo';
            this.inscripcion.idInscripcion = '';
            this.inscripcion.numeroInscripcion = '';
            this.inscripcion.fecha = '';
            this.inscripcion.pago = false;
            this.inscripcion.alumno = '';
            this.inscripcion.id = '';
           
        },
        modificarInscripcion(inscripcion){
            this.accion = 'modificar';
            this.inscripcion = inscripcion;
        },
        listar(){
            this.inscripciones = JSON.parse( localStorage.getItem('inscripciones') || "[]" )
                .filter(inscripcion=>inscripcion.alumno.label.toLowerCase().indexOf(this.buscar.toLowerCase())>-1 ||
                   inscripcion.fecha.indexOf(this.buscar)>-1);
            this.alumnos = JSON.parse( localStorage.getItem('alumnos') || "[]" ).map(alumno=>{
                return { 
                    id: alumno.idAlumno,
                    label : alumno.nombre
                }
            });
        }
    },
    template: `
        <div class="row">
            <div class="col-12 col-md-6">
                <div class="card">
                    <div class="card-header">REGISTRO DE INSCRIPCIONES</div>
                    <div class="card-body">
                        <form id="frmIncripcion" @reset.prevent="nuevaInscripcion" v-on:submit.prevent="guardarInscripcion">
                            <div class="row p-1">
                                <div class="col-3 col-md-2">
                                    <label for="txtNumeroInscripcionIncripcion">NUMERO INSCRIPCION:</label>
                                </div>
                                <div class="col-3 col-md-6">
                                    <v-select-alumnos required v-model="inscripcion.alumno" :options="alumnos" ></v-select-alumnos>
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
                                <div class="col-3 col-md-2">
                                    <label for="txtPagoInscripcion">ACTUALIZAR PAGO:</label>
                                </div>
                                <div class="col-9 col-md-3">
                                    <input v-model="inscripcion.pago" type="checkbox" class="form-check-input" id="txtPagoInscripcion">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">
                                    <img :src="inscripcion.comprobante" width="50" height="50">
                                </div>
                                <div class="col-9 col-md-10">
                                    <div class="input-group mb-3">
                                        <label class="input-group-text" for="inputGroupFile01">Upload</label>
                                        <input accept="image/*" onChange="seleccionarImagen(this)" type="file" class="form-control" id="inputGroupFile01">
                                    </div>
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
                                    <th colspan="3"><input type="text" class="form-control" v-model="buscar"
                                        @keyup="listar()"
                                        placeholder="Buscar por fecha o numeroInscripcion"></th>
                                </tr>
                                <tr>
                                    <th>FECHA</th>
                                    <th>NUMEROINCRIPCION</th>
                                    <th colspan="2">ALUMNO</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="inscripcion in inscripciones" :key="inscripcion.idInscripcion" @click="modificarInscripcion(inscripcion)" >
                                    <td>{{ new Date(inscripcion.fecha +' 01:00:00').toLocaleDateString() }}</td>
                                    <td>{{ inscripcion.pago ? 'ACTUALIZADO' : 'PENDIENTE' }}</td>
                                    <td><img :src="inscripcion.comprobante" width="50" height="50"></td>
                                    <td>{{ inscripcion.alumno.label }}</td>
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

async function seleccionarImagen(image){
    let archivo = image.files[0];
    if(archivo){
        let blob = await img(archivo, 1),
            reader = new FileReader();
        reader.onload = e=>{
            app.$refs.inscripcion.inscripcion.comprobante = e.target.result;
            console.log( e.target.result ); 
        };
        reader.readAsDataURL(blob);
    }
}