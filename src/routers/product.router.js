import { Router } from 'express'
import ProductManager from '../productManager.js'

const productRouter = Router()
const productManager = new ProductManager('./data/products.json')

const ERROR_CODES = {
    'product_not_found': 404, 
    'invalid_data': 400
}

productRouter.get('/', async (req, res) => {
    try {
        const result = await productManager.getProducts()
        const limit = req.query.limit 

        res.status(200).json({ status: 'success', payload: result.slice(0, limit)})

    } catch (error) {
        if (error.code in ERROR_CODES) {
            res.status(ERROR_CODES[error.code]).json({ error: error.message })

        } else {
            res.status(500).json({ error: 'Internal Server Error' })
        }
    }
})

productRouter.get('/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid);
    
    try {
        const result = await productManager.getProductById(pid)
        res.status(200).json({ status: 'success', payload: result })

    } catch (error) {
        if (error.code in ERROR_CODES) {
            return res.status(ERROR_CODES[error.code]).json({ error: error.message })

        } else {
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }
})


productRouter.post('/', async (req, res) => {
    const product = req.body
    
    try {
        const result = await productManager.addProduct(product)

        res.status(201).json({ status: 'success', payload: result })

    } catch (error) {
        if (error.code in ERROR_CODES) {
            res.status(ERROR_CODES[error.code]).json({ error: error.message })

        } else {
            res.status(500).json({ error: 'Internal Server Error' })
        }
    }
})


productRouter.put('/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid)
    const data = req.body
    
    try {
        const result = await productManager.updateProduct(pid.data)

        res.status(201).json({ status: "success", payload: result })

    } catch (error) {
        if (error.code in ERROR_CODES) {
            res.status(ERROR_CODES[error.code]).json({ error: error.message })

        } else {
            res.status(500).json({ error: 'Internal Server Error' })
        }
    }
})


productRouter.delete("/:pid", async (req, res) => {
    const pid = parseInt(req.params.pid);
    
    try {
        const result = await productManager.deleteProduct(pid)

        res.status(201).json({ status: "success", payload: result })

    } catch (error) {
        if (error.code in ERROR_CODES) {
            res.status(ERROR_CODES[error.code]).json({ error: error.message })

        } else {
            res.status(500).json({ error: 'Internal Server Error' })
        }
    }
})

export default productRouter