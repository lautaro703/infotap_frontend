<template>
  <div class="interfaz-dashboard">
    <Sidebar/>

    <div class="contenido-principal">
      <template v-if="!hayAnalisisSeleccionados">
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
          <input type="text" class="input-actividad-disabled" :value="nombreActividadSeleccionada" disabled />
        </div>
        <div class="grilla-totales" v-if="!filtrosAbiertos">
          <div class="tarjeta-total-mini">
            <span class="titulo-total">Total del inscriptos</span>
            <span class="numero-total">{{ totalParticipantes }}</span>
          </div>
          <div class="tarjeta-total-mini">
            <span class="titulo-total">Barrios registrados</span>
            <span class="numero-total verde">{{ cantidadBarrios }}</span>
          </div>
          <div class="tarjeta-total-mini">
            <span class="titulo-total">Promedio de edad de los participantes</span>
            <span class="numero-total verde">{{ PromedioEdad }}</span>
            <p class="text-xs text-gray-500 mt-1">Mediana: <strong>{{ medianaEdad }} años</strong></p>
          </div>
          <div class="tarjeta-total-mini">
            <span class="titulo-total">Barrio mas frecuente</span>
            <span class="numero-total verde">Barrio {{ BarrioModal }}</span>
          </div>
          <div class="tarjeta-total-mini">
            <span class="titulo-total">Segmento Etario Predominante</span>
            <span class="numero-total verde">{{ rangoEtarioModalTexto }}</span>
          </div>
        </div>
        <div class="grilla-totales" v-else>
          <div class="tarjeta-total-mini full-width">
            <span class="titulo-total centrado">Total de inscriptos</span>
            <span class="numero-total centrado">{{ totalParticipantes }}</span>
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
                    <option value="X">X</option>
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
              <Line v-if="filtros.barrio" :data="chartData" :options="chartOptionsEdad"/>
              <Bar v-else :data="chartData" :options="chartOptions" />
            </div>
            </div>
            <div class="bloque-grafico">
              <span class="titulo-grafico">GRAFICO DE SEXO</span>
              <div class="contenedor-grafico-real  contenedor-rosquilla">
                <canvas ref="chartRosquilla"></canvas>
              </div>
           </div>            
           </div>
           <div v-if="mostrarGraficoActividad "class="bloque-grafico grafico-actividad">
                <span class="titulo-grafico">GRAFICO DE CANTIDAD DE PERSONAS POR ACTIVIDAD</span>
                <div class="contenedor-grafico-real">
                  <canvas ref="chartActividad"></canvas>
                </div>
            </div>
          </div>

          <div class="tarjeta-panel panel-grafico-barras asistente-ia">
            <div class="fila-accion-archivo">
              <div class="input-archivo-simulado">
                <span class="material-icons">auto_awesome</span>

                <input
                  type="text"
                  v-model="consultaUsuario"
                  placeholder="Preguntá algo sobre tu actividad..."
                  @keyup.enter="consultaIA"
                />
              </div>

              <button class="btn-verde-principal" @click="consultaIA" :disabled="cargandoIA">
                <span class="material-icons">send</span>
                {{ cargandoIA ? 'Consultando...' : 'Consultar' }}
              </button>
            </div>
            <div class="preguntas-ia">
              <span class="titulo-preguntas">Podés consultar:</span>
              <div class="lista-preguntas">
                <button v-for="pregunta in preguntasSugeridas" :key="pregunta" class="btn-pregunta-ia" @click="consultaUsuario = pregunta">
                  {{ pregunta }}
                </button>
              </div>
            </div>
            <div v-if="respuestaIA" class="respuesta-ia">
              <div class="encabezado-respuesta">
                <span class="material-icons">auto_awesome</span>
                <h3>Análisis de la actividad</h3>
              </div>
              <div class="seccion-respuesta">
                <h4>Resumen</h4>
                <p>{{ respuestaIA.resumen }}</p>
              </div>
              <div class="seccion-respuesta">
                <h4>Observaciones</h4>
                <ul>
                  <li v-for="(obs, index) in respuestaIA.observaciones" :key="index">
                    {{ obs }}
                  </li>
                </ul>
              </div>
              <div class="seccion-recomendacion">
                <h4>
                  <span class="material-icons">lightbulb</span>
                  Recomendación
                </h4>
                <p>{{ respuestaIA.recomendacion }}</p>
              </div>
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
                  <th>Nombre</th> <th>Apellido</th> <th>DNI</th> <th>Teléfono</th> <th>Correo</th> <th>Barrio</th> <th>Edad</th> <th>Sexo</th> <th>Ciudad</th> <th>Provincia</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(listaParticipantesBD, i) in filtroParticipantes" :key="i">
                  <td>{{ listaParticipantesBD.nombre }}</td>
                  <td>{{ listaParticipantesBD.apellido }}</td>
                  <td>{{ listaParticipantesBD.dni }}</td>
                  <td>{{ listaParticipantesBD.telefono }}</td>
                  <td>{{ listaParticipantesBD.correo }}</td>
                  <td>{{ listaParticipantesBD.barrio?.nombre || 'Sin barrio' }}</td>
                  <td>{{ listaParticipantesBD.edad }}</td>
                  <td>{{ listaParticipantesBD.sexo }}</td>
                  <td>{{ listaParticipantesBD.barrio?.ciudad?.nombre}}</td>
                  <td>{{ listaParticipantesBD.barrio?.ciudad?.provincia?.nombre }}</td>
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
import { ir_carga,cerrar_sesion, ir_historial } from '@/components/navegacion';
import { Bar, Line } from 'vue-chartjs';
import L, { map } from 'leaflet';
import { listaParticipantesBD,cargarParticipantes } from '@/components/listas'; 
import Chart from 'chart.js/auto';
import { Chart as ChartJS,Title, Tooltip,Legend,ArcElement,DoughnutController,BarElement,CategoryScale,LinearScale,LineController,LineElement,PointElement} from 'chart.js';
import { useRoute } from 'vue-router';
import Sidebar from '@/modules/extras/components/sidebar.vue';

