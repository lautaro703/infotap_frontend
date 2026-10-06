import { ref } from "vue";

export const listaActividades= ref([
  { id: 1, nombre: 'Taller de Programación Web', fecha: '15/03/2026', participantes: 850 },
  { id: 2, nombre: 'Seminario de Inteligencia Artificial', fecha: '28/03/2026', participantes: 1420 },
  { id: 3, nombre: 'Hackathon Anual 2026', fecha: '10/04/2026', participantes: 2100 },
  { id: 4, nombre: 'Conferencia de Diseño UI/UX', fecha: '22/04/2026', participantes: 960 },
  { id: 5, nombre: 'Encuentro de Desarrollo Mobile', fecha: '05/05/2026', participantes: 730 },
  { id: 6, nombre: 'Charla sobre Arquitectura de Software', fecha: '18/05/2026', participantes: 1150 },
  { id: 7, nombre: 'Workshop de Bases de Datos', fecha: '02/06/2026', participantes: 640 },
  { id: 8, nombre: 'Jornada de Ciberseguridad', fecha: '20/06/2026', participantes: 1250 },
  { id: 9, nombre: 'Expo Tech & Innovación', fecha: '12/07/2026', participantes: 3100 },
  { id: 10, nombre: 'Capacitación en Metodologías Ágiles', fecha: '04/08/2026', participantes: 490 },
])

export const listaParticipantesBD = ref([
  { nombre: 'Lautaro', apellido: 'Vera', dni: '46887829', telefono: '3564368214', correo: 'colo30036@gmail.com', barrio: 'Sáenz Peña', edad: 20, sexo: 'M' },
  { nombre: 'Sofía', apellido: 'Gómez', dni: '42105938', telefono: '3564521098', correo: 'sofi.gomez@gmail.com', barrio: 'Centro', edad: 24, sexo: 'X' },
  { nombre: 'Mateo', apellido: 'Rossi', dni: '44521089', telefono: '3564632145', correo: 'mrossi@hotmail.com', barrio: 'La Milka', edad: 22, sexo: 'M' },
  { nombre: 'Valentina', apellido: 'Pérez', dni: '39852147', telefono: '3564412589', correo: 'valen.perez@gmail.com', barrio: 'Barrio Jardín', edad: 28, sexo: 'F' },
  { nombre: 'Joaquín', apellido: 'Sosa', dni: '45123987', telefono: '3564587963', correo: 'joaco.sosa@outlook.com', barrio: 'Consolata', edad: 21, sexo: 'X' },
  { nombre: 'Camila', apellido: 'Martínez', dni: '41236547', telefono: '3564698741', correo: 'cami.martinez@gmail.com', barrio: 'Las Rosas', edad: 26, sexo: 'F' },
  { nombre: 'Lucas', apellido: 'Fernández', dni: '43987412', telefono: '3564512369', correo: 'lucas.fer@gmail.com', barrio: 'Sáenz Peña', edad: 23, sexo: 'M' },
  { nombre: 'Lucía', apellido: 'Alvarez', dni: '40789654', telefono: '3564478521', correo: 'lu.alvarez@yahoo.com', barrio: 'Centro', edad: 27, sexo: 'X' },
  { nombre: 'Thiago', apellido: 'Benítez', dni: '47123890', telefono: '3564625814', correo: 'thiago.benitez@gmail.com', barrio: 'La Milka', edad: 19, sexo: 'M' },
  { nombre: 'Martina', apellido: 'Díaz', dni: '38456123', telefono: '3564536982', correo: 'martina.diaz@gmail.com', barrio: 'Barrio Jardín', edad: 31, sexo: 'F' },
  { nombre: 'Nicolás', apellido: 'Romero', dni: '41852963', telefono: '3564687123', correo: 'nico.romero@gmail.com', barrio: 'Las Rosas', edad: 25, sexo: 'M' },
  { nombre: 'Agustina', apellido: 'Torres', dni: '43214587', telefono: '3564421876', correo: 'agus.torres@hotmail.com', barrio: 'Las Rosas', edad: 23, sexo: 'F' },
  { nombre: 'Facundo', apellido: 'Mendoza', dni: '45987123', telefono: '3564598432', correo: 'facu.mendoza@gmail.com', barrio: 'Sáenz Peña', edad: 20, sexo: 'M' },
  { nombre: 'Florencia', apellido: 'Ruiz', dni: '39123852', telefono: '3564432987', correo: 'flor.ruiz@gmail.com', barrio: 'Centro', edad: 29, sexo: 'X' },
  { nombre: 'Gonzalo', apellido: 'Castro', dni: '44238912', telefono: '3564612874', correo: 'gonza.castro@outlook.com', barrio: 'La Milka', edad: 22, sexo: 'M' },
  { nombre: 'Micaela', apellido: 'Acosta', dni: '42987154', telefono: '3564578123', correo: 'mica.acosta@gmail.com', barrio: 'Barrio Jardín', edad: 24, sexo: 'F' },
  { nombre: 'Julian', apellido: 'Juárez', dni: '46123984', telefono: '3564643218', correo: 'juli.juarez@yahoo.com', barrio: 'Consolata', edad: 19, sexo: 'M' },
  { nombre: 'Delfina', apellido: 'Giménez', dni: '40321987', telefono: '3564487213', correo: 'delfi.gimenez@gmail.com', barrio: 'Las Rosas', edad: 27, sexo: 'F' },
  { nombre: 'Enzo', apellido: 'Molina', dni: '43872145', telefono: '3564523871', correo: 'enzo.molina@gmail.com', barrio: 'Sáenz Peña', edad: 23, sexo: 'M' },
  { nombre: 'Victoria', apellido: 'Peralta', dni: '41982374', telefono: '3564619823', correo: 'vicky.peralta@hotmail.com', barrio: 'Centro', edad: 25, sexo: 'F' }
]);