import fs from 'fs'
import express from 'express'
import productRouter from './routers/product.router.js'
import cartsRouter from './routers/cart.router.js'
import ProductManager from './ProductManager.js'

// Ruta al archivo de datos
const path = "./data/products.json"

// Función de inicialización
const init = async () => {
    if (!fs.existsSync(path)) { // Si el archivo no existe
      await fs.promises.writeFile(path, JSON.stringify([], null)); // Crear un archivo vacío
    }
}

init()

const productManager = new ProductManager(path)

// Lectura e interpretación de los datos del archivo
let data = await fs.promises.readFile(path, "utf-8") // Leer el archivo
let products = JSON.parse(data) // Interpretar los datos como objetos JS

// Crear una instancia de la aplicación Express
const app = express()

// Configuración de middleware y rutas
app.use(express.json()) // Procesar JSON en las peticiones
app.use('/', express.static('../public')) // Servir archivos estáticos desde la carpeta public
app.use(express.urlencoded({extended: true})) // Procesar datos de formularios

// Asociar enrutadores a rutas base específicas
app.use('/api/products', productRouter) // Usar el enrutador de productos en /api/products
app.use('/api/carts', cartsRouter) // Usar el enrutador de carritos en /api/carts

// Iniciar el servidor en el puerto 8080
app.listen(8080, () => console.log('Servicio cargado'))