ChartJS.register( Title, Tooltip, Legend, ArcElement, DoughnutController, BarElement, CategoryScale, LinearScale, LineController, LineElement, PointElement);

const route= useRoute();

const mapa = ref(null);
const capasMapa = ref(null); 
const ciudadActual = ref('');
const provinciaActual = ref('');

const latitudUsuario = ref(null);  
const longitudUsuario = ref(null);

const actividadSeleccionadaId = ref(route.query.id ? Number(route.query.id) : null); 
const actividadSeleccionadaNombre = ref('');

const filtrosAbiertos = ref(false);
const chartRosquilla = ref(null);
const chartActividad = ref(null);
const consultaUsuario = ref('');
const respuestaIA = ref(null);
const cargandoIA = ref(false);
let graficoActividad = null;
let llamargraficorosquilla = null;

const preguntasSugeridas = [
  '¿Cuál es el perfil predominante de los inscriptos?',
  '¿Qué barrios tienen mayor participación?',
  '¿Cómo se distribuyen los participantes por edad?',
  '¿Qué diferencias hay entre hombres y mujeres?',
  '¿Qué aspectos se podrían mejorar en esta actividad?',
  '¿Qué recomendaciones harías para futuras actividades?',
  '¿La participación fue equilibrada entre los distintos grupos?',
  '¿Qué conclusiones generales se pueden obtener?'
];

const filtros = ref({
  barrio: '',
  sexo: '',
  edadMin: '',
  edadMax: '',
});
const ordenActual = ref('');
const consultaIA = async () => {

  if (!consultaUsuario.value.trim()) {
    alert('Escribí qué querés consultar.');
    return;
  }

  try {

    cargandoIA.value = true;
    respuestaIA.value = null;

    const respuesta = await fetch(
      'http://localhost:3000/api/archivos/consulta-actividad',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...resumenEstadisticas.value,
          pregunta: consultaUsuario.value
        }),
      }
    );

    if (!respuesta.ok) {
      throw new Error('Error al consultar la IA');
    }

    respuestaIA.value = await respuesta.json();

  } catch (error) {

    console.error('Error consultando IA:', error);
    alert('No se pudo generar el análisis.');

  } finally {

    cargandoIA.value = false;

  }
};
const mostrarGraficoActividad=computed(()=> {
  if(idsAnalisisSeleccionados.value.length>0){
    return new Set(idsAnalisisSeleccionados.value.map(Number)).size>=2;
  }
  if(actividadSeleccionadaId.value !== null){
    return false;
  }
  return listaActividades.value.length>=2;
});

