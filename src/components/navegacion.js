import router from "@/router";
import { ref } from "vue";

export function ir_estadisticas(){
    router.push('/analisis')
}
export function ir_carga(){
    router.push('/carga_archivo')
}
export function ir_historial(){
    router.push('/historial_completo')
}
export function ir_inicio(){
    router.push('/')
}
export function recuperar_clave(){
    router.push('/recuperar_contra')
}

export function crear_usuario(){
    router.push('/crear_usuario')
}
export function verificacion(){
    router.push('verificacion')
}
