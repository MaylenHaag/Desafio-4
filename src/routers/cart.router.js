import { Router } from 'express'
import CartManager from '../cartManager.js'

// Creación de un enrutador
const cartsRouter = Router()
// Crear una instancia del gestor de carritos
const cartManager = new CartManager('./data/carts.json')

// Definición de la ruta para crear un nuevo carrito
cartsRouter.post('/', async (req, res) => {
    // Llamar al método para crear un carrito
    const result = await cartManager.createCart()

    if (typeof result == 'string') {
        // Manejar errores y devolver una respuesta JSON con el código de error
        const error = result.split(' ')
        const errorMessage = error.slice(1).join(' ')

        return res.status(parseInt(error[0].slice(1,4))).json({ error: errorMessage })
    }
    // Si la creación es exitosa, responder con un código de estado 201 y el resultado
    res.status(201).json({ status: 'success', payload: result })
})

// Definición de la ruta para obtener productos de un carrito específico
cartsRouter.get('/:cid', async (req, res) => {
    const cid = parseInt(req.params.cid)
    // Llamar al método para obtener productos
    const result = await cartManager.getProductsFromCart(cid)

    if (typeof result == 'string') {
        const error = result.split(' ')
        const errorMessage = error.slice(1).join(' ')

        return res.status(parseInt(error[0].slice(1,4))).json({ error: errorMessage })
    }

    res.status(200).json({ status: 'success', payload: result })
})

// Definición de la ruta para agregar un producto a un carrito específico
cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    // Llamar al método para agregar un producto
    const result = await cartManager.addProductToCart(cid, pid)

    if (typeof result == 'string') {
        const error = result.split(' ')
        const errorMessage = error.slice(1).join(' ')

        return res.status(parseInt(error[0].slice(1,4))).json({ error: errorMessage })
    }

    res.status(200).json({ status: 'success', payload: result })
})

export default cartsRouter