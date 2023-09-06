import express from 'express'
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import productsRouter from './routers/product.router.js'
import cartsRouter from './routers/cart.router.js'
import viewsRouter from './routers/view.router.js'
import ProductManager from './productManager.js'

const app = express()

app.use(express.json()) 
app.use('/', express.static('./src/public'))
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

app.get('/', async (req, res) => {
  const productManager = new ProductManager("./data/products.json")
  const products = await productManager.getProducts()
  res.render("index.handlebars",{products})
})

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/products', viewsRouter)

const httpServer = app.listen(8080, () => console.log('Servicio cargado'))
const io = new Server(httpServer)

io.on("connection", (socket) => {
  console.log(`New client connected`)
  socket.on('productList', (data) => {
    io.emit('updatedProducts', (data))
  })
})
