import { ref } from "vue";

export function contador_columna(){
    
    function sumar_id(id,lista_columna){
        const columna = lista_columna.find(col =>col.id===id)

        if(columna){
            columna.valor++;
        }
    }

    function restar_id(id,lista_columna){
        const columna = lista_columna.find(col => col.id === id)
        if(columna && columna.valor>0){
            columna.valor--;
        }
    }
    return{
        sumar_id,restar_id
    }
}