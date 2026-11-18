
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="mostrar" class="notificacion-fondo" @keydown.esc="cerrar">
        <section class="notificacion-card":class="`tipo-${tipo}`" role="dialog" aria-modal="true" :aria-labelledby="'notificacion-titulo'">
          <div class="icono-circulo">
            <span v-if="tipo === 'confirmacion'" class="material-icons"> help_outline </span>
            <svg v-else-if="tipo === 'exito'" class="icono-svg" viewBox="0 0 52 52" aria-hidden="true">
              <path d="M13 27 L22 36 L40 17" />
            </svg>
            <svg v-else class="icono-svg" viewBox="0 0 52 52" aria-hidden="true">
              <path d="M17 17 L35 35 M35 17 L17 35" />
            </svg>
          </div>
          <h2 id="notificacion-titulo">
            {{ titulo }}
          </h2>
          <p>{{ mensaje }}</p>
          <div class="notificacion-acciones">
            <template v-if="tipo === 'confirmacion'">
              <button class="boton-secundario" :disabled="procesando" @click="cerrar">
                {{ textoCancelar }}
              </button>
              <button class="boton-principal":disabled="procesando" @click="$emit('confirmar')">
                {{ procesando ? 'Procesando...' : textoBoton }}
              </button>
            </template>
            <button v-else class="boton-principal" @click="accionBoton === 'confirmar' ? $emit('confirmar') : cerrar()">
              {{ textoBoton }}
            </button>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  mostrar: {
    type: Boolean,
    default: false
  },
  tipo: {
    type: String,
    default: 'exito',
    validator: (valor) =>
      ['confirmacion', 'exito', 'error'].includes(valor)
  },
  accionBoton: {
    type: String,
    default: 'cerrar'
  },
  titulo: {
    type: String,
    default: 'Operación exitosa'
  },
  mensaje: {
    type: String,
    default: 'La operación se realizó correctamente.'
  },
  textoBoton: {
    type: String,
    default: 'Volver'
  },
  textoCancelar: {
    type: String,
    default: 'Cancelar'
  },
  accionBoton: {
    type: String,
    default: 'cerrar'
  },
  procesando: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['cerrar', 'confirmar'])

function cerrar() {
  emit('cerrar')
}
</script>

<style scoped>
.notificacion-fondo {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(20, 25, 22, 0.25);
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
}

.notificacion-card {
  --color: #7bd321;
  width: 100%;
  max-width: 350px;
  padding: 32px 26px 26px;
  text-align: center;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.tipo-confirmacion {
  --color: #69c91b;
}

.tipo-exito {
  --color: #7bd321;
}

.tipo-error {
  --color: #f04444;
}

.icono-circulo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 88px;
  margin: 0 auto 22px;
  color: #fff;
  background: var(--color);
  border-radius: 50%;
  animation: aparecer-icono 0.35s ease-out;
}

.icono-circulo .material-icons {
  font-size: 48px;
}

.icono-svg {
  width: 56px;
  height: 56px;
  fill: none;
  stroke: currentColor;
  stroke-width: 5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.notificacion-card h2 {
  margin: 0 0 10px;
  color: #202020;
  font-size: 23px;
  font-weight: 750;
  letter-spacing: -0.5px;
}

.notificacion-card p {
  margin: 0 auto 25px;
  max-width: 270px;
  color: #777;
  font-size: 14px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.notificacion-acciones {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.notificacion-acciones button {
  min-width: 110px;
  min-height: 42px;
  padding: 10px 18px;
  border: 0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 650;
  cursor: pointer;
  transition: transform 0.2s, filter 0.2s;
}

.boton-principal {
  color: #fff;
  background: var(--color);
}

.boton-secundario {
  color: #555;
  background: #ededed;
}

.notificacion-acciones button:hover:not(:disabled) {
  filter: brightness(0.95);
  transform: translateY(-1px);
}

.notificacion-acciones button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .notificacion-card,
.modal-leave-active .notificacion-card {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .notificacion-card,
.modal-leave-to .notificacion-card {
  transform: scale(0.94) translateY(8px);
}

@keyframes aparecer-icono {
  from {
    opacity: 0;
    transform: scale(0.65);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 380px) {
  .notificacion-card {
    padding: 26px 18px 20px;
  }

  .notificacion-acciones button {
    min-width: 0;
    flex: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active,
  .modal-enter-active .notificacion-card,
  .modal-leave-active .notificacion-card {
    transition: none;
  }

  .icono-circulo {
    animation: none;
  }
}
</style>

