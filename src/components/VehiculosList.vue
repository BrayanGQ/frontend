<template>
  <div class="app">
    <!-- Header Simple -->
    <div class="header">
      <h1>Sistema de Ventas</h1>
    </div>

    <div class="container">
      <!-- Mensajes -->
      <div v-if="mensaje" :class="['mensaje', mensajeTipo]">
        {{ mensaje }}
      </div>

      <!-- Card Principal -->
      <div class="card">
        <h2>Nueva Venta</h2>

        <!-- Información del Cliente -->
        <div class="seccion">
          <h3>Datos del Cliente</h3>
          <div class="fila">
            <div class="campo">
              <label>Sucursal:</label>
              <select v-model.number="venta.idSucursal" required>
                <option value="">-- Seleccione --</option>
                <option v-for="s in sucursales" :key="s.id" :value="s.id">
                  {{ s.nombre }}
                </option>
              </select>
            </div>

            <div class="campo">
              <label>Fecha:</label>
              <input v-model="venta.fecha" type="date" required />
            </div>

            <div class="campo">
              <label>NIT:</label>
              <input v-model="venta.nit" type="text" placeholder="CF" required />
            </div>

            <div class="campo">
              <label>Nombre:</label>
              <input v-model="venta.nombre" type="text" placeholder="Nombre del cliente" required />
            </div>
          </div>
        </div>

        <!-- Selección de Productos -->
        <div class="seccion">
          <h3>Agregar Productos</h3>
          <div class="fila">
            <div class="campo">
              <label>Producto:</label>
              <select v-model.number="productoSeleccionado" @change="onProductoChange">
                <option value="">-- Seleccione --</option>
                <option v-for="p in productos" :key="p.id" :value="p.id">
                  {{ p.nombre }} (Stock: {{ p.stock }})
                </option>
              </select>
            </div>

            <div class="campo" v-if="productoActual">
              <label>Precio:</label>
              <div class="precio">Q {{ productoActual.precioUnitario.toFixed(2) }}</div>
            </div>

            <div class="campo">
              <label>Cantidad:</label>
              <input 
                v-model.number="cantidad" 
                type="number" 
                min="1" 
                :max="productoActual?.stock || 999"
              />
            </div>

            <div class="campo">
              <label>&nbsp;</label>
              <button 
                @click="agregarProducto" 
                class="btn btn-agregar"
                :disabled="!productoSeleccionado || !cantidad"
              >
                + Agregar
              </button>
            </div>
          </div>
        </div>

        <!-- Tabla de Productos -->
        <div class="seccion" v-if="venta.detalles.length > 0">
          <h3>Productos Agregados</h3>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(d, i) in venta.detalles" :key="i">
                <td>{{ obtenerNombreProducto(d.idProducto) }}</td>
                <td>Q {{ d.precio.toFixed(2) }}</td>
                <td>{{ d.cantidad }}</td>
                <td>Q {{ (d.precio * d.cantidad).toFixed(2) }}</td>
                <td>
                  <button @click="eliminarProducto(i)" class="btn-eliminar">×</button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3"><strong>TOTAL:</strong></td>
                <td colspan="2"><strong>Q {{ calcularTotal().toFixed(2) }}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Botones -->
        <div class="acciones">
          <button 
            @click="guardarVenta" 
            class="btn btn-guardar"
            :disabled="venta.detalles.length === 0 || guardando"
          >
            {{ guardando ? 'Guardando...' : 'Guardar Venta' }}
          </button>
          <button @click="limpiarFormulario" class="btn btn-cancelar">
            Cancelar
          </button>
        </div>
      </div>

      <!-- Resultado -->
      <div v-if="ventaCreada" class="resultado">
        <h2>✓ Venta Creada</h2>
        <p>ID de Venta: <strong>{{ ventaCreada.ventaId }}</strong></p>
        <p>Total: <strong>Q {{ calcularTotal().toFixed(2) }}</strong></p>
        <div class="acciones">
          <button @click="descargarPDF" class="btn btn-pdf">📄 Descargar PDF</button>
          <button @click="verPDF" class="btn btn-ver">👁️ Ver PDF</button>
          <button @click="nuevaVenta" class="btn btn-nueva">Nueva Venta</button>
        </div>
      </div>
    </div>

    <!-- Visor PDF -->
    <div v-if="mostrarPDF" class="modal" @click="cerrarPDF">
      <div class="modal-contenido" @click.stop>
        <button @click="cerrarPDF" class="modal-cerrar">×</button>
        <iframe :src="pdfUrl"></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ventasService } from '../services/api';

