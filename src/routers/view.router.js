import { Router } from "express"
import ProductManager from '../productManager.js'

const viewsRouter = Router()
const productManager = new ProductManager('./data/products.json')

viewsRouter.get('/', async(req, res) => {
    const products = await productManager.getProducts()
    res.render('home.handlebars', { products })
})

viewsRouter.get('/realTimeProducts', async(req, res) => {
    const products = await productManager.getProducts()
    res.render('realTimeProducts.handlebars', { products })
})

export default viewsRouter