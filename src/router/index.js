import { createRouter, createWebHistory } from 'vue-router'
import Crear_usuario from '@/modules/login/components/crear_usuario.vue'
import Recuperar_contra from '@/modules/login/components/recuperar_contra.vue'
import Historial_completo from '@/modules/historial/components/historial_completo.vue'
import Carga_archivo from '@/modules/carga/components/carga_archivo.vue'
import Analisis from '@/modules/estadisticas/components/analisis.vue'
import Ingreso from '@/modules/login/components/ingreso.vue'
import Verificacion from '@/modules/login/components/verificacion.vue'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/services/firebase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/crear_usuario',
      name: 'crear_usuario',
      component: Crear_usuario,
    },
    {
      path: '/',
      name: 'ingreso',
      component: Ingreso,
    },
    {
      path: '/recuperar_contra',
      name: 'recuperar_contra',
      component: Recuperar_contra,
    },
    {
      path: '/historial_completo',
      name: 'historial_completo',
      component: Historial_completo,
      meta: { requiereAuth: true },
    },
    {
      path: '/carga_archivo',
      name: 'carga_archivo',
      component: Carga_archivo,
      meta: { requiereAuth: true },
    },
    {
      path: '/analisis',
      name: 'analisis',
      component: Analisis,
      meta: { requiereAuth: true },
    },
    {
      path: '/verificacion',
      name: 'verificacion',
      component: Verificacion,
    }
  ],
})

let authIniciar=false;

const esperarAutencacion = ()=>{
  return new Promise((resolve) =>{
    const cancelarObservador=onAuthStateChanged(auth,(usuario)=>{
      cancelarObservador(), authIniciar=true ,resolve(usuario)
    })
  })
}

router.beforeEach(async(to)=>{
  let usuario = auth.currentUser

  if(!authIniciar){
    usuario=await esperarAutencacion()
  }

  if(to.meta.requiereAuth && !usuario){
    return {name:'ingreso'}
  }

  return true;
})

export default router
