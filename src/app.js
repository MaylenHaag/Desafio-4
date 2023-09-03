import fs from 'fs'
import express from 'express'
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import productsRouter from './routers/product.router.js'
import cartsRouter from './routers/cart.router.js'
//import ProductManager from './productManager.js'
import viewsRouter from './routers/view.router.js'

//const path = "./data/products.json"

/*
const init = async () => {
    if (!fs.existsSync(path)) { 
      await fs.promises.writeFile(path, JSON.stringify([], null)); 
    }
}
*/

//init()

//const productManager = new ProductManager(path)

/*
let data = await fs.promises.readFile(path, "utf-8")
let products = JSON.parse(data)
*/

const app = express()

app.use(express.json()) 
app.use(express.static('./src/public'))
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')
//app.use(express.urlencoded({extended: true}))

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

//const socketServer = new Server(httpServer)