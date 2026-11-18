<template>
  <div class="interfaz-dashboard">
    <Sidebar/>
    <div class="contenido-principal">
    <div class="tarjeta-panel">
      <div class="cabecera-seccion">
          <div class="icono-verde-claro">
            <span class="material-icons">description</span> 
          </div>
          <div class="texto-cabecera-seccion">
            <h3>Historial</h3>
            <p>Podés visualizar todas las actividades que realizaste</p>
          </div>
          <div class="cabecera-boton">
            <button class="btn-abrir" :class="{ 'btn-analisis-deshabilitado': listaActividades.length === 0 }" :disabled=" listaActividades.length===0" @click="exportarExel">
              <span class="material-icons">download</span> 
              Exportar Participantes
            </button>
          </div>
      </div>
        <div class="tabla-historial">      
          <div class="fila-encabezado">
            <span class="col-nombre">NOMBRE DE LA ACTIVIDAD</span>
            <span class="col-fecha">FECHA</span>
            <span class="col-participantes">N° DE PARTICIPANTES</span>
            <span class="col-acciones">ACCIONES</span>
          </div>
          <div class="contenedor-filas">
            <div v-for="actividad in listaActividades" :key="actividad.id" class="fila-actividad" :class="{ 'fila-seleccionada': actividadSeleccionada.includes(actividad.id) }" @click="seleccionarActividad(actividad.id)">
              <div class="indicador-lateral"></div>
              <span class="col-nombre texto-negrita">{{ actividad.archivo?.nombre?? 'Sin nombre' }}</span>
              <span class="col-fecha text-mutado">{{ formatearFecha(actividad.fecha_analisis) }}</span>
              <span class="col-participantes texto-negrita">{{ (actividad.cantidad_participante ?? 0).toLocaleString() }}</span>
              <div class="col-acciones grupo-botones-accion">
                <button class="btn-eliminar" @click.stop="confirmarEliminacion(actividad.archivo.id)">
                  <span class="material-icons">close</span>
                </button>
                <div class="icono-estado">
                  <span class="material-icons">hexagon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button class="btn-abrir" :disabled="actividadSeleccionada.length===0" @click="abrirAnalisis">ABRIR ({{actividadSeleccionada.length}})</button>
      </div>
      </div>
   </div>
   <Notificacion
      :mostrar="notificacion.mostrar"
      :tipo="notificacion.tipo"
      :titulo="notificacion.titulo"
      :mensaje="notificacion.mensaje"
      :texto-boton="notificacion.textoBoton"
      :procesando="eliminando"
      @cerrar="cancelarEliminacion"
      @confirmar="eliminarActividad"
    />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { ir_carga, cerrar_sesion, ir_estadisticas } from '@/components/navegacion';
import XLSX from 'xlsx-js-style';
import { listaParticipantesBD,cargarParticipantes } from '@/components/listas';
import Notificacion from '@/modules/extras/components/notificacion.vue';
import router from '@/router';
import Sidebar from '@/modules/extras/components/sidebar.vue';

const actividadSeleccionada = ref([]);

const listaActividades = ref([]);

const cargaH= async () => {
  try {
    const respuesta = await fetch('http://localhost:3000/api/analisis');
    
    if (!respuesta.ok) {
      throw new Error('Error al obtener el historial');
    }

    listaActividades.value = await respuesta.json();
  } catch (error) {
    console.error('Error al cargar el historial:', error);
    listaActividades.value=[];
  }
}

function abrirAnalisis(id) {
 
  if(actividadSeleccionada.value.length===0){
    return;
  }
  router.push({
    path:'/analisis',query:{ids:actividadSeleccionada.value.join(',')}
  });
}
const notificacion = ref({
  mostrar: false,
  tipo: 'exito',
  titulo: '',
  mensaje: '',
  textoBoton: 'Volver'
});

onMounted(()=> {
  cargaH();
});

