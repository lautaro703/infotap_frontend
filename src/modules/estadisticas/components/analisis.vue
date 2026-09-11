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
          <span class="usuario-email">quecaradeculopordiosquetenes@gmail.com</span>
        </div>
        <div class="menu">
          <button @click="ir_carga" class="nav-item">
            <span class="material-icons">cloud_upload</span>
            Cargar datos
          </button>
          <button @click="" class="nav-item activo">
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
      <template v-if="!actividadSeleccionadaId">
        <div class="tarjeta-panel cabecera-global">
          <div class="cabecera-seccion">
            <div class="icono-verde-claro">
              <span class="material-icons">trending_up</span>
            </div>
            <div class="texto-cabecera-seccion">
              <h3>Estadísticas de las actividades realizadas</h3>
              <p>Vas a ver como fue tu actividad a travez de un grafico</p>
            </div>
          </div>
        </div>
        <div class="tarjeta-panel panel-kpi-global">
          <span class="titulo-total centrado">Cantidad de actividades realizadas</span>
          <span class="numero-kpi-grande">{{ listaActividades.length }}</span>
        </div>
        <div class="tarjeta-panel panel-grafico-global">
          <span class="titulo-grafico-global">Cantidad de gente se registro por actividad</span>
          <div class="contenedor-grafico-horizontal">
            <Line :data="chartDataLinea" :options="chartOptionsLinea" />
          </div>
          <button class="btn-buscar-actividad" @click="ir_historial">
            BUSCAR ACTIVIDAD PARA ANALIZAR
          </button>
        </div>
      </template>
    
      <template v-else>
        <div class="tarjeta-panel cabecera-estadisticas">
          <div class="cabecera-seccion">
            <div class="icono-verde-claro">
              <span class="material-icons">query_stats</span>
            </div>
            <div class="texto-cabecera-seccion">
              <h3>Estadísticas de la actividad</h3>
              <p>Vas a ver como fue tu actividad a través de gráficos</p>
            </div>
          </div>
          <input type="text" class="input-actividad-disabled" :value="actividadSeleccionadaNombre" disabled />
        </div>
        <div class="grilla-totales" v-if="!filtrosAbiertos">
          <div class="tarjeta-total-mini">
            <span class="titulo-total">Total del inscriptos</span>
            <span class="numero-total">{{ listaParticipantes.length }}</span>
          </div>
          <div class="tarjeta-total-mini">
            <span class="titulo-total">Barrios registrados</span>
            <span class="numero-total verde">{{ cantidadBarrios }}</span>
          </div>
        </div>
        <div class="grilla-totales" v-else>
          <div class="tarjeta-total-mini full-width">
            <span class="titulo-total centrado">Total de inscriptos</span>
            <span class="numero-total centrado">{{ listaParticipantes.length }}</span>
          </div>
        </div>
        <div class="tarjeta-panel panel-filtros">
          <button class="btn-desplegar-filtros" @click="filtrosAbiertos = !filtrosAbiertos" >
            <span>SELECCIONAR FILTROS</span>
            <span class="material-icons transition-icono" :class="{ 'rotado': filtrosAbiertos }">
              keyboard_double_arrow_down
            </span>
          </button>
        
          <div v-if="filtrosAbiertos" class="seccion-filtros-internos">
            <div class="grilla-filtros-campos">
              <div class="campo-grupo">
                <label>BARRIO</label>
                <div class="select-personalizado">
                  <select v-model="filtros.barrio">
                    <option disabled selected value="">Seleccionar barrio</option>
                    <option v-for="barrio in listaBarriosUnicos" :key="barrio" :value="barrio">{{ barrio }}</option>
                  </select>
                  <span class="material-icons icon-select">expand_more</span>
                </div>
              </div>
              <div class="campo-grupo">
                <label>EDAD</label>
                <div class="rango-inputs">
                  <div class="input-subgrupo">
                    <span>Edad mínima</span>
                    <input type="number" placeholder="Ej: 18" v-model="filtros.edadMin" min="0"/>
                  </div>
                  <div class="input-subgrupo">
                    <span>Edad máxima</span>
                    <input type="number" placeholder="Ej: 65" v-model="filtros.edadMax" max="130"/>
                  </div>
                </div>
              </div>
              <div class="campo-grupo">
                <label>SEXO</label>
                <div class="select-personalizado">
                  <select v-model="filtros.sexo">
                    <option disabled selected value="">Seleccionar sexo</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                  <span class="material-icons icon-select">expand_more</span>
                </div>
              </div>
            </div>
            <div class="acciones-filtros">
              <button class="btn-limpiar" @click="limpiarFiltros">Limpiar filtros</button>
            </div>
          </div>
          </div>
          <div class="tarjeta-panel panel-grafico-barras" >
            <div class="contenedor-dos-graficos">
              <div class="bloque-grafico">
            <span class="titulo-grafico">{{ filtros.barrio ? 'CANTIDAD DE GENTE POR EDAD' : 'CANTIDAD DE GENTE POR BARRIO' }}</span>
            <div class="contenedor-grafico-real">
              <Bar :data="chartData" :options="chartOptions" />
            </div>
            </div>
            <div v-if="!filtros.sexo" class="bloque-grafico">
              <span class="titulo-grafico">GRAFICO DE SEXO</span>
              <div class="contenedor-grafico-real  contenedor-rosquilla">
                <canvas ref="chartRosquilla"></canvas>
              </div>
           </div>
           </div>
          </div>

          <div class="tarjeta-panel panel-grafico-barras" >
          <div class="fila-accion-archivo">
           <div class="input-archivo-simulado">
             <span class="material-icons">auto_awesome</span>
             <input type="text" placeholder="Consulte con la IA sobre su actividad"  />
           </div>
           <button class="btn-verde-principal">
             <span class="material-icons">add</span>
             Consultar
           </button>
          </div>
          </div>

          <div class="tarjeta-panel panel-mapa">
            <span class="titulo-grafico">MAPA DE LOCALIZACIÓN</span>
            <div class="contenedor-grafico-real-mapa">
              <div id="mapa-contenedor"></div>
            </div>
          </div>
        
        <div class="tarjeta-panel panel-tabla">
          <div class="cabecera-tabla-info">
            <h4>Resultados</h4>
            <button class="btn-ordenar" @click="ordenarListaParticipantes">
             {{ ordenActual === 'desc' ? 'Ordenar alfabéticamente (Z - A)' : 'Ordenar alfabéticamente (A - Z)' }}
             <span class="material-icons">
             {{ ordenActual === 'asc' ? 'arrow_upward' : ordenActual === 'desc' ? 'arrow_downward' : 'swap_vert' }}
             </span>
            </button>
          </div>
          <div class="contenedor-responsive-tabla">
            <table class="tabla-datos">
              <thead>
                <tr>
                  <th>Nombre</th> <th>Apellido</th> <th>DNI</th> <th>Teléfono</th> <th>Correo</th> <th>Barrio</th> <th>Edad</th> <th>Sexo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(participantes, i) in filtroParticipantes" :key="i">
                  <td>{{ participantes.nombre }}</td>
                  <td>{{ participantes.apellido }}</td>
                  <td class="txt-bold">{{ participantes.dni }}</td>
                  <td class="txt-bold">{{ participantes.telefono }}</td>
                  <td class="txt-link">{{ participantes.correo }}</td>
                  <td>{{ participantes.barrio }}</td>
                  <td>{{ participantes.edad }}</td>
                  <td>{{ participantes.sexo }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button class="btn-generar-resumen">
            GENERAR RESUMEN
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { ir_carga, ir_inicio, ir_historial } from '@/components/navegacion';
import { Bar, Line } from 'vue-chartjs';
import L from 'leaflet';
import { listaActividades } from '@/components/listas'; 
import Chart from 'chart.js/auto';
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  DoughnutController, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  LineController, 
  LineElement, 
  PointElement 
} from 'chart.js';