const nombresArchivosSelccionados = computed(() => {
  const ids = idsAnalisisSeleccionados.value;

  if (ids.length > 0) {
    return listaActividades.value
      .filter(actividad => ids.includes(Number(actividad.id)))
      .map(actividad => actividad.archivo?.nombre)
      .filter(Boolean);
  }

  if (actividadSeleccionadaId.value !== null) {
    const actividad = listaActividades.value.find(
      a => Number(a.id) === Number(actividadSeleccionadaId.value)
    );

    return actividad?.archivo?.nombre
      ? [actividad.archivo.nombre]
      : [];
  }

  return [];
});

const nombreActividadSeleccionada = computed(()=>{
  return nombresArchivosSelccionados.value.join(',')
});

const listaActividades = ref([])

const cargaActividades = async () => {
  try{
    const respuesta = await fetch ('http://localhost:3000/api/analisis');

    if(!respuesta.ok){
      throw new Error('Error al obtener las actividades');
    }
    listaActividades.value=await respuesta.json();
    console.log('ACTIVIDADES RECIBIDAS:', listaActividades.value);
  }
  catch(error){
    console.log('Error al cargar las actividades:', error)
  }
} 
const idsAnalisisSeleccionados = computed(() => {
  const ids = route.query.ids;

  if (!ids) {
    return [];
  }

  return String(ids)
    .split(',')
    .map(id => Number(id))
    .filter(id => Number.isInteger(id) && id > 0);
});

const hayAnalisisSeleccionados = computed(() => {
  return (
    idsAnalisisSeleccionados.value.length > 0 ||
    actividadSeleccionadaId.value !== null
  );
});