export default {
  name: 'VehiculosList',
  setup() {
    const mensaje = ref('');
    const mensajeTipo = ref('');
    const guardando = ref(false);
    const sucursales = ref([]);
    const productos = ref([]);
    const productoSeleccionado = ref('');
    const productoActual = ref(null);
    const cantidad = ref(1);
    const ventaCreada = ref(null);
    const pdfBase64 = ref('');
    const mostrarPDF = ref(false);
    const pdfUrl = ref('');

    const venta = ref({
      idSucursal: '',
      fecha: new Date().toISOString().split('T')[0],
      nit: '',
      nombre: '',
      detalles: []
    });

    const cargarSucursales = async () => {
      try {
        const response = await ventasService.obtenerSucursales();
        if (response.success) sucursales.value = response.data;
      } catch (error) {
        mostrarMensaje('Error al cargar sucursales', 'error');
      }
    };

    const cargarProductos = async () => {
      try {
        const response = await ventasService.obtenerProductos();
        if (response.success) productos.value = response.data;
      } catch (error) {
        mostrarMensaje('Error al cargar productos', 'error');
      }
    };

    const onProductoChange = () => {
      if (productoSeleccionado.value) {
        productoActual.value = productos.value.find(p => p.id === productoSeleccionado.value);
        cantidad.value = 1;
      } else {
        productoActual.value = null;
      }
    };

    const agregarProducto = () => {
      if (!productoSeleccionado.value || !cantidad.value) {
        mostrarMensaje('Seleccione producto y cantidad', 'error');
        return;
      }

      if (cantidad.value > productoActual.value.stock) {
        mostrarMensaje('Cantidad excede el stock', 'error');
        return;
      }

      const existe = venta.value.detalles.find(d => d.idProducto === productoSeleccionado.value);
      if (existe) {
        mostrarMensaje('Producto ya agregado', 'error');
        return;
      }

      venta.value.detalles.push({
        idProducto: productoSeleccionado.value,
        cantidad: cantidad.value,
        precio: productoActual.value.precioUnitario
      });

      productoSeleccionado.value = '';
      productoActual.value = null;
      cantidad.value = 1;
      mostrarMensaje('Producto agregado', 'success');
    };

    const eliminarProducto = (index) => {
      venta.value.detalles.splice(index, 1);
      mostrarMensaje('Producto eliminado', 'success');
    };

    const obtenerNombreProducto = (id) => {
      const producto = productos.value.find(p => p.id === id);
      return producto ? producto.nombre : 'Desconocido';
    };

    const calcularTotal = () => {
      return venta.value.detalles.reduce((total, d) => total + (d.precio * d.cantidad), 0);
    };

    const guardarVenta = async () => {
      if (venta.value.detalles.length === 0) {
        mostrarMensaje('Agregue al menos un producto', 'error');
        return;
      }

      try {
        guardando.value = true;
        const response = await ventasService.crearVenta(venta.value);
        
        if (response.success) {
          ventaCreada.value = response.data;
          pdfBase64.value = response.data.facturaPdf;
          mostrarMensaje('Venta creada exitosamente', 'success');
        } else {
          mostrarMensaje(response.message, 'error');
        }
      } catch (error) {
        mostrarMensaje('Error: ' + error.message, 'error');
      } finally {
        guardando.value = false;
      }
    };

    const descargarPDF = () => {
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${pdfBase64.value}`;
      link.download = `factura_${ventaCreada.value.ventaId}.pdf`;
      link.click();
    };

    const verPDF = () => {
      pdfUrl.value = `data:application/pdf;base64,${pdfBase64.value}`;
      mostrarPDF.value = true;
    };

    const cerrarPDF = () => {
      mostrarPDF.value = false;
      pdfUrl.value = '';
    };

    const nuevaVenta = () => {
      limpiarFormulario();
      ventaCreada.value = null;
      pdfBase64.value = '';
    };

    const limpiarFormulario = () => {
      venta.value = {
        idSucursal: '',
        fecha: new Date().toISOString().split('T')[0],
        nit: '',
        nombre: '',
        detalles: []
      };
      productoSeleccionado.value = '';
      productoActual.value = null;
      cantidad.value = 1;
    };

    const mostrarMensaje = (msg, tipo) => {
      mensaje.value = msg;
      mensajeTipo.value = tipo;
      setTimeout(() => mensaje.value = '', 3000);
    };

    onMounted(() => {
      cargarSucursales();
      cargarProductos();
    });

    return {
      mensaje, mensajeTipo, guardando, sucursales, productos,
      productoSeleccionado, productoActual, cantidad, venta,
      ventaCreada, pdfBase64, mostrarPDF, pdfUrl,
      onProductoChange, agregarProducto, eliminarProducto,
      obtenerNombreProducto, calcularTotal, guardarVenta,
      nuevaVenta, limpiarFormulario, descargarPDF, verPDF, cerrarPDF
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

.app {
  min-height: 100vh;
  background: #f5f5f5;
}

/* Header */
.header {
  background: #3b82f6;
  color: white;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header h1 {
  font-size: 2rem;
  font-weight: 600;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Mensajes */
.mensaje {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  font-weight: 500;
}

.mensaje.success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #10b981;
}

.mensaje.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #ef4444;
}

/* Card */
.card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.card h2 {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

/* Secciones */
.seccion {
  margin-bottom: 2rem;
}

.seccion h3 {
  font-size: 1.1rem;
  color: #374151;
  margin-bottom: 1rem;
  font-weight: 600;
}

/* Fila */
.fila {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

/* Campos */
.campo {
  display: flex;
  flex-direction: column;
}

.campo label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.3rem;
}

.campo input,
.campo select {
  padding: 0.6rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  color: #1f2937;
}

.campo input:focus,
.campo select:focus {
  outline: none;
  border-color: #3b82f6;
}

/* Precio */
.precio {
  padding: 0.6rem;
  background: #10b981;
  color: white;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: 700;
  text-align: center;
}

/* Tabla */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

thead {
  background: #3b82f6;
  color: white;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

tbody tr:hover {
  background: #f9fafb;
}

tfoot {
  background: #f3f4f6;
  font-weight: 600;
}

/* Botones */
.btn {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-agregar {
  background: #10b981;
  color: white;
}

.btn-agregar:hover:not(:disabled) {
  background: #059669;
}

.btn-guardar {
  background: #3b82f6;
  color: white;
}

.btn-guardar:hover:not(:disabled) {
  background: #2563eb;
}

.btn-cancelar {
  background: #6b7280;
  color: white;
}

.btn-cancelar:hover {
  background: #4b5563;
}

.btn-eliminar {
  background: #ef4444;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
}

.btn-eliminar:hover {
  background: #dc2626;
}

.btn-pdf {
  background: #3b82f6;
  color: white;
}

.btn-ver {
  background: #8b5cf6;
  color: white;
}

.btn-nueva {
  background: #10b981;
  color: white;
}

/* Acciones */
.acciones {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

/* Resultado */
.resultado {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
  border-left: 4px solid #10b981;
}

.resultado h2 {
  color: #10b981;
  margin-bottom: 1rem;
}

.resultado p {
  font-size: 1.1rem;
  margin: 0.5rem 0;
  color: #374151;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-contenido {
  background: white;
  width: 90%;
  height: 90%;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.modal-cerrar {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ef4444;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
}

.modal-contenido iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* Responsive */
@media (max-width: 768px) {
  .header h1 {
    font-size: 1.5rem;
  }

  .fila {
    grid-template-columns: 1fr;
  }

  .acciones {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  table {
    font-size: 0.85rem;
  }

  th, td {
    padding: 0.5rem;
  }
}
</style>