function seleccionarActividad(id) {
  const index = actividadSeleccionada.value.indexOf(id);
  if (index === -1){
    actividadSeleccionada.value.push(id);
  }else {
  actividadSeleccionada.value.splice(index,1)
  }
}
function formatearFecha(fechaStr) {
  if (!fechaStr) return '';
  const fecha = new Date(fechaStr);
  
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(fecha);
}
async function exportarExel() {

  if (listaActividades.value.length === 0) {
    notificacion.value = {
      mostrar: true,
      tipo: 'error',
      titulo: 'No hay análisis',
      mensaje: 'Primero tenés que cargar un archivo y generar un análisis.',
      textoBoton: 'Volver'
    };
    return;
  }

  try {
    await cargarParticipantes();

    if (listaParticipantesBD.value.length === 0) {
      notificacion.value = {
        mostrar: true,
        tipo: 'error',
        titulo: 'No hay participantes',
        mensaje: 'No hay participantes disponibles para exportar.',
        textoBoton: 'Volver'
      };
      return;
    }

    const datosFormateados = listaParticipantesBD.value.map(p => ({
      'Nombre': p.nombre,
      'Apellido': p.apellido,
      'DNI': p.dni,
      'Teléfono': p.telefono,
      'Correo Electrónico': p.correo,
      'Barrio': p.barrio?.nombre,
      'Ciudad': p.barrio?.ciudad?.nombre,
      'Provincia': p.barrio?.ciudad?.provincia?.nombre,
      'Edad': p.edad,
      'Sexo': p.sexo,
    }));

    const hoja = XLSX.utils.json_to_sheet(datosFormateados);

    hoja['!cols'] = [
      { wch: 15 },
      { wch: 15 },
      { wch: 14 },
      { wch: 16 },
      { wch: 28 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 10 },
      { wch: 10 },
    ];

    const celdasEncabezado = [
      'A1', 'B1', 'C1', 'D1', 'E1',
      'F1', 'G1', 'H1', 'I1', 'J1'
    ];

    celdasEncabezado.forEach(celda => {
      if (hoja[celda]) {
        hoja[celda].s = {
          font: {
            name: 'Calibri',
            sz: 11,
            bold: true
          }
        };
      }
    });

    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Participantes');

    XLSX.writeFile(libro, 'Lista_participantes_InfoTap.xlsx');

  } catch (error) {
    console.error('Error al exportar participantes:', error);

    notificacion.value = {
      mostrar: true,
      tipo: 'error',
      titulo: '¡Hubo un error!',
      mensaje: 'No se pudo exportar la lista de participantes. Intentá nuevamente.',
      textoBoton: 'Volver'
    };
  }
}

function unificarAnalisis() {
  if (actividadSeleccionada.value.length < 2) { 
    alert('Seleccioná al menos dos análisis para unificarlos.');
    return;
  }

  router.push({
    path: '/analisis',
    query: {
      ids: actividadSeleccionada.value.join(',')
    }
  });
}

const archivoAEliminar = ref(null);
const eliminando = ref(false);

function confirmarEliminacion(id) {
  archivoAEliminar.value = id;

  Object.assign(notificacion.value, {
    mostrar: true,
    tipo: 'confirmacion',
    titulo: '¿Eliminar archivo?',
    mensaje: 'Se eliminarán el archivo, sus análisis y los participantes asociados. Esta acción no se puede deshacer.',
    textoBoton: 'Confirmar'
  });
}

function cancelarEliminacion() {
  if (eliminando.value) return;
  notificacion.value.mostrar = false;
  archivoAEliminar.value = null;
}

