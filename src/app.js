import fs from 'fs'
import express from 'express'
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import productsRouter from './routers/product.router.js'
import cartsRouter from './routers/cart.router.js'
import viewsRouter from './routers/view.router.js'

const app = express()

app.use(express.json()) 
app.use(express.static('./src/public'))
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

app.get('/', (req, res) => res.render('index'))
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/products', viewsRouter)

const server = app.listen(8080, () => console.log('Servicio cargado'))
const io = new Server(server)

io.on("connection", socket => {
  console.log(`New client connected`)
  socket.on('productList', data => {
    io.emit('updatedProducts', data)
  })
})
