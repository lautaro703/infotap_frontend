<template>
  <div class="fondo">
    <div class="contenedor">
      <img src="/1.png" alt="logo" class="logo_inicio"/>
      <div class="centro_texto">
        <h1>¡Bienvenido de nuevo!</h1>
        <h2>Ingresa tus credenciales para acceder</h2>
      </div>
      <div class="parte_formulario">
        <label>Correo electrónico <span class="obligatorio">*</span></label>
        <input type="text" v-model="correo" placeholder="usuario@gmail.com" class="escribir">
      </div>
      <div class="parte_formulario">
        <div class="parte_contraseña">
          <label>Contraseña <span class="obligatorio">*</span></label>
          <a v-on:click="recuperar_clave" class="olvidaste-link">¿Olvidaste tu contraseña?</a>
        </div>
        <input type="password" v-model="contra" placeholder="••••••••" class="escribir">
      </div>
      <div class="recordar-checkbox">
        <input type="checkbox" id="remember" class="estilo-checkbox"/>
        <label for="remember" class="remember-label">Recordar mi sesión</label>
      </div>
      <button @click="verificacion" class="boton_principal">INGRESAR</button>
      <div class="parte_registro">
        <h3>¿No tienes cuenta?</h3>
        <button @click="crear_usuario" class="boton_registro">Regístrate</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { crear_usuario, verificacion, recuperar_clave } from '@/components/navegacion';
import router from '@/router';

</script>

<style scoped>

label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151; 
  margin-bottom: 8px;
}

.obligatorio {
  color: #ff0000; 
}

.parte_contraseña {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  width: 100%;
}

.recordar-checkbox {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  text-align: left;
}

.estilo-checkbox {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  cursor: pointer;
}

.remember-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 400;
  margin-bottom: 0;
}

.parte_registro {
  width: 100%;
  text-align: center;
  margin-top: 10px;
}

.boton_registro {
  width: 100%;
  height: 45px;
  background-color: white;
  color: #1f2937; 
  border-radius: 12px;
  border: 1px solid #e5e7eb; 
  font-size: 16px;
  font-weight: 600; 
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}

.boton_registro:hover {
  background-color: #f9fafb; 
  border-color: #d1d5db;
}

</style>