const filtroParticipantes = computed(() =>{

  const idsSeleccionados=idsAnalisisSeleccionados.value

  let resultado = listaParticipantesBD.value.filter((p)=>{

    if (idsSeleccionados.length > 0) {
      if (
        !p.analisis?.some((analisis) =>
          idsSeleccionados.includes(Number(analisis.id))
        )
      ) {
        return false;
      }
    } else if (
      actividadSeleccionadaId.value !== null &&
      !p.analisis?.some(
        (analisis) =>
          Number(analisis.id) === Number(actividadSeleccionadaId.value)
      )
    ) {
      return false;
    }
    if (filtros.value.barrio && p.barrio?.nombre !== filtros.value.barrio){
      return false;
    }
    if (filtros.value.sexo && p.sexo !== filtros.value.sexo){
      return false;
    }
    if (filtros.value.edadMax && p.edad > Number(filtros.value.edadMax)){
      return false
    }
    if (filtros.value.edadMin && p.edad < Number(filtros.value.edadMin)){
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


async function procesarYDibujarBarrios() {
  if (!capasMapa.value) return;

  capasMapa.value.clearLayers();

  const conteoBarrios = {};

  filtroParticipantes.value.forEach((p) => {
    const barrio = p.barrio;

    if (!barrio?.nombre) return;

    if (!conteoBarrios[barrio.id]) {
      conteoBarrios[barrio.id] = {
        nombre: barrio.nombre,
        latitud: Number(barrio.latitud),
        longitud: Number(barrio.longitud),
        total: 0,
      };
    }

    conteoBarrios[barrio.id].total++;
  });

  for (const datos of Object.values(conteoBarrios)) {
    if (
      datos.latitud === null ||
      datos.latitud === undefined ||
      datos.longitud === null ||
      datos.longitud === undefined ||
      datos.latitud === '' ||
      datos.longitud === ''
    ) {
      console.warn('Barrio sin coordenadas:', datos.nombre);
      continue;
    }

    const lat = Number(datos.latitud);
    const lon = Number(datos.longitud)

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      console.warn('Coordenadas inválidas:', datos.nombre);
      continue;
    }

    L.circle([lat,lon], {
      color: '#10b981',
      fillColor: '#10b981',
      fillOpacity: 0.5,
      radius: datos.total * 80,
    })
      .addTo(capasMapa.value)
      .bindPopup(
        `<b>Barrio ${datos.nombre}</b><br>Participantes: ${datos.total}`,
      );
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

onMounted(async () => {
  await cargaActividades();
  await cargarParticipantes();

  await nextTick(); 

  const contenedorMapa = document.getElementById('mapa-contenedor');
  if (contenedorMapa) {
    mapa.value = L.map('mapa-contenedor').setView([-38.416097, -63.616672], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(mapa.value);

    capasMapa.value = L.layerGroup().addTo(mapa.value);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          latitudUsuario.value = lat;
          longitudUsuario.value = lon;
          mapa.value.flyTo([lat, lon], 13);
          await obtenerNombreLocalidad(lat, lon);
          await procesarYDibujarBarrios();
        },
        () => {
          procesarYDibujarBarrios();
        }
      );
    } else {
      procesarYDibujarBarrios();
    }
  }

  volveGraficoRosquilla();
  dibujarGraficoActividad();
});

function obtenerdatosrosquilla(){
  const hombres= filtroParticipantes.value.filter(p=>p.sexo==='M').length;
  const mujeres= filtroParticipantes.value.filter(p=>p.sexo==='F').length;
  const x = filtroParticipantes.value.filter(p=>p.sexo==='X').length;
  return {labels: ['HOMBRES','MUJERES','X'],datasets:[{data:[hombres,mujeres,x],backgroundColor: ['#3B82F6', '#EC4899', '#9333EA'], borderWidth: 3, borderColor: '#ffffff', hoverOffset: 12}]}
}

function obtenerDatosActividad() {
  const actividades = {};

  filtroParticipantes.value.forEach(p => {
    const idsParticipante = new Set(
      (p.analisis || []).map(a => Number(a.id))
    );

    idsParticipante.forEach(id => {
      if (idsAnalisisSeleccionados.value.length > 0 &&
          !idsAnalisisSeleccionados.value.includes(id)) {
        return;
      }

      if (
        idsAnalisisSeleccionados.value.length === 0 &&
        actividadSeleccionadaId.value !== null &&
        id !== Number(actividadSeleccionadaId.value)
      ) {
        return;
      }

      if (!actividades[id]) {

        const actividad = listaActividades.value.find(
          a => Number(a.id) === id
        );

        actividades[id] = {
          nombre:
            actividad?.archivo.nombre ||
            actividad?.nombre ||
            `Actividad ${id}`,
          M: 0,
          F: 0,
          X: 0
        };
      }

      if (p.sexo === 'M') actividades[id].M++;
      if (p.sexo === 'F') actividades[id].F++;
      if (p.sexo === 'X') actividades[id].X++;
    });
  });

  const lista = Object.values(actividades);

  return {
    labels: lista.map(a => a.nombre),
    datasets: [
      {
        label: 'Hombres',
        data: lista.map(a => a.M),
        backgroundColor: '#3B82F6'
      },
      {
        label: 'Mujeres',
        data: lista.map(a => a.F),
        backgroundColor: '#EC4899'
      },
      {
        label: 'X',
        data: lista.map(a => a.X),
        backgroundColor: '#6366F1'
      }
    ]
  };
}

function dibujarGraficoActividad() {

  if (!chartActividad.value) return;

  const datos = obtenerDatosActividad();

  if (graficoActividad) {
    graficoActividad.destroy();
  }

  graficoActividad = new Chart(chartActividad.value, {
    type: 'bar',
    data: datos,
    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      },

      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: 'Actividades'
          }
        },

        y: {
          stacked: true,
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            precision: 0
          },
          title: {
            display: true,
            text: 'Cantidad de personas'
          }
        }
      }
    }
  });
}