ChartJS.register(
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  DoughnutController, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  LineController, 
  LineElement, 
  PointElement
);

const mapa = ref(null);
const capasMapa = ref(null); 
const ciudadActual = ref('');
const provinciaActual = ref('');

const latitudUsuario = ref(null);  
const longitudUsuario = ref(null);

const actividadSeleccionadaId = ref(1); 
const actividadSeleccionadaNombre = ref('Juntada 1');

const filtrosAbiertos = ref(false);
const chartRosquilla = ref(null);
let llamargraficorosquilla = null;

const filtros = ref({
  barrio: '',
  sexo: '',
  edadMin: '',
  edadMax: '',
});
const ordenActual = ref('');

const filtroParticipantes = computed(() =>{
  let resultado = listaParticipantes.value.filter(P=>{
    if (filtros.value.barrio && P.barrio !== filtros.value.barrio){
      return false;
    }
    if (filtros.value.sexo && P.sexo !== filtros.value.sexo){
      return false;
    }
    if (filtros.value.edadMax && P.edad > Number(filtros.value.edadMax)){
      return false
    }
    if (filtros.value.edadMin && P.edad < Number(filtros.value.edadMin)){
      return false
    }
    return true;
  });

  if(ordenActual.value === 'asc'){
    resultado = [...resultado].sort((a,b)=> a.nombre.localeCompare(b.nombre));
  }else if(ordenActual.value === 'desc'){
    resultado = [...resultado].sort((a,b)=> b.nombre.localeCompare(a.nombre));
  }
  return resultado;
});

