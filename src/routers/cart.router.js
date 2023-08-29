import { Router } from 'express'
import CartManager from '../cartManager.js'

const cartsRouter = Router()
const cartManager = new CartManager('./data/carts.json')

const ERROR_CODES = {
    'code_already_exists': 409,
    
}

cartsRouter.post('/', async (req, res) => {
   
    try{
        const result = await cartManager.createCart()
        res.status(201).json({ status: 'success', payload: result })

    } catch (error) {
        if (error.code in ERROR_CODES) {
            res.status(ERROR_CODES[error.code].json({ error: error.message}))

        } else {
            res.status(500).json({ error: 'Internal Server Error' })
        }
    }
})


cartsRouter.get('/:cid', async (req, res) => {
    const cid = parseInt(req.params.cid)
    
    try {
        const result = await cartManager.getProductsFromCart(cid)
        res.status(200).json({ status: 'success', payload: result })

    } catch (error) {
        if (error.code in ERROR_CODES) {
            res.status(ERROR_CODES[error.code]).json({ error: error.message })

        } else {
            res.status(500).json({ error: 'Internal Server Error' })
        }
    }
})


cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    
    try {
        const result = await cartManager.addProductToCart(cid, pid)
        res.status(200).json({ status: 'success', payload: result })

    } catch (error) {
        if (error.code in ERROR_CODES) {
            res.status(ERROR_CODES[error.code]).json({ error: error.message })

        } else {
            res.status(500).json({ error: 'Internal Server Error' })
        }
    }
})

export default cartsRouter