function volveGraficoRosquilla() {
  if (!chartRosquilla.value) {
    if (llamargraficorosquilla) {
      llamargraficorosquilla.destroy();
      llamargraficorosquilla = null;
    }
    return;
  }

  const datos = obtenerdatosrosquilla();

  const pluginCentro = {
    id: 'textoCentro',

    afterDraw(chart) {
      const { ctx, chartArea } = chart;

      if (!chartArea) return;

      const total = chart.data.datasets[0].data.reduce(
        (acumulado, valor) => acumulado + valor,
        0
      );

      const centroX = (chartArea.left + chartArea.right) / 2;
      const centroY = (chartArea.top + chartArea.bottom) / 2;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = '#1f2937';
      ctx.fillText(total, centroX, centroY - 8);

      ctx.font = '12px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.fillText('PARTICIPANTES', centroX, centroY + 17);

      ctx.restore();
    }
  };

  if (llamargraficorosquilla) {
    llamargraficorosquilla.data = datos;
    llamargraficorosquilla.update();
  } else {
    llamargraficorosquilla = new Chart(chartRosquilla.value, {
      type: 'doughnut',
      data: datos,

      plugins: [pluginCentro],

      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',

        layout: {
          padding: {
            top: 15,
            bottom: 15,
            left: 20,
            right: 30
          }
        },

        plugins: {
          legend: {
            position: 'right',

            labels: {
              padding: 18,
              usePointStyle: true,
              pointStyle: 'circle',

              generateLabels(chart) {
                const etiquetas =
                  Chart.overrides.doughnut.plugins.legend.labels.generateLabels(chart);

                const valores = chart.data.datasets[0].data;
                const total = valores.reduce((a, b) => a + b, 0);

                return etiquetas.map((etiqueta) => {
                  const cantidad = valores[etiqueta.index];
                  const porcentaje = total > 0
                    ? Math.round((cantidad / total) * 100)
                    : 0;

                  return {
                    ...etiqueta,
                    text: `${etiqueta.text}  ${cantidad} (${porcentaje}%)`
                  };
                });
              }
            }
          },

          tooltip: {
            callbacks: {
              label(context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const cantidad = context.raw;
                const porcentaje = total > 0
                  ? ((cantidad / total) * 100).toFixed(1)
                  : 0;

                return ` ${cantidad} participantes (${porcentaje}%)`;
              }
            }
          }
        }
      }
    });
  }
}

watch(filtroParticipantes,()=>{
  nextTick(() => {volveGraficoRosquilla(),dibujarGraficoActividad()});
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
  const barrios = filtroParticipantes.value.map(p=>p.barrio?.nombre).filter(Boolean);
  return [...new Set(barrios)].sort((a,b)=>a.localeCompare(b));
});

const cantidadBarrios = computed(() => {
  const barrios = filtroParticipantes.value.map(p => p.barrio?.nombre).filter(Boolean);
  return new Set(barrios).size;
});

const rangoEtarioModalTexto = computed(() => {
  if (totalParticipantes.value === 0) return 'Sin datos';

  let menores18 = 0;
  let entre18y25 = 0;
  let entre26y35 = 0;
  let entre36y50 = 0 ;
  let mas50 = 0;

  filtroParticipantes.value.forEach(p => {
    const edad = p.edad;
    if (edad < 18) menores18++;
    else if (edad >= 18 && edad <= 25) entre18y25++;
    else if (edad >= 26 && edad <= 35) entre26y35++;
    else if (edad >= 36 && edad <= 50) entre36y50++;
    else mas50++;
  });

  const ganador = Math.max(menores18, entre18y25, entre26y35, entre36y50, mas50);

  if (ganador === menores18) return 'Menores de 18';
  if (ganador === entre18y25) return '18 a 25 años';
  if (ganador === entre26y35) return '26 a 35 años';
  if (ganador === entre36y50) return '36 a 50 años';
  return 'Más de 50 años';
});

const porcentajeRangoModal = computed(() => {
  if (totalParticipantes.value === 0) return 0;

  const textoGanador = rangoEtarioModalTexto.value;
  let cantidadGanadora = 0;

  filtroParticipantes.value.forEach(p => {
    const edad = p.edad;
    if (textoGanador === 'Menores de 18' && edad < 18) cantidadGanadora++;
    if (textoGanador === '18 a 25 años' && edad >= 18 && edad <= 25) cantidadGanadora++;
    if (textoGanador === '26 a 35 años' && edad >= 26 && edad <= 35) cantidadGanadora++;
    if (textoGanador === '36 a 50 años' && edad >= 36 && edad <= 50) cantidadGanadora++;
    if (textoGanador === 'Más de 50 años' && edad > 50) cantidadGanadora++;
  });

  return ((cantidadGanadora / totalParticipantes.value) * 100).toFixed(0);
});

const totalParticipantes= computed(()=> {
  return filtroParticipantes.value.length;
});

const PromedioEdad= computed(()=>{
  if(totalParticipantes.value===0) return 0;

  let suma =0;

  for(let i = 0; i< filtroParticipantes.value.length;i++){
    suma += filtroParticipantes.value[i].edad || 0;
  }
  return (suma / totalParticipantes.value).toFixed(1);
})

