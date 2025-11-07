<template>
  <div class="vehiculos-container">
    <h1>🚗 Gestión de Vehículos</h1>

    <!-- Mensajes -->
    <div v-if="mensaje" :class="['mensaje', mensajeTipo]">
      {{ mensaje }}
    </div>

    <!-- Selector de Operación -->
    <div class="operaciones-tabs">
      <button 
        :class="['tab-btn', { active: operacionActual === 'crear' }]"
        @click="cambiarOperacion('crear')"
      >
        ➕ Crear
      </button>
      <button 
        :class="['tab-btn', { active: operacionActual === 'buscar' }]"
        @click="cambiarOperacion('buscar')"
      >
        🔍 Buscar
      </button>
      <button 
        :class="['tab-btn', { active: operacionActual === 'actualizar' }]"
        @click="cambiarOperacion('actualizar')"
      >
        ✏️ Actualizar
      </button>
      <button 
        :class="['tab-btn', { active: operacionActual === 'eliminar' }]"
        @click="cambiarOperacion('eliminar')"
      >
        🗑️ Eliminar
      </button>
    </div>

    <!-- CREAR VEHÍCULO -->
    <div v-if="operacionActual === 'crear'" class="operacion-card">
      <h2>➕ Crear Nuevo Vehículo</h2>
      <form @submit.prevent="crearVehiculo">
        <div class="form-row">
          <div class="form-group">
            <label>Color ID: *</label>
            <input v-model.number="formularioCrear.idColor" type="number" required />
          </div>

          <div class="form-group">
            <label>Marca ID: *</label>
            <input v-model.number="formularioCrear.idMarca" type="number" required />
          </div>

          <div class="form-group">
            <label>Modelo (Año): *</label>
            <input v-model.number="formularioCrear.modelo" type="number" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Chasis: *</label>
            <input v-model="formularioCrear.chasis" type="text" required />
          </div>

          <div class="form-group">
            <label>Motor: *</label>
            <input v-model="formularioCrear.motor" type="text" required />
          </div>

          <div class="form-group">
            <label>Nombre: *</label>
            <input v-model="formularioCrear.nombre" type="text" required />
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            ➕ Crear Vehículo
          </button>
          <button type="button" @click="limpiarFormularioCrear" class="btn btn-secondary">
            🔄 Limpiar
          </button>
        </div>
      </form>
    </div>

    <!-- BUSCAR VEHÍCULO -->
    <div v-if="operacionActual === 'buscar'" class="operacion-card">
      <h2>🔍 Buscar Vehículo</h2>
      
      <div class="busqueda-section">
        <div class="form-group-inline">
          <label>Ingrese el ID del vehículo:</label>
          <input v-model.number="idBuscar" type="number" placeholder="Ej: 1" />
          <button @click="buscarVehiculo" class="btn btn-primary">
            🔍 Buscar
          </button>
        </div>
      </div>

      <div v-if="vehiculoEncontrado" class="info-card">
        <h3>📋 Información del Vehículo</h3>
        <div class="info-grid">
          <div class="info-item">
            <strong>ID:</strong>
            <span>{{ vehiculoEncontrado.idVehiculo }}</span>
          </div>
          <div class="info-item">
            <strong>Color ID:</strong>
            <span>{{ vehiculoEncontrado.idColor }}</span>
          </div>
          <div class="info-item">
            <strong>Marca ID:</strong>
            <span>{{ vehiculoEncontrado.idMarca }}</span>
          </div>
          <div class="info-item">
            <strong>Modelo:</strong>
            <span>{{ vehiculoEncontrado.modelo }}</span>
          </div>
          <div class="info-item">
            <strong>Chasis:</strong>
            <span>{{ vehiculoEncontrado.chasis }}</span>
          </div>
          <div class="info-item">
            <strong>Motor:</strong>
            <span>{{ vehiculoEncontrado.motor }}</span>
          </div>
          <div class="info-item">
            <strong>Nombre:</strong>
            <span>{{ vehiculoEncontrado.nombre }}</span>
          </div>
          <div class="info-item">
            <strong>Estado:</strong>
            <span :class="['badge', vehiculoEncontrado.activo ? 'activo' : 'inactivo']">
              {{ vehiculoEncontrado.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ACTUALIZAR VEHÍCULO -->
    <div v-if="operacionActual === 'actualizar'" class="operacion-card">
      <h2>✏️ Actualizar Vehículo</h2>
      
      <div v-if="!vehiculoParaActualizar" class="busqueda-section">
        <div class="form-group-inline">
          <label>Ingrese el ID del vehículo a actualizar:</label>
          <input v-model.number="idActualizar" type="number" placeholder="Ej: 1" />
          <button @click="buscarParaActualizar" class="btn btn-primary">
            🔍 Buscar
          </button>
        </div>
      </div>

      <div v-if="vehiculoParaActualizar">
        <form @submit.prevent="actualizarVehiculo">
          <div class="form-row">
            <div class="form-group">
              <label>ID Vehículo:</label>
              <input v-model.number="formularioActualizar.idVehiculo" type="number" readonly disabled />
            </div>

            <div class="form-group">
              <label>Color ID: *</label>
              <input v-model.number="formularioActualizar.idColor" type="number" required />
            </div>

            <div class="form-group">
              <label>Marca ID: *</label>
              <input v-model.number="formularioActualizar.idMarca" type="number" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Modelo (Año): *</label>
              <input v-model.number="formularioActualizar.modelo" type="number" required />
            </div>

            <div class="form-group">
              <label>Chasis: *</label>
              <input v-model="formularioActualizar.chasis" type="text" required />
            </div>

            <div class="form-group">
              <label>Motor: *</label>
              <input v-model="formularioActualizar.motor" type="text" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Nombre: *</label>
              <input v-model="formularioActualizar.nombre" type="text" required />
            </div>

            <div class="form-group">
              <label>Estado:</label>
              <select v-model.number="formularioActualizar.activo">
                <option :value="1">Activo</option>
                <option :value="0">Inactivo</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">
              ✅ Guardar Cambios
            </button>
            <button type="button" @click="cancelarActualizacion" class="btn btn-secondary">
              ❌ Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ELIMINAR VEHÍCULO -->
    <div v-if="operacionActual === 'eliminar'" class="operacion-card">
      <h2>🗑️ Eliminar Vehículo</h2>
      
      <div v-if="!vehiculoParaEliminar" class="busqueda-section">
        <div class="form-group-inline">
          <label>Ingrese el ID del vehículo a eliminar:</label>
          <input v-model.number="idEliminar" type="number" placeholder="Ej: 1" />
          <button @click="buscarParaEliminar" class="btn btn-primary">
            🔍 Buscar
          </button>
        </div>
      </div>

      <div v-if="vehiculoParaEliminar" class="info-card danger">
        <h3>⚠️ ¿Está seguro de eliminar este vehículo?</h3>
        <div class="info-grid">
          <div class="info-item">
            <strong>ID:</strong>
            <span>{{ vehiculoParaEliminar.idVehiculo }}</span>
          </div>
          <div class="info-item">
            <strong>Color ID:</strong>
            <span>{{ vehiculoParaEliminar.idColor }}</span>
          </div>
          <div class="info-item">
            <strong>Marca ID:</strong>
            <span>{{ vehiculoParaEliminar.idMarca }}</span>
          </div>
          <div class="info-item">
            <strong>Modelo:</strong>
            <span>{{ vehiculoParaEliminar.modelo }}</span>
          </div>
          <div class="info-item">
            <strong>Chasis:</strong>
            <span>{{ vehiculoParaEliminar.chasis }}</span>
          </div>
          <div class="info-item">
            <strong>Motor:</strong>
            <span>{{ vehiculoParaEliminar.motor }}</span>
          </div>
          <div class="info-item">
            <strong>Nombre:</strong>
            <span>{{ vehiculoParaEliminar.nombre }}</span>
          </div>
        </div>

        <div class="form-actions">
          <button @click="confirmarEliminacion" class="btn btn-delete">
            🗑️ Sí, Eliminar
          </button>
          <button @click="cancelarEliminacion" class="btn btn-secondary">
            ❌ Cancelar
          </button>
        </div>
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

    // CREAR
    const formularioCrear = ref({
      idColor: 1,
      idMarca: 1,
      modelo: new Date().getFullYear(),
      chasis: '',
      motor: '',
      nombre: '',
      activo: 1
    });

    // BUSCAR
    const idBuscar = ref(null);
    const vehiculoEncontrado = ref(null);

    // ACTUALIZAR
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

    // ELIMINAR
    const idEliminar = ref(null);
    const vehiculoParaEliminar = ref(null);

    // Cambiar operación
    const cambiarOperacion = (operacion) => {
      operacionActual.value = operacion;
      mensaje.value = '';
      
      // Limpiar estados
      vehiculoEncontrado.value = null;
      vehiculoParaActualizar.value = null;
      vehiculoParaEliminar.value = null;
      idBuscar.value = null;
      idActualizar.value = null;
      idEliminar.value = null;
    };

    // CREAR VEHÍCULO
    const crearVehiculo = async () => {
      try {
        const response = await vehiculosService.crear(formularioCrear.value);
        
        if (response.success) {
          mostrarMensaje('✅ Vehículo creado correctamente', 'success');
          limpiarFormularioCrear();
        } else {
          mostrarMensaje('❌ ' + response.message, 'error');
        }
      } catch (error) {
        console.error('Error al crear vehículo:', error);
        mostrarMensaje('❌ Error al crear vehículo: ' + error.message, 'error');
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

    // BUSCAR VEHÍCULO
    const buscarVehiculo = async () => {
      if (!idBuscar.value) {
        mostrarMensaje('⚠️ Por favor ingrese un ID', 'error');
        return;
      }

      try {
        const response = await vehiculosService.obtenerPorId(idBuscar.value);
        
        if (response.success && response.data) {
          vehiculoEncontrado.value = response.data;
          mostrarMensaje('✅ Vehículo encontrado', 'success');
        } else {
          vehiculoEncontrado.value = null;
          mostrarMensaje('❌ Vehículo no encontrado', 'error');
        }
      } catch (error) {
        console.error('Error al buscar vehículo:', error);
        vehiculoEncontrado.value = null;
        mostrarMensaje('❌ Error al buscar vehículo: ' + error.message, 'error');
      }
    };

    // ACTUALIZAR VEHÍCULO
    const buscarParaActualizar = async () => {
      if (!idActualizar.value) {
        mostrarMensaje('⚠️ Por favor ingrese un ID', 'error');
        return;
      }

      try {
        const response = await vehiculosService.obtenerPorId(idActualizar.value);
        
        if (response.success && response.data) {
          vehiculoParaActualizar.value = response.data;
          formularioActualizar.value = { ...response.data };
          mostrarMensaje('✅ Vehículo cargado. Puede editar los campos.', 'success');
        } else {
          mostrarMensaje('❌ Vehículo no encontrado', 'error');
        }
      } catch (error) {
        console.error('Error al buscar vehículo:', error);
        mostrarMensaje('❌ Error al buscar vehículo: ' + error.message, 'error');
      }
    };

    const actualizarVehiculo = async () => {
      try {
        const response = await vehiculosService.actualizar(
          formularioActualizar.value.idVehiculo,
          formularioActualizar.value
        );
        
        if (response.success) {
          mostrarMensaje('✅ Vehículo actualizado correctamente', 'success');
          cancelarActualizacion();
        } else {
          mostrarMensaje('❌ ' + response.message, 'error');
        }
      } catch (error) {
        console.error('Error al actualizar vehículo:', error);
        mostrarMensaje('❌ Error al actualizar vehículo: ' + error.message, 'error');
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

    // ELIMINAR VEHÍCULO
    const buscarParaEliminar = async () => {
      if (!idEliminar.value) {
        mostrarMensaje('⚠️ Por favor ingrese un ID', 'error');
        return;
      }

      try {
        const response = await vehiculosService.obtenerPorId(idEliminar.value);
        
        if (response.success && response.data) {
          vehiculoParaEliminar.value = response.data;
          mostrarMensaje('⚠️ Vehículo encontrado. Confirme la eliminación.', 'success');
        } else {
          mostrarMensaje('❌ Vehículo no encontrado', 'error');
        }
      } catch (error) {
        console.error('Error al buscar vehículo:', error);
        mostrarMensaje('❌ Error al buscar vehículo: ' + error.message, 'error');
      }
    };

    const confirmarEliminacion = async () => {
      try {
        const response = await vehiculosService.eliminar(vehiculoParaEliminar.value.idVehiculo);
        
        if (response.success) {
          mostrarMensaje('✅ Vehículo eliminado correctamente', 'success');
          cancelarEliminacion();
        } else {
          mostrarMensaje('❌ ' + response.message, 'error');
        }
      } catch (error) {
        console.error('Error al eliminar vehículo:', error);
        mostrarMensaje('❌ Error al eliminar vehículo: ' + error.message, 'error');
      }
    };

    const cancelarEliminacion = () => {
      vehiculoParaEliminar.value = null;
      idEliminar.value = null;
    };

    // Mostrar mensaje
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
      // Crear
      formularioCrear,
      crearVehiculo,
      limpiarFormularioCrear,
      // Buscar
      idBuscar,
      vehiculoEncontrado,
      buscarVehiculo,
      // Actualizar
      idActualizar,
      vehiculoParaActualizar,
      formularioActualizar,
      buscarParaActualizar,
      actualizarVehiculo,
      cancelarActualizacion,
      // Eliminar
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
.vehiculos-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5em;
}

h2 {
  color: #34495e;
  margin-bottom: 20px;
  font-size: 1.5em;
}

h3 {
  color: #2c3e50;
  margin-bottom: 15px;
}

/* Mensajes */
.mensaje {
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 600;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mensaje.success {
  background-color: #d4edda;
  color: #155724;
  border: 2px solid #c3e6cb;
}

.mensaje.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 2px solid #f5c6cb;
}

/* Tabs de operaciones */
.operaciones-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.tab-btn {
  flex: 1;
  min-width: 150px;
  padding: 15px 20px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s;
}

.tab-btn:hover {
  border-color: #42b983;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.tab-btn.active {
  background: linear-gradient(135deg, #42b983 0%, #359268 100%);
  color: white;
  border-color: #42b983;
}

/* Cards */
.operacion-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Sección de búsqueda */
.busqueda-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-group-inline {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.form-group-inline label {
  font-weight: bold;
  color: #34495e;
}

.form-group-inline input {
  flex: 1;
  min-width: 150px;
  padding: 10px 15px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.form-group-inline input:focus {
  outline: none;
  border-color: #42b983;
}

/* Formulario */
.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 8px;
  color: #34495e;
}

.form-group input,
.form-group select {
  padding: 12px 15px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #42b983;
}

.form-group input:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 25px;
  flex-wrap: wrap;
}

/* Botones */
.btn {
  padding: 12px 25px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #42b983 0%, #359268 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(66, 185, 131, 0.3);
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
}

/* Card de información */
.info-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 25px;
  margin-top: 20px;
  border: 2px solid #dee2e6;
}

.info-card.danger {
  background: #fff5f5;
  border-color: #f8d7da;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.info-item strong {
  color: #495057;
}

.info-item span {
  color: #212529;
  font-weight: 500;
}

.badge {
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 13px;
  font-weight: bold;
}

.badge.activo {
  background-color: #d4edda;
  color: #155724;
}

.badge.inactivo {
  background-color: #f8d7da;
  color: #721c24;
}

/* Responsive */
@media (max-width: 768px) {
  .operaciones-tabs {
    flex-direction: column;
  }
  
  .tab-btn {
    width: 100%;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-group-inline {
    flex-direction: column;
    align-items: stretch;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>