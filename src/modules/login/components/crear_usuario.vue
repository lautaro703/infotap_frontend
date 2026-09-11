<template>
  <div class="fondo">
    <div class="contenedor">
      <img src="/1.png" alt="logo" class="logo_inicio"/>
      <div class="centro_texto">
        <h1>Crear una cuenta</h1>
        <h2>Regístrate para comenzar a usar la plataforma</h2>
      </div>
      <div class="parte_formulario">
        <label>Correo electrónico <span class="obligatorio">*</span></label>
        <input type="email" v-model="correo" placeholder="usuario@gmail.com" class="escribir">
      </div>
      <div class="parte_formulario">
        <label>Contraseña <span class="obligatorio">*</span></label>
        <input type="password" v-model="contra" placeholder="••••••••" class="escribir">
      </div>
      <div class="parte_formulario">
        <label>Confirmar contraseña <span class="obligatorio">*</span></label>
        <input type="password" v-model="confirmarContra" placeholder="••••••••" class="escribir">
      </div>
      <button @click="guardar" class="boton_principal">Registrarse</button>
      <div class="alineacion_text_link">
        <span>¿Ya tienes cuenta?</span>
        <button @click="ir_inicio" class="enlace_login">Iniciar Sesión</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import router from '@/router';
import { ir_inicio } from '@/components/navegacion';

const correo = ref('');
const contra = ref('');
const confirmarContra = ref('');

function guardar() {
  if (contra.value !== confirmarContra.value) {
    alert("Las contraseñas no coinciden");
    return;
  }
  console.log("Registrando usuario...", correo.value);
  router.push('/');
}

</script>

<style scoped>
.alineacion_text_link {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 100%;
  font-size: 14px;
  color: #6b7280; 
  font-weight: 500;
  margin-top: 10px;
}

.enlace_login {
  background: none;
  border: none;
  color: #166534; 
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.enlace_login:hover {
  color: #15803d;
  text-decoration: underline; 
}
</style>