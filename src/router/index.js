import { createRouter, createWebHistory } from 'vue-router'
import Crear_usuario from '@/modules/login/components/crear_usuario.vue'
import Recuperar_contra from '@/modules/login/components/recuperar_contra.vue'
import Historial_completo from '@/modules/historial/components/historial_completo.vue'
import Carga_archivo from '@/modules/carga/components/carga_archivo.vue'
import Analisis from '@/modules/estadisticas/components/analisis.vue'
import Ingreso from '@/modules/login/components/ingreso.vue'
import Verificacion from '@/modules/login/components/verificacion.vue'

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
    },
    {
      path: '/carga_archivo',
      name: 'carga_archivo',
      component: Carga_archivo,
    },
    {
      path: '/analisis',
      name: 'analisis',
      component: Analisis,
    },
    {
      path: '/verificacion',
      name: 'verificacion',
      component: Verificacion,
    }
  ],
})

export default router