const eliminarActividad = async () => {
  if (archivoAEliminar.value === null) return;

  eliminando.value = true;

  try {
    const respuesta = await fetch(
      `http://localhost:3000/api/archivos/${archivoAEliminar.value}`,
      { method: 'DELETE' }
    );

    if (!respuesta.ok) {
      throw new Error('No se pudo eliminar el archivo');
    }

    await cargaH();

    notificacion.value.tipo = 'exito';
    notificacion.value.titulo = '¡Eliminación exitosa!';
    notificacion.value.mensaje = 'El archivo y sus datos asociados se eliminaron correctamente.';
    notificacion.value.textoBoton = 'Volver';
  } catch (error) {
    console.error('Error al eliminar el archivo:', error);

    notificacion.value.tipo = 'error';
    notificacion.value.titulo = '¡Hubo un error!';
    notificacion.value.mensaje = 'No se pudo eliminar el archivo. Intentá nuevamente.';
    notificacion.value.textoBoton = 'Volver';
  } finally {
    eliminando.value = false;
  }
};

function abrirActividad() {
  alert(`Abriendo la actividad con ID: ${actividadSeleccionada.value.join(',')}`);
}

</script>

<style scoped>
.cabecera-seccion {
  display: flex;
  align-items: center;
  gap: 15px;
}
.icono-verde-claro {
  width: 48px;
  height: 48px;
  background-color: #f0fdf4;
  color: #84cc16;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}


.contenido-principal {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
}

.texto-cabecera-seccion h3 {
  font-size: 22px;
  color: #1e293b;
  margin: 0;
  font-weight: 700;
}

.texto-cabecera-seccion p {
  font-size: 14px;
  color: #64748b;
  margin: 4px 0 0 0;
}
.tabla-historial {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.tarjeta-panel {
  background-color: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  height: auto;
  width: 100%;
}

.col-nombre { flex: 3; text-align: left; }
.col-fecha { flex: 1.5; text-align: center; }
.col-participantes { flex: 1.5; text-align: center; }
.col-acciones { flex: 1; text-align: right; display: flex; justify-content: flex-end; gap: 15px; }
.fila-encabezado {
  display: flex;
  padding: 12px 20px;
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #f1f5f9;
  margin-bottom: 10px;
}

.contenedor-filas {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fila-actividad {
  position: relative;
  display: flex;
  align-items: center;
  padding: 18px 20px;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.fila-actividad:hover {
  border-color: #cbd5e1;
  background-color: #f8fafc;
}

.indicador-lateral {
  position: absolute;
  left: 0;
  top: 20%;
  height: 60%;
  width: 4px;
  background-color: #84cc16; 
  border-radius: 0 4px 4px 0;
}

.fila-actividad.fila-seleccionada {
  background-color: #f7fee7; 
  border-color: #84cc16; 
}

.fila-actividad.fila-seleccionada .indicador-lateral {
  width: 6px;
  height: 70%;
  top: 15%;
}

.texto-negrita {
  font-weight: 600;
  color: #334155;
}

.text-mutado {
  color: #64748b;
}

.grupo-botones-accion {
  align-items: center;
}

.btn-eliminar {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
  transition: color 0.2s;
}

.btn-eliminar:hover {
  color: #ef4444;
}

.icono-estado {
  color: #cbd5e1; 
  display: flex;
  align-items: center;
}

.fila-seleccionada .icono-estado {
  color: #84cc16;
}

.btn-abrir {
  width: 100%;
  background-color: #84cc16;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 10px;
}

.btn-abrir:hover:not(:disabled) {
  background-color: #65a30d;
  transform: translateY(-1px);
}

.btn-abrir:disabled {
  background-color: #cbd5e1;
  color: #94a3b8;
  cursor: not-allowed;
}
.cabecera-seccion {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  margin-bottom: 20px; 
}
.cabecera-boton .btn-abrir {
  display: flex;           
  align-items: center;      
  justify-content: center;   
  gap: 8px;                  
  width: auto;
  padding: 10px 18px;
  margin-top: 0;
  font-size: 14px;
  line-height: 1;            
}

.btn-abrir:hover:not(:disabled) {
  background-color: #65a30d;
  transform: translateY(-1px);
}

.btn-abrir:disabled {
  background-color: #cbd5e1;
  color: #94a3b8;
  cursor: not-allowed;
}
.cabecera-boton {
  margin-left: auto;
}
</style>