const medianaEdad=computed(()=>{
  if(totalParticipantes.value===0){
    return 0;
  }
  const edades = filtroParticipantes.value.map(p=>p.edad).sort((a,b)=>a-b);
  const mitad = Math.floor(edades.length/2);

  if(edades.length % 2 !==0){
    return edades[mitad];
  }else{
    return Math.round((edades[mitad-1]+edades[mitad])/2);
  }
})

const BarrioModal = computed(()=>{
  if(totalParticipantes.value===0){
    return 'sin datos'
  }

  const conteo={};

  filtroParticipantes.value.forEach(p=>{
    const nombreBarrio = p.barrio?.nombre || 'Sin barrio';
    conteo[nombreBarrio] = (conteo[nombreBarrio] || 0)+1;
  });

  let mayorBarrio = 'Sin datos';
  let mayorCantidad = 0;

  for (const barrio in conteo) {
    if (conteo[barrio] > mayorCantidad) {
      mayorCantidad = conteo[barrio];
      mayorBarrio = barrio;
    }
  }

  return mayorBarrio
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
      const barrioNombre= p.barrio?.nombre;

      if(barrioNombre){
        conteo[barrioNombre]=(conteo[barrioNombre] || 0)+1
      }
    })
  }
  return{labels: Object.keys(conteo),datasets: [{label:'participantes', backgroundColor: '#84cc16', borderRadius: 6, data:Object.values(conteo)}]};
});

const chartOptionsEdad = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'x',
  animation: {
    duration: 1800,
    easing: 'easeInOutQuart'
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Cantidad de participantes'
      },
      stepSize: 1,
      ticks: {
        stepSize: 1,
        precision: 0
      }
    },
    x: {
      title: {
        display: true,
        text: 'Edad'
      }
    }
  }
};
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
  },
  animation: {
    duration: 1800,
    easing: 'easeInOutQuart'
  }
});

const chartOptionsLinea = ref({
  responsive: true,
  maintainAspectRatio: false,

  interaction: {
    mode: 'nearest',
    intersect: true
  },

  plugins: {
    legend: {
      display: false
    },

    tooltip: {
      enabled: true,
      callbacks: {
        title: (items) => `Período: ${items[0].label}`,
        label: (context) =>
          ` ${context.raw} participantes`
      }
    }
  },

  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0
      },
      title: {
        display: true,
        text: 'Participantes'
      },
      grid: {
        color: '#e5e7eb'
      }
    },

    x: {
      grid: {
        display: false
      }
    }
  },

  elements: {
    line: {
      tension: 0.4,
      borderWidth: 3
    },
    point: {
      radius: 5,
      hoverRadius: 9,
      borderWidth: 2,
      borderColor: '#ffffff'
    }
  },

  animation: {
    duration: 1500,
    easing: 'easeInOutQuart'
  }
});

const coloresPaleta = [
  '#3b82f6', 
  '#10b981', 
  '#f59e0b', 
  '#ef4444', 
  '#8b5cf6', 
  '#ec4899', 
  '#14b8a6', 
  '#6366f1'  
];

