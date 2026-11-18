<template>
  <div class="fondo">
    <div class="contenedor">
      <img src="/1.png" alt="InfoTap" class="logo_inicio" />
      <div class="centro_texto">
        <h1>¡Bienvenido!</h1>
        <h2>Ingresá y accedé a nuestro sistema</h2>
      </div>
      <button class="boton_google" @click="ingresarConGoogle">
        <img src="/Google.svg.webp" alt="Google" />
        Continuar con Google
      </button>
      <p v-if="error" class="mensaje_error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { signInWithPopup } from 'firebase/auth'
import { auth, proveedorGoogle } from '@/services/firebase'
import router from '@/router'

const error = ref('')

const ingresarConGoogle = async () => {
  try {
    error.value = ''
    const resultado = await signInWithPopup(auth, proveedorGoogle)
    const usuario = resultado.user
    console.log('UID:', usuario.uid)
    console.log('Nombre:', usuario.displayName)
    console.log('Correo:', usuario.email)

    const token = await usuario.getIdToken()
    const respuesta= await fetch('http://localhost:3000/api/usuarios/login-google',{
      method:'POST',
      headers:{authorization:`Bearer ${token}`},
    })
    if(!respuesta.ok){
      throw new Error('No se pudo registrar el usuario en el sistema')
    }
    const usuarioRegistrado = await respuesta.json()
    console.log('Usuario registrado',usuarioRegistrado)
    console.log('Token:', token)

    router.push({ name: 'carga_archivo' })    
    
  } catch (err) {
    console.error(err)
    error.value = 'No se pudo iniciar sesión con Google.'
  }
}
</script>

<style scoped>


.contenedor {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background: white;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.logo_inicio {
  width: 200px;
  margin-bottom: 30px;
}

.centro_texto h1 {
  color: #172b4d;
  font-size: 28px;
}

.centro_texto h2 {
  color: #718096;
  font-size: 15px;
  font-weight: normal;
  margin: 12px 0 30px;
}

.boton_google {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  background: white;
  border: 1px solid #dce3ee;
  border-radius: 10px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
}

.boton_google:hover {
  background: #f5f8ff;
  border-color: #4285f4;
}

.boton_google img {
  width: 22px;
}

.mensaje_error {
  color: red;
  font-size: 13px;
  margin-top: 15px;
}
</style>
