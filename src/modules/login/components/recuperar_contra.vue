<template>
  <div class="fondo">
    <div class="contenedor">
      <img src="/1.png" alt="logo" class="logo_inicio"/>
      <div class="centro_texto">
        <h1>¿Olvidaste tu contraseña?</h1>
        <h2>Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.</h2>
      </div>
      <div class="parte_formulario">
        <label>Correo electrónico <span class="obligatorio">*</span></label>
        <input 
          type="text" v-model="correo" placeholder="usuario@gmail.com" class="escribir">
      </div>
      <button @click="guardar" class="boton_principal">Enviar correo</button>
      <button @click="ir_inicio" class="boton_volver">
        <span class="flecha">←</span> Volver al inicio de sesión
      </button>
    </div>
  </div>
</template>

<script setup>
import { ir_inicio } from '@/components/navegacion';
</script>

<style scoped>

h2 {
  line-height: 1.5;
  max-width: 400px; 
  margin: 0 auto;
}


.boton_volver {
  background: none;
  border: none;
  color: #49a70f;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.boton_volver:hover {
  color: #0c5215; 
}

.flecha {
  margin-right: 8px;
  font-size: 30px;
  transform: translateY(-1px); 
}
</style>