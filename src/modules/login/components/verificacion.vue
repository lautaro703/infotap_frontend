<template>
  <div class="fondo">
    <div class="contenedor">
      <img src="/1.png" alt="logo" class="logo_inicio">
      <div class="centro_texto">
        <h1>Verificación</h1>
        <h2>Ingresa el código que te llegara a tu correo</h2>
      </div>
      
      <div class="cotenedor_codigo">
        <div class="contenedor_codigo_gris">
          <div class="linea_guiones">
            <input type="text" maxlength="6" class="guion" placeholder="123456"/>
          </div>
        </div>
        <a v-on:click="mandar_nuevo_codigo" class="link">Reenviar código</a>
      </div>
      
      <button @click="ir_carga" class="boton_principal">INGRESAR</button>
    </div>
  </div>
</template>

<script setup>
import { ir_carga } from '@/components/navegacion';
</script>

<style scoped>
.ingreso_codigo {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.cotenedor_codigo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  width: 100%;
}

.contenedor_codigo_gris {
  background-color: #d0d0d0; 
  width: 100%;
  max-width: 100%;
  height: 80px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px; 
}

.linea_guiones {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.guion {
  width: 100%;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  color: #000000;
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  letter-spacing: 8px; 
}

.link {
  color: #166534; 
  font-size: 14px;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  text-align: center;
}

.link:hover {
  opacity: 0.8;
}
</style>