const listaParticipantes = ref([
  { nombre: 'Lautaro', apellido: 'Vera', dni: '46887829', telefono: '3564368214', correo: 'colo30036@gmail.com', barrio: 'Sáenz Peña', edad: 20, sexo: 'M' },
  { nombre: 'Sofía', apellido: 'Gómez', dni: '42105938', telefono: '3564521098', correo: 'sofi.gomez@gmail.com', barrio: 'Centro', edad: 24, sexo: 'F' },
  { nombre: 'Mateo', apellido: 'Rossi', dni: '44521089', telefono: '3564632145', correo: 'mrossi@hotmail.com', barrio: 'La Milka', edad: 22, sexo: 'M' },
  { nombre: 'Valentina', apellido: 'Pérez', dni: '39852147', telefono: '3564412589', correo: 'valen.perez@gmail.com', barrio: 'Barrio Jardín', edad: 28, sexo: 'F' },
  { nombre: 'Joaquín', apellido: 'Sosa', dni: '45123987', telefono: '3564587963', correo: 'joaco.sosa@outlook.com', barrio: 'Consolata', edad: 21, sexo: 'M' },
  { nombre: 'Camila', apellido: 'Martínez', dni: '41236547', telefono: '3564698741', correo: 'cami.martinez@gmail.com', barrio: 'Las Rosas', edad: 26, sexo: 'F' },
  { nombre: 'Lucas', apellido: 'Fernández', dni: '43987412', telefono: '3564512369', correo: 'lucas.fer@gmail.com', barrio: 'Sáenz Peña', edad: 23, sexo: 'M' },
  { nombre: 'Lucía', apellido: 'Alvarez', dni: '40789654', telefono: '3564478521', correo: 'lu.alvarez@yahoo.com', barrio: 'Centro', edad: 27, sexo: 'F' },
  { nombre: 'Thiago', apellido: 'Benítez', dni: '47123890', telefono: '3564625814', correo: 'thiago.benitez@gmail.com', barrio: 'La Milka', edad: 19, sexo: 'M' },
  { nombre: 'Martina', apellido: 'Díaz', dni: '38456123', telefono: '3564536982', correo: 'martina.diaz@gmail.com', barrio: 'Barrio Jardín', edad: 31, sexo: 'F' }
]);

