import router from "@/router";
import { auth } from "@/services/firebase";
import { signOut } from "firebase/auth";

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
export async function cerrar_sesion(){
    try{
        await signOut(auth) 
        router.push('/')
    }catch(error){
        console.log('Error al cerrar sesión',error)
    }
}