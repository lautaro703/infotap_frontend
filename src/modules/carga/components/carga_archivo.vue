<template>
  <div class="interfaz-dashboard" :class="{ 'drag-activo-global': isDragging }" @dragover.prevent="isDragging = true" @dragleave.prevent="manejadorDragLeave" @drop.prevent="manejadorDrop">
    <div v-if="isDragging" class="overlay-drag">
      <span class="material-icons icono-drop-global">cloud_upload</span>
      <p>Soltá tu archivo en cualquier parte</p>
    </div>

    <div class="sidebar">
      <div class="sidebar-superior">
        <img src="/2.png" alt="logo" class="logo-horizontal">
        <div class="bloque-usuario">
          <div class="avatar">
            <span class="material-icons">person</span>
          </div>
          <span class="usuario-rol">USUARIO</span>
          <span class="usuario-email">usuario@gmail.com</span>
        </div>
        <div class="menu">
          <button @click="carga" class="nav-item activo">
            <span class="material-icons">cloud_upload</span>
            Cargar datos
          </button>
          <button @click="ir_estadisticas" class="nav-item">
            <span class="material-icons">bar_chart</span>
            Estadísticas
          </button>
          <button @click="ir_historial" class="nav-item">
            <span class="material-icons">description</span>
            Historial
          </button>
        </div>
      </div>
      <div class="sidebar-inferior">
        <button @click="ir_inicio" class="boton-c-sesion">
          <span class="material-icons">logout</span>
          Cerrar sesión
        </button>
      </div>
    </div>

    <div class="contenido-principal">
      <div class="tarjeta-panel">
        <div class="cabecera-seccion">
          <div class="icono-verde-claro">
            <span class="material-icons">cloud_upload</span>
          </div>
          <div class="texto-cabecera-seccion">
            <h3>Cargar datos</h3>
            <p>Carga tus archivos Excel y selecciona la posición de cada columna</p>
          </div>
        </div>

        <div class="fila-accion-archivo">
          <input 
           type="file" 
           ref="fileInput"
           accept=".xlsx, .xls, .csv"
           style="display: none"
           @change="manejadorInput"
           />
          <div class="input-archivo-simulado">
            <span class="material-icons ic-doc">description</span>
            <input 
              type="text" 
              placeholder="Nombre de la actividad" 
              v-model="nombreSinExtension"
              :disabled="!archivoSeleccionado">
          </div>

          <button v-if="!archivoSeleccionado" type="button" class="btn-verde-principal" @click="abrirExplorador">
            <span class="material-icons">add</span>
            AGREGAR ARCHIVO
          </button>
          <button v-if="archivoSeleccionado" type="button" class="btn-verde-principal" @click="limpiarExplorador">
            <span class="material-icons">add</span>
            BORRAR ARCHIVO
          </button>
        </div>
      </div>

      <div class="tarjeta-panel">
        <div class="cabecera-analisis">
          <div class="texto-cabecera-seccion">
            <h3>Columnas a analizar</h3>
            <p>Selecciona las columnas que contiene la información</p>
          </div>
          <button class="btn-analisis" @click="subirArchivo">CREAR ANÁLISIS</button>
        </div>
        <div class="grilla-columnas">
          <div v-for="columna in columnas" :key="columna.id" class="item-columna">
            <div class="info-campo">
              <span class="material-icons ic-campo">{{ columna.icono }}</span>
              <span>{{ columna.nombre }}</span>
            </div>
            <div class="control-select">
              <select v-model="columna.valor" class="select-columna">
                <option value="" disabled>Seleccionar</option>
                <option v-for="letra in letras" :key="letra" :value="letra">
                  {{ letra }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ir_estadisticas, ir_inicio, ir_historial } from '@/components/navegacion';
import axios  from 'axios'

const fileInput = ref(null);
const archivoSeleccionado = ref(null);
const nombreSinExtension = ref('');
const extension = ref(''); 
const isDragging = ref(false);
const cargandoCabeceras=ref(false);