const chartDataLinea = computed(() => {

  if (!listaActividades.value.length) {
    return { labels: [], datasets: [] };
  }

  const actividadesOrdenadas = [...listaActividades.value]
    .filter(a => a.archivo?.fecha_carga)
    .sort((a, b) =>
      new Date(a.archivo.fecha_carga) - new Date(b.archivo.fecha_carga)
    );

  const labels = actividadesOrdenadas.map(a => {
    const fecha = new Date(a.archivo.fecha_carga);

    return fecha.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  });

  const cantidades = actividadesOrdenadas.map(a =>
    Number(a.cantidad_participante) || 0
  );

  return {
    labels,

    datasets: [{
      label: 'Participantes',
      data: cantidades,

      borderColor: '#10b981',

      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;

        if (!chartArea) return 'rgba(16, 185, 129, 0.2)';

        const gradient = ctx.createLinearGradient(
          0,
          chartArea.top,
          0,
          chartArea.bottom
        );

        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.40)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.02)');

        return gradient;
      },

      fill: true,
      tension: 0.4,

      pointRadius: 5,
      pointHoverRadius: 9,
      pointBackgroundColor: '#10b981',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2
    }]
  };
});
const resumenEstadisticas = computed(() => {

  const participantes = filtroParticipantes.value;

  const hombres = participantes.filter(p => p.sexo === 'M').length;
  const mujeres = participantes.filter(p => p.sexo === 'F').length;
  const otros = participantes.filter(p => p.sexo === 'X').length;

  return {
    totalInscriptos: totalParticipantes.value,

    totalBarrios: cantidadBarrios.value,

    promedioEdad: Number(PromedioEdad.value),

    barrioFrecuente: BarrioModal.value,

    segmentoEtario: rangoEtarioModalTexto.value,

    distribucionSexo: `
      Masculino: ${hombres},
      Femenino: ${mujeres},
      X: ${otros}
    `,

    detalleActividades: [
      {
        nombre_actividad: nombreActividadSeleccionada.value,
        sexo: 'Todos',
        cantidad_personas: participantes.length
      }
    ]
  };

});
const obtenerColor = (index) => {
  if (index < coloresPaleta.length) return coloresPaleta[index];
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

.grafico-actividad {
  width: 100%;
  margin-top: 20px;
}

.grafico-actividad .contenedor-grafico-real {
  width: 100%;
  height: 350px;
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
  min-width: 0; 
  justify-content: center;
}
.grafico-actividad {
  grid-column: 1 / -1;
  width: 100%;
  margin-top: 20px;
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
  width: 100%;
  height: 280px;
  display: flex;
  justify-content: center;
  align-items: center;
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

.contenedor-rosquilla canvas {
  width: 100%;
  height: 100%;
}

.leyenda-sexo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 40%;
}

.dato-sexo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.indicador-sexo {
  width: 10px;
  height: 38px;
  border-radius: 8px;
  flex-shrink: 0;
}

.dato-hombres .indicador-sexo {
  background: #3B82F6;
}

.dato-mujeres .indicador-sexo {
  background: #EC4899;
}

.dato-otros .indicador-sexo {
  background: #9333EA;
}

.nombre-sexo {
  display: block;
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
}

.dato-sexo strong {
  display: block;
  font-size: 22px;
  color: #1e293b;
}

.dato-sexo small {
  color: #94a3b8;
  font-size: 11px;
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
  min-width: 1100px;
  border-collapse: collapse;
  table-layout: auto;
}

.tabla-datos th,
.tabla-datos td {
  padding: 12px 14px;
  text-align: left;
  white-space: nowrap;
  border-bottom: 1px solid #e5e7eb;
}

.tabla-datos thead th {
  background-color: #f5f7fa;
  font-weight: 600;
}

.tabla-datos tbody tr:hover {
  background-color: #f8fafc;
}
.asistente-ia {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preguntas-ia {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.titulo-preguntas {
  font-size: 13px;
  font-weight: 600;
  color: #666;
}

.lista-preguntas {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.btn-pregunta-ia {
  border: 1px solid #dce5dc;
  background: #f7faf7;
  color: #3d6842;
  border-radius: 20px;
  padding: 9px 14px;
  font-size: 12px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-pregunta-ia:hover {
  background: #e8f5e9;
  border-color: #8bc34a;
}

.respuesta-ia {
  width: 100%;
  box-sizing: border-box;
  padding: 22px;
  border: 1px solid #e5e9e5;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.encabezado-respuesta {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 14px;
  margin-bottom: 18px;
  border-bottom: 1px solid #eee;
  color: #72b916;
}

.encabezado-respuesta h3 {
  margin: 0;
  color: #333;
  font-size: 17px;
}

.seccion-respuesta {
  margin-bottom: 20px;
}

.seccion-respuesta h4,
.seccion-recomendacion h4 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #333;
}

.seccion-respuesta p,
.seccion-recomendacion p {
  margin: 0;
  color: #555;
  font-size: 13px;
  line-height: 1.7;
}

.seccion-respuesta ul {
  padding-left: 20px;
  margin: 8px 0 0;
}

.seccion-respuesta li {
  color: #555;
  font-size: 13px;
  line-height: 1.7;
  margin-bottom: 7px;
}

.seccion-recomendacion {
  background: #f5faed;
  border-left: 4px solid #83c91a;
  border-radius: 8px;
  padding: 15px;
}

.seccion-recomendacion h4 {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #568b12;
  margin-bottom: 8px;
}

.btn-verde-principal:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
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