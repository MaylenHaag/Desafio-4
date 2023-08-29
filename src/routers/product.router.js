import { Router } from 'express'
import ProductManager from '../ProductManager.js'

// Creación de un enrutador utilizando Express
const productRouter = Router()

const productManager = new ProductManager('./data/products.json')

//localhost:8080/products
// Ruta GET para obtener todos los productos
productRouter.get('/', async (req, res) => {
    // Llamada asincrónica para obtener todos los productos
    const result = await productManager.getProducts()
    const limit = req.query.limit 
    // Comprobación si la respuesta es una cadena (mensaje de error)
    if (typeof result == 'string') {
        // División del mensaje de error en código de estado y mensaje
        const error = result.split(' ')
        const errorMessage = error.slice(1).join(' ')
        // Respondiendo con el código de estado y el mensaje de error en formato JSON
        return res.status(parseInt(error[0].slice(1,4))).json({ error: errorMessage })
    }
    // Respondiendo con un código de estado 200 y una lista limitada de productos
    res.status(200).json({ status: 'success', payload: result.slice(0, limit)})
})

//localhost:8080/products/:pid
// Ruta GET para obtener un producto por su ID
productRouter.get('/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid);
    // Llamada asincrónica para obtener un producto por su ID
    const result = await productManager.getProductById(pid)

    if (typeof result == 'string') {
        const error = result.split(' ')
        const errorMessage = error.slice(1).join(' ')

        return res.status(parseInt(error[0].slice(1,4))).json({ error: errorMessage })
    }
    // Respondiendo con un código de estado 200 y los detalles del producto
    res.status(200).json({ status: 'success', payload: result })
})

// Ruta POST para agregar un nuevo producto
productRouter.post('/', async (req, res) => {
    // Obteniendo el producto desde el body
    const product = req.body
    // Llamada asincrónica para agregar un producto
    const result = await productManager.addProduct(product)

    if (typeof result == 'string') {
        const error = result.split(' ')
        const errorMessage = error.slice(1).join(' ')

        return res.status(parseInt(error[0].slice(1,4))).json({ error: errorMessage })
    }
    // Respondiendo con un código de estado 201 y los detalles del producto agregado
    res.status(201).json({ status: 'success', payload: result })
})

// Ruta PUT para actualizar un producto por su ID
productRouter.put('/:pid', async (req, res) => {
    const pid = arseInt(req.params.pid)
    // Obteniendo los datos de actualización desde el body
    const data = req.body
    // Llamada asincrónica para actualizar un producto
    const result = await productManager.updateProduct(pid.data)

    if (typeof result == "string") {
        const error = result.split(" ");
        const errorMessage = error.slice(1).join(' ')

        return res.status(parseInt(error[0].slice(1,4))).json({ error: errorMessage })
    }
    // Respondiendo con un código de estado 201 y los detalles del producto actualizado
    return res.status(201).json({ status: "success", payload: result })
})

// Ruta DELETE para eliminar un producto por su ID
productRouter.delete("/:pid", async (req, res) => {
    const pid = parseInt(req.params.pid);
    // Llamada asincrónica para eliminar un producto
    const result = await productManager.deleteProduct(pid);
    // Respondiendo con un código de estado 201 y un mensaje de éxito
    return res.status(201).json({ status: "success", payload: result })
})

export default productRouter