const subirArchivo= async () => {
  if(!archivoSeleccionado.value){
    alert('Por favor, seleccione un archivo antes de continuar');
    return;
  }

  try{
    const formData= new FormData();
    formData.append('file',archivoSeleccionado.value);
    formData.append('nombreActividad', nombreSinExtension.value);
    formData.append('columnasMapeadas',JSON.stringify(columnas.value));

    formData.append('usuario_ID','1')
    const respuesta= await axios.post('http://localhost:3000/api/archivos/upload',formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Análisis creado con éxito:', respuesta.data);
    alert('¡Análisis creado correctamente')
  }catch(error){
    console.log('error al enviar el archivo:', error);
    alert('Hubo un problema al cargar el archivo')
  }
}

const columnas = ref([
  { id: 1, nombre: 'Nombre', valor: '', alias: ['nombre', 'nombres', 'first name'] },
  { id: 2, nombre: 'Apellido', valor: '', alias: ['apellido', 'apellidos', 'last name'] },
  { id: 3, nombre: 'Correo', valor: '',  alias: ['correo', 'correo electronico', 'email', 'e-mail', 'mail'] },
  { id: 4, nombre: 'Teléfono', valor: '', icono: 'phone', alias: ['telefono', 'celular', 'phone', 'movil', 'tel'] },
  { id: 5, nombre: 'DNI', valor: '', alias: ['dni', 'documento', 'cedula', 'nro_doc', 'pasaporte'] },
  { id: 6, nombre: 'Barrio', valor: '', alias: ['barrio', 'vecindario', 'neighborhood'] },
  { id: 7, nombre: 'Ciudad', valor: '', alias: ['ciudad', 'localidad', 'municipio', 'city'] },
  { id: 8, nombre: 'Provincia', valor: '', alias: ['provincia', 'estado', 'state'] },
  { id: 9, nombre: 'Edad', valor: '',  alias: ['edad', 'age', 'años'] },
  { id: 10, nombre: 'Sexo', valor: '', alias: ['sexo', 'genero', 'gender'] },
]);

const letras = ref([
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]);
const limpiarExplorador = () => {
  archivoSeleccionado.value=null;
  nombreSinExtension.value='';
  if(fileInput.value)fileInput.value.value='';
  columnas.value.forEach(c=>c.valor='');
}

const autocompletarMapeo = (cabecerasBackend) => {
  const normalizar = (texto) => 
    texto ? texto.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim() : '';

  columnas.value.forEach((col) => {
    col.valor = ''; // Reseteamos valor previo

    for (const [letra, cabeceraTexto] of Object.entries(cabecerasBackend)) {
      const textoLimpio = normalizar(cabeceraTexto);
      const coincide = col.alias.some((alias) => normalizar(alias) === textoLimpio);

      if (coincide) {
        col.valor = letra; // Pre-seleccionamos la letra en el select
        break;
      }
    }
  });
};


const abrirExplorador = () => {
  fileInput.value.click();
};

const procesarArchivo = async (file) => {
  if (!file) return;

  const extensionesPermitidas = ['xlsx', 'xls', 'csv'];
  const extEncontrada = '.' + file.name.split('.').pop().toLowerCase();
  const extSinPunto = extEncontrada.replace('.', '');

  if (!extensionesPermitidas.includes(extSinPunto)) {
    alert('Por favor selecciona un archivo con formato .xlsx, .xls o .csv');
    return;
  }

  archivoSeleccionado.value = file;
  
  const ultimoPunto = file.name.lastIndexOf('.');
  nombreSinExtension.value = file.name.substring(0, ultimoPunto);
  extension.value = extEncontrada;

  cargandoCabeceras.value=true;
  const formData=new FormData();
  formData.append('file',file);

  try{
    const respuesta= await axios.post('http://localhost:3000/api/archivos/previaCabecera',formData,{
      headers:{'Content-Type': 'multipart/form-data'},
    });
    if(respuesta.data && respuesta.data.cabeceras)
    {autocompletarMapeo(respuesta.data.cabeceras);}
  }catch(error){
    console.error('Error al obtener cabeceras:', error);
  } finally {
   cargandoCabeceras.value = false;
   }
};

const manejadorInput = (event) => {
  const file = event.target.files[0];
  procesarArchivo(file);
};

const manejadorDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  procesarArchivo(file);
};

const manejadorDragLeave = (event) => {
  if (event.clientX === 0 || event.clientY === 0) {
    isDragging.value = false;
  }
};
</script>

<style scoped>
.contenido-principal {
  flex: 1;
  padding: 0; 
  display: flex;
  flex-direction: column;
  gap: 25px;
}
.nav-item.activo {
  background-color: #f0fdf4;
  color: #65a30d;
  font-weight: 600;
}
.select-columna {
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #f9f9f9;
  color: #333;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
}

.select-columna:hover {
  border-color: #2e7d32; /* Tono verde alineado a la interfaz */
  background-color: #fff;
}

.select-columna:focus {
  border-color: #2e7d32;
  box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.2);
}
.tarjeta-panel {
  background-color: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  height: auto;
}

.cabecera-seccion {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.icono-verde-claro {
  width: 40px;
  height: 40px;
  background-color: #f0fdf4;
  color: #84cc16;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.texto-cabecera-seccion h3 {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.texto-cabecera-seccion p {
  font-size: 13px;
  color: #6b7280;
  margin-top: 2px;
}


.ic-doc {
  color: #9ca3af;
}



.cabecera-analisis {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
}

.btn-analisis {
  background-color: #84cc16;
  color: white;
  border: none;
  border-radius: 8px;
  height: 38px;
  padding: 0 20px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
}

.grilla-columnas {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 35px;
  margin-bottom: 30px;
}

.item-columna {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9fafb;
  transition: border-color 0.2s eases;
}
.item-columna:hover{
    border-color: #84cc16
}
.info-campo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.ic-campo {
  color: #84cc16;
  font-size: 22px;
}

.control-contador {
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.btn-count {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  font-size: 16px;
  color: #6b7280;
  cursor: pointer;
  transition: background-color 0.1s;
}

.btn-count:hover {
  background-color: #f3f4f6;
}

.valor-count {
  width: 35px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.zona-drop {
  border: 5px dashed #d1d5db;
  border-radius: 12px;
  padding: 80px 20px;
  text-align: center;
  background-color: #fafafa;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s ease;
}
.zona-drop:hover {
    border-color: #84cc16;
}

.icono-excel {
  position: relative;
  color: #22c55e;
  font-size: 40px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.texto-drop {
  font-size: 14px;
  color: #4b5563;
  font-weight: 500;
}

.link-click {
  color: #65a30d;
  font-weight: 700;
  text-decoration: none;
}

.link-click:hover {
  text-decoration: underline;
}

.formatos-compatibles {
  display: block;
  font-size: 12px;
  color: #9ca3af;
  margin-top: 6px;
}

.interfaz-dashboard {
  position: relative;
}

/* Overlay visual cuando se arrastra por cualquier lado */
.overlay-drag {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(16, 185, 129, 0.15);
  border: 3px dashed #10b981;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  backdrop-filter: blur(2px);
}

.icono-drop-global {
  font-size: 48px;
  color: #10b981;
}
</style>