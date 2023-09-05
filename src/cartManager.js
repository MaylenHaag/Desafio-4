import fs from 'fs'
import ProductManager from './productManager.js'

const productManager = new ProductManager('./data/products.json')

export default class CartManager {
    #path

    constructor(path) {
        this.#path = path
        this.#init()
    }

    async #init() {
        
        if (!fs.existsSync(this.#path)) {
            await fs.promises.writeFile(this.#path, JSON.stringify([], null, 2))
        }
    }

    #generateId(data) {
        return (data.length === 0) ? 1 : data[data.length - 1].id + 1
    }

    async createCart() {
        if (!fs.existsSync(this.#path)) {
            return 'El archivo no existe en la base de datos.'
        }
        
        let data = await fs.promises.readFile(this.#path, 'utf-8')
        let carts = JSON.parse(data)
        
        const cartToAdd = { id: this.#generateId(carts), products: [] }
        carts.push(cartToAdd)
        
        await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 2))

        return cartToAdd
    }

    async getProductsFromCart(id) {
        if (!fs.existsSync(this.#path)) {
            return 'El archivo no existe en la base de datos.'
        }
        
        let data = await fs.promises.readFile(this.#path, 'utf-8')
        let carts = JSON.parse(data)
        
        let cart = carts.find(item => item.id === id)

        if (!cart) {
            return 'No encontrado.'
        }

        return cart
    }

    async addProductToCart(cid, pid) {
        if (!fs.existsSync(this.#path)) {
            return 'El archivo no existe en la base de datos.'
        }
        
        let result = await productManager.getProductById(pid)
        
        if (typeof result == 'string') {
            return `El producto con el id=${pid} no se ha encontrado.`
        }
        
        const cart = await this.getProductsFromCart(cid)
        
        if (typeof cart == 'string') {
            return `El carro con el id=${cid} no se ha encontrado.`
        }
        
        const productIndex = cart.products.findIndex(item => item.product === pid)

        if (productIndex > -1) {
            cart.products[productIndex].quantity += 1

        } else {
            cart.products.push({ product: pid, quantity: 1 })
        }
        
        let data = await fs.promises.readFile(this.#path, 'utf-8')
        let carts = JSON.parse(data)

        carts = carts.map(item => {
            if (item.id === cid) {
                return cart

            } else {
                return item
            }
        })

        await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 2))

        return cart
    }
}
