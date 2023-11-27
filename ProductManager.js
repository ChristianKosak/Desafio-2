const fs = require('fs');

class ProductManager {
  constructor(rutaArchivo) {
    this.ruta = rutaArchivo;
  }

  async inicializarArchivo() {
    try {
      await fs.promises.writeFile(this.ruta, '[]', 'utf-8');
         } catch (error) {
      throw new Error('Error al inicializar el archivo: ' + error.message);
        }
  }

  async agregarProducto(producto) {
    try {
      const productos = await this.obtenerProductosDesdeArchivo();
      producto.id = this.generarId(productos);
      productos.push(producto);
      await this.guardarProductosEnArchivo(productos);
      return producto.id;
        } catch (error) {
      throw new Error('Error al agregar el producto: ' + error.message);
        }
  }

  async obtenerProductos() {
    try {
      const productos = await this.obtenerProductosDesdeArchivo();
      return productos;
        } catch (error) {
      throw new Error('Error al obtener los productos: ' + error.message);
        }
  }

  async obtenerProductoPorId(id) {
    try {
      const productos = await this.obtenerProductosDesdeArchivo();
      const productoEncontrado = productos.find(producto => producto.id === id);
      if (!productoEncontrado) {
        throw new Error('El producto con el ID especificado no existe');
      }
      return productoEncontrado;
    } catch (error) {
      throw new Error('Error al obtener el producto por ID: ' + error.message);
    }
  }

  async actualizarProducto(id, productoActualizado) {
    try {
      let productos = await this.obtenerProductosDesdeArchivo();
      const indice = productos.findIndex(producto => producto.id === id);
      if (indice !== -1) {
        productoActualizado.id = id;
        productos[indice] = productoActualizado;
        await this.guardarProductosEnArchivo(productos);
        return true;
      }
      return false;
        } catch (error) {
      throw new Error('Error al actualizar el producto: ' + error.message);
        }
  }

  async eliminarProducto(id) {
    try {
      let productos = await this.obtenerProductosDesdeArchivo();
      const productosFiltrados = productos.filter(producto => producto.id !== id);
      if (productos.length === productosFiltrados.length) {
        throw new Error('El producto con el ID especificado no existe');
      }
      await this.guardarProductosEnArchivo(productosFiltrados);
      return true;
    } catch (error) {
      throw new Error('Error al eliminar el producto: ' + error.message);
    }
  }

  generarId(productos) {
    const maxId = productos.reduce((max, producto) => (producto.id > max ? producto.id : max), 0);
    return maxId + 1;
  }

  async obtenerProductosDesdeArchivo() {
    try {
      const data = await fs.promises.readFile(this.ruta, 'utf8');
      return JSON.parse(data);
        } catch (error) {
      if (error.code === 'ENOENT') {
        
        await this.inicializarArchivo();
        return [];
      }
      throw error;
        }
  }

  async guardarProductosEnArchivo(productos) {
    try {
      await fs.promises.writeFile(this.ruta, JSON.stringify(productos, null, 2));
        } catch (error) {
      throw new Error('Error al guardar los productos en el archivo: ' + error.message);
        }
  }
}

module.exports = ProductManager;




test();