async function buscarCoordenadasBarrio(nombreBarrio) {
  const ubicacionContexto = ciudadActual.value ? `${ciudadActual.value}, ${provinciaActual.value}, Argentina` : 'San Francisco, Córdoba, Argentina';
  const consulta = `${nombreBarrio}, ${ubicacionContexto}`;
  
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(consulta)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'InfoTapApp/1.0' } });
    const data = await res.json();

    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch (e) {
    console.error(`Error buscando coordenadas para: ${nombreBarrio}`, e);
  }
  return null;
}


async function procesarYDibujarBarrios() {
  if (!capasMapa.value) return;
  capasMapa.value.clearLayers(); 

  const conteoBarrios = {};
  listaParticipantes.value.forEach(p => {
    if (p.barrio) {
      conteoBarrios[p.barrio] = (conteoBarrios[p.barrio] || 0) + 1;
    }
  });

  for (const [barrio, total] of Object.entries(conteoBarrios)) {
    const coords = await buscarCoordenadasBarrio(barrio);
    
    if (coords) {
      L.circle(coords, {
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.5,
        radius: total * 80
      })
      .addTo(capasMapa.value)
      .bindPopup(`<b>Barrio ${barrio}</b><br>Participantes: ${total}`);
    }
  }
}

function obtenerUbicacionUsuario() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        latitudUsuario.value = position.coords.latitude;
        longitudUsuario.value = position.coords.longitude;

        if (mapa.value) {
          mapa.value.flyTo([latitudUsuario.value, longitudUsuario.value], 13);
        }

        await obtenerNombreLocalidad(latitudUsuario.value, longitudUsuario.value);
        await procesarYDibujarBarrios();
      },
      (error) => {
        console.warn('GPS no disponible o denegado:', error.message);
        procesarYDibujarBarrios(); 
      }
    );
  } else {
    procesarYDibujarBarrios();
  }
}

async function obtenerNombreLocalidad(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'InfoTapApp/1.0' } });
    const data = await res.json();

    if (data && data.address) {
      ciudadActual.value = data.address.city || data.address.town || data.address.village || '';
      provinciaActual.value = data.address.state || '';
    }
  } catch (e) {
    console.error('Error al obtener la localidad:', e);
  }
}

