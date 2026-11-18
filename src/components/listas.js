import { ref } from "vue";

export const listaParticipantesBD = ref([]);

export async function cargarParticipantes() {
  try {
    const respuesta = await fetch('http://localhost:3000/api/participantes');

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const participantes = await respuesta.json();

    listaParticipantesBD.value = participantes.map((p) => ({
      ...p,
      barrio: p.barrio ?? null,
      sexo:
        p.genero?.tipo === 'Masculino'
          ? 'M'
          : p.genero?.tipo === 'Femenino'
            ? 'F'
            : 'X',
    }));

    console.log('Participantes cargados desde PostgreSQL:', listaParticipantesBD.value);
  } catch (error) {
    console.error('Error al cargar los participantes:', error);
  }
}

export const listaActividades = ref([
  { id: 1, nombre: 'Juntada 1', fecha: '15/05/2025', participantes: 25 },
  { id: 2, nombre: 'Taller de Programación', fecha: '20/06/2025', participantes: 40 },
  { id: 3, nombre: 'Capacitación Vecinal', fecha: '10/09/2025', participantes: 15 },
  { id: 4, nombre: 'Encuentro Juvenil', fecha: '12/11/2025', participantes: 30 },
  { id: 5, nombre: 'Seminario Web', fecha: '05/01/2026', participantes: 50 }
]);