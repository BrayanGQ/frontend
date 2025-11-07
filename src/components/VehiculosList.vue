<template>
  <div class="page-container">
    <!-- Header - 30% Color Secundario -->
    <header class="main-header">
      <div class="header-content">
        <h1>Sistema de Gestión de Vehículos</h1>
        <p class="header-subtitle">Administra tu flota de manera eficiente</p>
      </div>
    </header>

    <!-- Contenido principal - 60% Color Dominante -->
    <div class="content-wrapper">
      <div class="container">
        <!-- Mensajes -->
        <transition name="fade">
          <div v-if="mensaje" :class="['alert', mensajeTipo]">
            <span class="alert-icon">
              <span v-if="mensajeTipo === 'success'">✓</span>
              <span v-else>!</span>
            </span>
            <span class="alert-text">{{ mensaje }}</span>
          </div>
        </transition>

        <!-- Navegación - 30% Color Secundario -->
        <nav class="navigation">
          <button 
            :class="['nav-button', { active: operacionActual === 'crear' }]"
            @click="cambiarOperacion('crear')"
          >
            <span class="nav-icon">+</span>
            <span class="nav-label">Crear</span>
          </button>
          <button 
            :class="['nav-button', { active: operacionActual === 'buscar' }]"
            @click="cambiarOperacion('buscar')"
          >
            <span class="nav-icon">⌕</span>
            <span class="nav-label">Buscar</span>
          </button>
          <button 
            :class="['nav-button', { active: operacionActual === 'actualizar' }]"
            @click="cambiarOperacion('actualizar')"
          >
            <span class="nav-icon">✎</span>
            <span class="nav-label">Actualizar</span>
          </button>
          <button 
            :class="['nav-button', { active: operacionActual === 'eliminar' }]"
            @click="cambiarOperacion('eliminar')"
          >
            <span class="nav-icon">×</span>
            <span class="nav-label">Eliminar</span>
          </button>
        </nav>

        <!-- Cards de contenido - 60% Color Dominante -->
        <main class="main-section">
          <!-- CREAR -->
          <div v-if="operacionActual === 'crear'" class="card">
            <div class="card-title">
              <h2>Crear Nuevo Vehículo</h2>
              <p>Ingrese la información del vehículo</p>
            </div>
            
            <form @submit.prevent="crearVehiculo" class="form">
              <div class="form-grid">
                <div class="input-group">
                  <label>Color ID</label>
                  <input v-model.number="formularioCrear.idColor" type="number" required />
                </div>

                <div class="input-group">
                  <label>Marca ID</label>
                  <input v-model.number="formularioCrear.idMarca" type="number" required />
                </div>

                <div class="input-group">
                  <label>Modelo (Año)</label>
                  <input v-model.number="formularioCrear.modelo" type="number" required />
                </div>

                <div class="input-group">
                  <label>Chasis</label>
                  <input v-model="formularioCrear.chasis" type="text" required />
                </div>

                <div class="input-group">
                  <label>Motor</label>
                  <input v-model="formularioCrear.motor" type="text" required />
                </div>

                <div class="input-group">
                  <label>Nombre del Vehículo</label>
                  <input v-model="formularioCrear.nombre" type="text" required />
                </div>
              </div>

              <div class="button-group">
                <button type="submit" class="btn btn-accent">
                  Crear Vehículo
                </button>
                <button type="button" @click="limpiarFormularioCrear" class="btn btn-neutral">
                  Limpiar
                </button>
              </div>
            </form>
          </div>

          <!-- BUSCAR -->
          <div v-if="operacionActual === 'buscar'" class="card">
            <div class="card-title">
              <h2>Buscar Vehículo</h2>
              <p>Ingrese el ID del vehículo para consultar</p>
            </div>
            
            <div class="search-container">
              <input 
                v-model.number="idBuscar" 
                type="number" 
                placeholder="Ingrese el ID del vehículo"
                class="search-input"
              />
              <button @click="buscarVehiculo" class="btn btn-accent">
                Buscar
              </button>
            </div>

            <div v-if="vehiculoEncontrado" class="info-card">
              <h3>Información del Vehículo</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">ID del Vehículo</span>
                  <span class="info-value">{{ vehiculoEncontrado.idVehiculo }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Color ID</span>
                  <span class="info-value">{{ vehiculoEncontrado.idColor }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Marca ID</span>
                  <span class="info-value">{{ vehiculoEncontrado.idMarca }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Modelo</span>
                  <span class="info-value">{{ vehiculoEncontrado.modelo }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Chasis</span>
                  <span class="info-value">{{ vehiculoEncontrado.chasis }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Motor</span>
                  <span class="info-value">{{ vehiculoEncontrado.motor }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Nombre</span>
                  <span class="info-value">{{ vehiculoEncontrado.nombre }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Estado</span>
                  <span :class="['badge', vehiculoEncontrado.activo ? 'badge-active' : 'badge-inactive']">
                    {{ vehiculoEncontrado.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- ACTUALIZAR -->
          <div v-if="operacionActual === 'actualizar'" class="card">
            <div class="card-title">
              <h2>Actualizar Vehículo</h2>
              <p>Busque el vehículo y modifique sus datos</p>
            </div>
            
            <div v-if="!vehiculoParaActualizar" class="search-container">
              <input 
                v-model.number="idActualizar" 
                type="number" 
                placeholder="Ingrese el ID del vehículo"
                class="search-input"
              />
              <button @click="buscarParaActualizar" class="btn btn-accent">
                Buscar
              </button>
            </div>

            <div v-if="vehiculoParaActualizar">
              <form @submit.prevent="actualizarVehiculo" class="form">
                <div class="form-grid">
                  <div class="input-group">
                    <label>ID del Vehículo</label>
                    <input v-model.number="formularioActualizar.idVehiculo" type="number" readonly disabled />
                  </div>

                  <div class="input-group">
                    <label>Color ID</label>
                    <input v-model.number="formularioActualizar.idColor" type="number" required />
                  </div>

                  <div class="input-group">
                    <label>Marca ID</label>
                    <input v-model.number="formularioActualizar.idMarca" type="number" required />
                  </div>

                  <div class="input-group">
                    <label>Modelo (Año)</label>
                    <input v-model.number="formularioActualizar.modelo" type="number" required />
                  </div>

                  <div class="input-group">
                    <label>Chasis</label>
                    <input v-model="formularioActualizar.chasis" type="text" required />
                  </div>

                  <div class="input-group">
                    <label>Motor</label>
                    <input v-model="formularioActualizar.motor" type="text" required />
                  </div>

                  <div class="input-group">
                    <label>Nombre del Vehículo</label>
                    <input v-model="formularioActualizar.nombre" type="text" required />
                  </div>

                  <div class="input-group">
                    <label>Estado</label>
                    <select v-model.number="formularioActualizar.activo">
                      <option :value="1">Activo</option>
                      <option :value="0">Inactivo</option>
                    </select>
                  </div>
                </div>

                <div class="button-group">
                  <button type="submit" class="btn btn-accent">
                    Guardar Cambios
                  </button>
                  <button type="button" @click="cancelarActualizacion" class="btn btn-neutral">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- ELIMINAR -->
          <div v-if="operacionActual === 'eliminar'" class="card">
            <div class="card-title">
              <h2>Eliminar Vehículo</h2>
              <p>Busque el vehículo que desea eliminar</p>
            </div>
            
            <div v-if="!vehiculoParaEliminar" class="search-container">
              <input 
                v-model.number="idEliminar" 
                type="number" 
                placeholder="Ingrese el ID del vehículo"
                class="search-input"
              />
              <button @click="buscarParaEliminar" class="btn btn-accent">
                Buscar
              </button>
            </div>

            <div v-if="vehiculoParaEliminar" class="info-card danger">
              <div class="warning-header">
                <h3>¿Está seguro de eliminar este vehículo?</h3>
                <p>Esta acción no se puede deshacer</p>
              </div>
              
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">ID del Vehículo</span>
                  <span class="info-value">{{ vehiculoParaEliminar.idVehiculo }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Color ID</span>
                  <span class="info-value">{{ vehiculoParaEliminar.idColor }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Marca ID</span>
                  <span class="info-value">{{ vehiculoParaEliminar.idMarca }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Modelo</span>
                  <span class="info-value">{{ vehiculoParaEliminar.modelo }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Chasis</span>
                  <span class="info-value">{{ vehiculoParaEliminar.chasis }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Motor</span>
                  <span class="info-value">{{ vehiculoParaEliminar.motor }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Nombre</span>
                  <span class="info-value">{{ vehiculoParaEliminar.nombre }}</span>
                </div>
              </div>

              <div class="button-group">
                <button @click="confirmarEliminacion" class="btn btn-danger">
                  Confirmar Eliminación
                </button>
                <button @click="cancelarEliminacion" class="btn btn-neutral">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { vehiculosService } from '../services/api';

export default {
  name: 'VehiculosList',
  setup() {
    const operacionActual = ref('crear');
    const mensaje = ref('');
    const mensajeTipo = ref('');

    const formularioCrear = ref({
      idColor: 1,
      idMarca: 1,
      modelo: new Date().getFullYear(),
      chasis: '',
      motor: '',
      nombre: '',
      activo: 1
    });

    const idBuscar = ref(null);
    const vehiculoEncontrado = ref(null);

    const idActualizar = ref(null);
    const vehiculoParaActualizar = ref(null);
    const formularioActualizar = ref({
      idVehiculo: null,
      idColor: 1,
      idMarca: 1,
      modelo: new Date().getFullYear(),
      chasis: '',
      motor: '',
      nombre: '',
      activo: 1
    });

    const idEliminar = ref(null);
    const vehiculoParaEliminar = ref(null);

    const cambiarOperacion = (operacion) => {
      operacionActual.value = operacion;
      mensaje.value = '';
      
      vehiculoEncontrado.value = null;
      vehiculoParaActualizar.value = null;
      vehiculoParaEliminar.value = null;
      idBuscar.value = null;
      idActualizar.value = null;
      idEliminar.value = null;
    };

    const crearVehiculo = async () => {
      try {
        const response = await vehiculosService.crear(formularioCrear.value);
        
        if (response.success) {
          mostrarMensaje('Vehículo creado correctamente', 'success');
          limpiarFormularioCrear();
        } else {
          mostrarMensaje(response.message, 'error');
        }
      } catch (error) {
        console.error('Error al crear vehículo:', error);
        mostrarMensaje('Error al crear vehículo: ' + error.message, 'error');
      }
    };

    const limpiarFormularioCrear = () => {
      formularioCrear.value = {
        idColor: 1,
        idMarca: 1,
        modelo: new Date().getFullYear(),
        chasis: '',
        motor: '',
        nombre: '',
        activo: 1
      };
    };

    const buscarVehiculo = async () => {
      if (!idBuscar.value) {
        mostrarMensaje('Por favor ingrese un ID', 'error');
        return;
      }

      try {
        const response = await vehiculosService.obtenerPorId(idBuscar.value);
        
        if (response.success && response.data) {
          vehiculoEncontrado.value = response.data;
          mostrarMensaje('Vehículo encontrado', 'success');
        } else {
          vehiculoEncontrado.value = null;
          mostrarMensaje('Vehículo no encontrado', 'error');
        }
      } catch (error) {
        console.error('Error al buscar vehículo:', error);
        vehiculoEncontrado.value = null;
        mostrarMensaje('Error al buscar vehículo: ' + error.message, 'error');
      }
    };

    const buscarParaActualizar = async () => {
      if (!idActualizar.value) {
        mostrarMensaje('Por favor ingrese un ID', 'error');
        return;
      }

      try {
        const response = await vehiculosService.obtenerPorId(idActualizar.value);
        
        if (response.success && response.data) {
          vehiculoParaActualizar.value = response.data;
          formularioActualizar.value = { ...response.data };
          mostrarMensaje('Vehículo cargado. Puede editar los campos.', 'success');
        } else {
          mostrarMensaje('Vehículo no encontrado', 'error');
        }
      } catch (error) {
        console.error('Error al buscar vehículo:', error);
        mostrarMensaje('Error al buscar vehículo: ' + error.message, 'error');
      }
    };

    const actualizarVehiculo = async () => {
      try {
        const response = await vehiculosService.actualizar(
          formularioActualizar.value.idVehiculo,
          formularioActualizar.value
        );
        
        if (response.success) {
          mostrarMensaje('Vehículo actualizado correctamente', 'success');
          cancelarActualizacion();
        } else {
          mostrarMensaje(response.message, 'error');
        }
      } catch (error) {
        console.error('Error al actualizar vehículo:', error);
        mostrarMensaje('Error al actualizar vehículo: ' + error.message, 'error');
      }
    };

    const cancelarActualizacion = () => {
      vehiculoParaActualizar.value = null;
      idActualizar.value = null;
      formularioActualizar.value = {
        idVehiculo: null,
        idColor: 1,
        idMarca: 1,
        modelo: new Date().getFullYear(),
        chasis: '',
        motor: '',
        nombre: '',
        activo: 1
      };
    };

    const buscarParaEliminar = async () => {
      if (!idEliminar.value) {
        mostrarMensaje('Por favor ingrese un ID', 'error');
        return;
      }

      try {
        const response = await vehiculosService.obtenerPorId(idEliminar.value);
        
        if (response.success && response.data) {
          vehiculoParaEliminar.value = response.data;
          mostrarMensaje('Vehículo encontrado. Confirme la eliminación.', 'success');
        } else {
          mostrarMensaje('Vehículo no encontrado', 'error');
        }
      } catch (error) {
        console.error('Error al buscar vehículo:', error);
        mostrarMensaje('Error al buscar vehículo: ' + error.message, 'error');
      }
    };

    const confirmarEliminacion = async () => {
      try {
        const response = await vehiculosService.eliminar(vehiculoParaEliminar.value.idVehiculo);
        
        if (response.success) {
          mostrarMensaje('Vehículo eliminado correctamente', 'success');
          cancelarEliminacion();
        } else {
          mostrarMensaje(response.message, 'error');
        }
      } catch (error) {
        console.error('Error al eliminar vehículo:', error);
        mostrarMensaje('Error al eliminar vehículo: ' + error.message, 'error');
      }
    };

    const cancelarEliminacion = () => {
      vehiculoParaEliminar.value = null;
      idEliminar.value = null;
    };

    const mostrarMensaje = (msg, tipo) => {
      mensaje.value = msg;
      mensajeTipo.value = tipo;
      setTimeout(() => {
        mensaje.value = '';
      }, 4000);
    };

    return {
      operacionActual,
      mensaje,
      mensajeTipo,
      cambiarOperacion,
      formularioCrear,
      crearVehiculo,
      limpiarFormularioCrear,
      idBuscar,
      vehiculoEncontrado,
      buscarVehiculo,
      idActualizar,
      vehiculoParaActualizar,
      formularioActualizar,
      buscarParaActualizar,
      actualizarVehiculo,
      cancelarActualizacion,
      idEliminar,
      vehiculoParaEliminar,
      buscarParaEliminar,
      confirmarEliminacion,
      cancelarEliminacion
    };
  }
};
</script>

<style scoped>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page-container {
  min-height: 100vh;
  width: 100%;
}

/* ============================================
   30% COLOR SECUNDARIO - HEADER
   ============================================ */
.main-header {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  padding: 2.5rem 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.main-header h1 {
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-subtitle {
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.125rem;
  font-weight: 400;
}

/* ============================================
   60% COLOR DOMINANTE - CONTENIDO PRINCIPAL
   ============================================ */
.content-wrapper {
  background-color: #f1f5f9;
  min-height: calc(100vh - 140px);
  padding: 2rem 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Alertas */
.alert {
  background-color: #ffffff;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.alert-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.alert.success {
  border-left: 4px solid #10b981;
  color: #065f46;
}

.alert.success .alert-icon {
  background-color: #d1fae5;
  color: #10b981;
}

.alert.error {
  border-left: 4px solid #ef4444;
  color: #991b1b;
}

.alert.error .alert-icon {
  background-color: #fee2e2;
  color: #ef4444;
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ============================================
   30% COLOR SECUNDARIO - NAVEGACIÓN
   ============================================ */
.navigation {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.nav-button {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  border: none;
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-icon {
  font-size: 1.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.nav-label {
  font-weight: 600;
  font-size: 1rem;
  color: #ffffff;
}

.nav-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.nav-button.active {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
}

/* ============================================
   60% COLOR DOMINANTE - CARDS
   ============================================ */
.main-section {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-title {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.card-title h2 {
  font-size: 1.75rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.card-title p {
  color: #6b7280;
  font-size: 0.95rem;
}

/* Formularios */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.input-group input,
.input-group select {
  padding: 0.75rem 1rem;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: #ffffff;
  color: #1f2937;
}

.input-group input:focus,
.input-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-group input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Búsqueda */
.search-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-input {
  flex: 1;
  padding: 0.875rem 1rem;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: #ffffff;
  color: #1f2937;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* ============================================
   10% COLOR DE ACENTO - BOTONES PRINCIPALES
   ============================================ */
.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-accent {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: #ffffff;
}

.btn-accent:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
}

.btn-neutral {
  background-color: #6b7280;
  color: #ffffff;
}

.btn-neutral:hover {
  background-color: #4b5563;
  transform: translateY(-2px);
}

.btn-danger {
  background-color: #ef4444;
  color: #ffffff;
}

.btn-danger:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
}

/* Info cards */
.info-card {
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  border: 1px solid #e5e7eb;
}

.info-card.danger {
  background-color: #fef2f2;
  border-color: #fecaca;
}

.info-card h3 {
  font-size: 1.25rem;
  color: #1f2937;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.warning-header {
  margin-bottom: 1.5rem;
}

.warning-header h3 {
  color: #ef4444;
  margin-bottom: 0.5rem;
}

.warning-header p {
  color: #6b7280;
  font-size: 0.95rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-item {
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 1.1rem;
  color: #1f2937;
  font-weight: 600;
}

/* Badges */
.badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.badge-active {
  background-color: #d1fae5;
  color: #065f46;
}

.badge-inactive {
  background-color: #fee2e2;
  color: #991b1b;
}

/* Responsive */
@media (max-width: 768px) {
  .main-header h1 {
    font-size: 1.75rem;
  }

  .header-subtitle {
    font-size: 1rem;
  }

  .navigation {
    grid-template-columns: repeat(2, 1fr);
  }

  .card {
    padding: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .search-container {
    flex-direction: column;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .button-group {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>