onMounted(() => {

  mapa.value = L.map('mapa-contenedor').setView([-38.416097, -63.616672], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(mapa.value);

  capasMapa.value = L.layerGroup().addTo(mapa.value);

  obtenerUbicacionUsuario();

  volveGraficoRosquilla()
});

function obtenerdatosrosquilla(){
  const hombres= filtroParticipantes.value.filter(p=>p.sexo==='M').length;
  const mujeres= filtroParticipantes.value.filter(p=>p.sexo==='F').length;
  return {labels: ['HOMBRES','MUJERES'],datasets:[{data:[hombres,mujeres],backgroundColor: ['#3B82F6', '#EC4899']}]
  }
}

function volveGraficoRosquilla(){
  if (!chartRosquilla.value) {
    if (llamargraficorosquilla) {
      llamargraficorosquilla.destroy();
      llamargraficorosquilla = null;
    }
    return;
  }
  const datos = obtenerdatosrosquilla();

  if (llamargraficorosquilla) {
    llamargraficorosquilla.data = datos;
    llamargraficorosquilla.update();
  } else {
    llamargraficorosquilla = new Chart(chartRosquilla.value, {
      type: 'doughnut',
      data: datos,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}
watch(filtroParticipantes,()=>{
  nextTick(() => {volveGraficoRosquilla()});
  },{deep:true}
);


function limpiarFiltros() {
  filtros.value.barrio = '';
  filtros.value.sexo = '';
  filtros.value.edadMax = '';
  filtros.value.edadMin = '';
  nextTick(()=>{volveGraficoRosquilla()});
} 

function ordenarListaParticipantes(){
  if(ordenActual.value === 'asc'){
    ordenActual.value = 'desc';
  }else{
    ordenActual.value = 'asc';
  }
}

const listaBarriosUnicos = computed(() =>{
  const barrios = listaParticipantes.value.map(p=>p.barrio).filter(barrio=>barrio);
  return [...new Set(barrios)].sort();
})

const cantidadBarrios= computed(()=>{
  const barrios = listaParticipantes.value.map(p=>p.barrio).filter(barrio=>barrio&&barrio.trim()!=='')
  return new Set (barrios).size;
})

const chartData = computed(() => {
  const conteo={};

  const sexoSelecionado = filtros.value.sexo;

    if(filtros.value.barrio){
    filtroParticipantes.value.forEach(p=>{
      if (p.edad !== undefined && p.edad !== null) {
        conteo[p.edad] = (conteo[p.edad] || 0) + 1;
      } 
    });

    const edadOrdenadas =Object.keys(conteo).sort((a,b)=> Number(a) - Number(b));
    const labels =edadOrdenadas.map(edad=>`${edad} años`);
    const data= edadOrdenadas.map(edad => conteo[edad]);

    return {labels,datasets: [{label: 'Participantes', backgroundColor: '#84cc16', borderRadius: 6, data}]};

  }else{
    filtroParticipantes.value.forEach(p=>{
      if(p.barrio){
        const barrioNombre = p.barrio.trim();
        conteo[barrioNombre] = (conteo[barrioNombre] || 0 ) + 1; 
      }
    });
  }
  return{labels: Object.keys(conteo),datasets: [{label:'participantes', backgroundColor: '#84cc16', borderRadius: 6, data:Object.values(conteo)}]};
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, grid: { color: '#f3f4f6' },ticks:{stepSize: 1, precision: 0, callback: 
      function(value) {
          if (Math.floor(value) === value) {
            return value;
          }
        }} },
    x: { grid: { display: false } }
  }
});

1
const chartOptionsLinea = ref({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'nearest', // Muestra solo el punto más cercano al cursor
    intersect: true  // Solo si tocás exactamente el punto
  },
  plugins: {
    legend: { display: true },
    tooltip: {
      enabled: true,
      filter: (tooltipItem) => tooltipItem.raw > 0, // Ignores los que están en 0
      callbacks: {
        title: (tooltipItems) => `Período: ${tooltipItems[0].label}`,
        label: (context) => ` ${context.dataset.label}: ${context.raw} participantes`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: { display: true, text: 'Participantes' }
    },
    x: {
      grid: { display: false }
    }
  }
});

const coloresPaleta = [
  '#3b82f6', // Azul
  '#10b981', // Verde
  '#f59e0b', // Naranja
  '#ef4444', // Rojo
  '#8b5cf6', // Violeta
  '#ec4899', // Rosa
  '#14b8a6', // Cyan
  '#6366f1'  // Indigo
];
const chartDataLinea = computed(() => {
  if (!listaActividades.value.length) {
    return { labels: [], datasets: [] };
  }

  // Helper para convertir "DD/MM/YYYY" a objeto Date de JS
  const parsearFecha = (strFecha) => {
    const [dia, mes, anio] = strFecha.split('/');
    return new Date(anio, mes - 1, dia);
  };

  // 1. Obtener todas las fechas válidas para buscar el rango global
  const fechas = listaActividades.value
    .map(a => a.fecha ? parsearFecha(a.fecha) : null)
    .filter(f => f && !isNaN(f));

  if (!fechas.length) return { labels: [], datasets: [] };

  // 2. Determinar el mes/año de inicio (mínimo) y fin (máximo)
  let minFecha = new Date(Math.min(...fechas));
  let maxFecha = new Date(Math.max(...fechas));

  // Normalizamos al primer día del mes para iterar limpios
  let inicio = new Date(minFecha.getFullYear(), minFecha.getMonth(), 1);
  let fin = new Date(maxFecha.getFullYear(), maxFecha.getMonth(), 1);

  // 3. Generar las etiquetas (labels) del eje X y las llaves de agrupación
  const labels = [];
  const clavesPeriodo = []; // Formato interno "YYYY-MM" para comparar fácil

  let temp = new Date(inicio);
  const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  while (temp <= fin) {
    const mes = temp.getMonth();
    const anio = temp.getFullYear();
    
    // Etiqueta visible en el gráfico (ej: "Nov 25", "Ene 26")
    labels.push(`${nombresMeses[mes]} ${String(anio).slice(-2)}`);
    
    // Clave para mapear datos (ej: "2025-11")
    clavesPeriodo.push(`${anio}-${String(mes + 1).padStart(2, '0')}`);

    // Avanzar un mes
    temp.setMonth(temp.getMonth() + 1);
  }

  // 4. Mapear cada actividad al rango dinámico generado
  const datasets = listaActividades.value.map((actividad, index) => {
    const color = obtenerColor(index);
    
    // Creamos un array en cero por cada mes generado en la línea de tiempo
    const dataMensual = new Array(clavesPeriodo.length).fill(0);

    if (actividad.fecha) {
      const [dia, mes, anio] = actividad.fecha.split('/');
      const claveActividad = `${anio}-${mes.padStart(2, '0')}`;

      // Encontrar en qué columna del gráfico cae la fecha de la actividad
      const idx = clavesPeriodo.indexOf(claveActividad);
      if (idx !== -1) {
        dataMensual[idx] = actividad.participantes;
      }
    }

    return {
      label: actividad.nombre,
      data: dataMensual,
      borderColor: color,
      backgroundColor: color,
      tension: 0.3,
      pointRadius: 6,
      pointHoverRadius: 9,
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2
    };
  });

  return { labels, datasets };
});
// O función generadora si hay más actividades que colores en la lista
const obtenerColor = (index) => {
  if (index < coloresPaleta.length) return coloresPaleta[index];
  // Genera tonalidades equitativas en el espectro cromático
  const hue = (index * 137.5) % 360; 
  return `hsl(${hue}, 70%, 50%)`;
};
</script>

<style scoped>
.nav-item.activo {
  background-color: #f0fdf4;
  color: #65a30d;
  font-weight: 600;
}
.contenido-principal {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
}

.tarjeta-panel {
  background-color: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid #e5e7eb;
  gap:20px
}

.cabecera-seccion {
  display: flex;
  align-items: center;
  gap: 15px;
}

.icono-verde-claro {
  width: 44px;
  height: 44px;
  background-color: #f0fdf4;
  color: #84cc16;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icono-verde-claro span {
  font-size: 24px;
}

.texto-cabecera-seccion h3 {
  font-size: 20px;
  color: #111827;
  margin: 0;
  font-weight: 700;
}

.texto-cabecera-seccion p {
  font-size: 13px;
  color: #6b7280;
  margin: 2px 0 0 0;
}

.cabecera-global {
  padding: 20px 25px;
}

.panel-kpi-global {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px 25px;
}

.numero-kpi-grande {
  font-size: 76px;
  font-weight: 800;
  color: #111827;
  line-height: 1;
  letter-spacing: -0.02em;
}

.panel-grafico-global {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.titulo-grafico-global {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.contenedor-grafico-horizontal {
  width: 100%;
  max-width: 95%;
  height: 380px;
}

.btn-buscar-actividad {
  width: 100%;
  background-color: #84cc16;
  color: white;
  border: none;
  padding: 18px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.03em;
  transition: background-color 0.2s ease;
  text-align: center;
}

.btn-buscar-actividad:hover {
  background-color: #65a30d;
}

.input-actividad-disabled {
  width: 100%;
  margin-top: 20px;
  padding: 14px 20px;
  background-color: #e5e7eb;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  color: #6b7280;
  font-weight: 600;
}

.grilla-totales {
  display: flex;
  gap: 20px;
}

.tarjeta-total-mini {
  flex: 1;
  background-color: white;
  border-radius: 16px;
  padding: 20px 25px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.tarjeta-total-mini.full-width {
  flex: 1;
}

.titulo-total {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.titulo-total.centrado, .numero-total.centrado {
  text-align: center;
}

.numero-total {
  font-size: 42px;
  font-weight: 800;
  color: #84cc16;
  line-height: 1;
}

.numero-total.verde {
  color: #84cc16;
}

.panel-interactivo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.btn-desplegar-filtros {
  width: 100%;
  background-color: #f3f4f6;
  border: none;
  border-radius: 10px;
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 700;
  color: #374151;
  cursor: pointer;
  letter-spacing: 0.03em;
}

.transition-icono {
  transition: transform 0.2s ease;   
}

.transition-icono.rotado {
  transform: rotate(180deg);
}
.bloque-grafico {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0; /* Previene desbordamiento en Flexbox */
  justify-content: center; /* Centra el canvas horizontalmente */
}
.grilla-filtros-campos {
  display: flex;
  gap: 25px;
  margin-top: 10px;
}

.campo-grupo {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.campo-grupo label {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}

.select-personalizado {
  position: relative;
  width: 100%;
}
.contenedor-dos-graficos {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  width: 100%;
}
.contenedor-rosquilla {
  display: flex;
  justify-content: center; /* Centra el canvas horizontalmente */
  align-items: center;     /* Centra el canvas verticalmente */
  width: 100%;
  height: 250px;
  position: relative;
}
.select-personalizado select {
  width: 100%;
  padding: 12px 40px 12px 15px;
  border: 1px solid #e5e7eb;
  background-color: white;
  border-radius: 12px;
  font-size: 14px;
  color: #9ca3af;
  appearance: none;
  cursor: pointer;
}
.contenedor-grafico-real-mapa {
  width: 100%;
  height: 350px; 
  position: relative;
}
.icon-select {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
}

.rango-inputs {
  display: flex;
  gap: 15px;
}

.input-subgrupo {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input-subgrupo span {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.input-subgrupo input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
}

.acciones-filtros {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.btn-limpiar {
  background-color: white;
  border: 1px solid #e5e7eb;
  padding: 12px 25px;
  border-radius: 12px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.btn-aplicar {
  background-color: #84cc16;
  border: none;
  padding: 12px 35px;
  border-radius: 12px;
  font-weight: 700;
  color: white;
  cursor: pointer;
}

.seccion-grafico {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 10px 0;
}

.titulo-grafico {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 20px;
  align-items: center;
  display: flex;
}

.contenedor-grafico-real {
  width: 100%;
  max-width: 100%;
  height: 250px;
  position: relative;
}

.panel-tabla {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cabecera-tabla-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cabecera-tabla-info h4 {
  font-size: 18px;
  margin: 0;
  color: #111827;
}

.btn-ordenar {
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.contenedor-responsive-tabla {
  width: 100%;
  overflow-x: auto;
}

.tabla-datos {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.tabla-datos th {
  background-color: #e5e7eb;
  padding: 12px 15px;
  font-size: 14px;
  color: #111827;
  font-weight: 700;
}

.tabla-datos th:first-child { border-radius: 8px 0 0 8px; }
.tabla-datos th:last-child { border-radius: 0 8px 8px 0; }

.tabla-datos td {
  padding: 14px 15px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.tabla-datos tr:hover td {
  background-color: #f9fafb;
}

.txt-bold { font-weight: 700; }
.txt-link { color: #2563eb; }

.paginacion-wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
}
#mapa-contenedor {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  z-index: 1; 
}
.btn-pag {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  color: #4b5563;
}

.btn-pag.num.activo {
  background-color: #84cc16;
  color: white;
  font-weight: 700;
}

.separador-pag {
  color: #9ca3af;
  padding: 0 5px;
}

.btn-generar-resumen {
  width: 100%;
  background-color: #84cc16;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 15px;
  letter-spacing: 0.02em;
}

.btn-generar-resumen:hover {
  background-color: #65a30d;
}
</style>