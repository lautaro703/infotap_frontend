<template>
 <div class="sidebar">
    <div class="sidebar-superior">
        <img src="/2.png" alt="logo" class="logo-horizontal">

    <div class="bloque-usuario">
      <div class="avatar">
          <img v-if="hasPhoto" :src="userPhoto" alt="Avatar" class="avatar-img" />
          <span v-else class="material-icons">person</span>
      </div>
     <span class="usuario-rol">{{ userName }}</span>
     <span class="usuario-email">{{ userEmail }}</span>
    </div>
    <div class="menu">
        <button @click="ir_carga" class="nav-item " :class="{ activo: route.path === '/carga_archivo' } ">
            <span class="material-icons">cloud_upload</span>
            Cargar datos
        </button>
        <button @click="ir_estadisticas" class="nav-item " :class="{ activo: route.path === '/estadisticas' || route.path === '/analisis' }">
            <span class="material-icons">bar_chart</span>
            Estadísticas
        </button>
        <button @click="ir_historial" class="nav-item " :class="{ activo: route.path === '/historial_completo' }">
            <span class="material-icons">description</span>
            Historial
        </button>
    </div>
    </div>
    <div class="sidebar-inferior">
    <button @click="cerrar_sesion()" class="boton-c-sesion">
        <span class="material-icons">logout</span>
        Cerrar sesión
    </button>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter, useRoute } from 'vue-router';
import { ir_carga, ir_estadisticas, ir_historial, cerrar_sesion } from '@/components/navegacion';

const router = useRouter();
const route = useRoute();

const userName = ref('Cargando...');
const userEmail = ref('Cargando...');
const userPhoto = ref('');
const hasPhoto = ref(false);

const auth = getAuth();

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userName.value = user.displayName || 'USUARIO';
      userEmail.value = user.email || 'sin-correo@gmail.com';
      
      if (user.photoURL) {
        userPhoto.value = user.photoURL;
        hasPhoto.value = true;
      } else {
        hasPhoto.value = false;
      }
    }
  });
  console.log("Ruta actual en el navegador:", route.path);
});
</script>

<style scoped>
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #334155;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 8px;
  border: 2px solid #475569;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nav-item.activo {
  background-color: #f0fdf4 !important;
  color: #65a30d !important;
  font-weight: 600;
}

</style>