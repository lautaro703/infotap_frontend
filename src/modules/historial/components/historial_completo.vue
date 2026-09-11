<template>
  <div class="interfaz-dashboard">
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
          <button @click="ir_carga" class="nav-item">
            <span class="material-icons">cloud_upload</span>
            Cargar datos
          </button>
          <button @click="ir_estadisticas" class="nav-item">
            <span class="material-icons">bar_chart</span>
            Estadísticas
          </button>
          <button @click="" class="nav-item activo">
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
            <span class="material-icons">description</span> 
          </div>
          <div class="texto-cabecera-seccion">
            <h3>Historial</h3>
            <p>Podés visualizar todas las actividades que realizaste</p>
          </div>
          <div class="cabecera-boton">
            <button class="btn-abrir" @click="exportarExel">
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
              <span class="col-nombre texto-negrita">{{ actividad.nombre }}</span>
              <span class="col-fecha text-mutado">{{ actividad.fecha }}</span>
              <span class="col-participantes texto-negrita">{{ actividad.participantes.toLocaleString() }}</span>
              <div class="col-acciones grupo-botones-accion">
                <button class="btn-eliminar" @click.stop="eliminarActividad(actividad.id)">
                  <span class="material-icons">close</span>
                </button>
                <div class="icono-estado">
                  <span class="material-icons">hexagon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button class="btn-abrir" :disabled="actividadSeleccionada.length===0" @click="abrirActividad">ABRIR ({{actividadSeleccionada.length}})</button>
      </div>
      </div>
   </div>
</template>

<script setup>
import { ref } from 'vue';
import { ir_carga,ir_inicio, ir_estadisticas } from '@/components/navegacion';
import XLSX from 'xlsx-js-style';
import { listaActividades } from '@/components/listas';
import { listaParticipantesBD } from '@/components/listas';
const actividadSeleccionada = ref([]);

function seleccionarActividad(id) {
  const index = actividadSeleccionada.value.indexOf(id);
  if (index === -1){
    actividadSeleccionada.value.push(id);
  }else {
  actividadSeleccionada.value.splice(index,1)
  }
}

function exportarExel() {
  if (!listaParticipantesBD.value || listaParticipantesBD.value.length === 0) {
    alert("Todavía no hay participantes registrados");
    return;
  }

  const datosFormateados = listaParticipantesBD.value.map(p => ({
    'Nombre': p.nombre,
    'Apellido': p.apellido,
    'DNI': p.dni,
    'Teléfono': p.telefono,
    'Correo Electrónico': p.correo,
    'Barrio': p.barrio,
    'Edad': p.edad,
    'Sexo': p.sexo
  }));

  const hoja = XLSX.utils.json_to_sheet(datosFormateados);

  hoja['!cols'] = [
    { wch: 15 }, 
    { wch: 15 }, 
    { wch: 14 }, 
    { wch: 16 }, 
    { wch: 28 }, 
    { wch: 18 }, 
    { wch: 10 },
    { wch: 10 } 
  ];

  const celdasEncabezado = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1'];
  
  celdasEncabezado.forEach(celda => {
    if (hoja[celda]) {
      hoja[celda].s = {font: { name: 'Calibri',sz: 11,bold: true}};
    }
  });

  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, 'Participantes');

  XLSX.writeFile(libro, 'Lista_participantes_InfoTap.xlsx');
}

function eliminarActividad(id) {
  listaActividades.value = listaActividades.value.filter(act => act.id !== id);
  actividadSeleccionada.value=actividadSeleccionada.value.filter(seleccionId => seleccionId!==id);
}

function abrirActividad() {
  alert(`Abriendo la actividad con ID: ${actividadSeleccionada.value.join(',')}`);
}

</script>

<style scoped>

.nav-item.activo {
  background-color: #f0fdf4;
  color: #65a30d;
  font-weight: 600;
}
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
.icono-verde-claro .material-icons {
  font-size: 26px;
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