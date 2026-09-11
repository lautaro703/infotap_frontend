<template>
  <div class="interfaz-dashboard" :class="{ 'drag-activo-global': isDragging }" @dragover.prevent="isDragging = true" @dragleave.prevent="manejadorDragLeave" @drop.prevent="manejadorDrop">
    <!-- Overlay visual cuando se arrastra por cualquier lado de la pantalla -->
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
              :disabled="!archivoSeleccionado"
          </div>

          <button type="button" class="btn-verde-principal" @click="abrirExplorador">
            <span class="material-icons">add</span>
            AGREGAR ARCHIVO
          </button>
        </div>
      </div>

      <div class="tarjeta-panel">
        <div class="cabecera-analisis">
          <div class="texto-cabecera-seccion">
            <h3>Columnas a analizar</h3>
            <p>Selecciona las columnas que contiene la información</p>
          </div>
          <button class="btn-analisis">CREAR ANÁLISIS</button>
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

// --- REFERENCIAS Y ESTADO ---
const fileInput = ref(null);
const archivoSeleccionado = ref(null);
const nombreSinExtension = ref('');
const extension = ref(''); // Se guarda internamente pero no se muestra en la UI
const isDragging = ref(false);

const columnas = ref([
  { id: 1, nombre: 'Nombre', valor: 'A', icono: 'account_circle' },
  { id: 2, nombre: 'Apellido', valor: 'B', icono: 'person_outline' },
  { id: 3, nombre: 'Correo', valor: 'C', icono: 'mail' },
  { id: 4, nombre: 'Teléfono', valor: 'D', icono: 'phone' },
  { id: 5, nombre: 'DNI', valor: 'E', icono: 'badge' },
  { id: 6, nombre: 'Barrio', valor: 'F', icono: 'location_on' },
  { id: 7, nombre: 'Ciudad', valor: 'G', icono: 'location_searching' },
  { id: 7, nombre: 'Provincia', valor: 'H', icono: 'map' },
  { id: 7, nombre: 'Edad', valor: 'I', icono: '18_up_rating' },
  { id: 8, nombre: 'Sexo', valor: 'J', icono: 'wc' }
]);

const letras = ref([
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]);

// Si en algún momento necesitás el nombre completo con su extensión para enviarlo al backend:
const nombreCompletoParaBackend = computed(() => {
  if (!nombreSinExtension.value) return '';
  return `${nombreSinExtension.value}${extension.value}`;
});

// --- MÉTODOS ---
const abrirExplorador = () => {
  fileInput.value.click();
};

const procesarArchivo = (file) => {
  if (!file) return;

  const extensionesPermitidas = ['xlsx', 'xls', 'csv'];
  const extEncontrada = '.' + file.name.split('.').pop().toLowerCase();
  const extSinPunto = extEncontrada.replace('.', '');

  if (!extensionesPermitidas.includes(extSinPunto)) {
    alert('Por favor selecciona un archivo con formato .xlsx, .xls o .csv');
    return;
  }

  archivoSeleccionado.value = file;
  
  // Extraemos únicamente el nombre y guardamos la extensión en segundo plano
  const ultimoPunto = file.name.lastIndexOf('.');
  nombreSinExtension.value = file.name.substring(0, ultimoPunto);
  extension.value = extEncontrada;
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