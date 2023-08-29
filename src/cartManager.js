import fs from 'fs'
import ProductManager from './ProductManager.js'

const productManager = new ProductManager('./data/products.json')

export default class CartManager {
    #path

    constructor(path) {
        this.#path = path
        this.#init()
    }

    async #init() {
        // Verifica si el archivo existe, si no existe, lo crea con un arreglo vacío
        if (!fs.existsSync(this.#path)) {
            await fs.promises.writeFile(this.#path, JSON.stringify([], null, 2))
        }
    }

    // Método privado para generar un nuevo ID
    #generateId(data) {
        return (data.length === 0) ? 1 : data[data.length - 1].id + 1
    }

    // Método público para crear un nuevo carrito
    async createCart() {
        if (!fs.existsSync(this.#path)) {
            return 'El archivo no existe en la base de datos.'
        }
        // Lee los datos del archivo y parsea los carritos existentes
        let data = await fs.promises.readFile(this.#path, 'utf-8')
        let carts = JSON.parse(data)
        // Genera un nuevo carrito y lo agrega al arreglo de carritos
        const cartToAdd = { id: this.#generateId(carts), products: [] }
        carts.push(cartToAdd)
        // Escribe los datos actualizados en el archivo
        await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 2))

        return cartToAdd
    }

    // Método público para obtener productos de un carrito por ID
    async getProductsFromCart(id) {
        if (!fs.existsSync(this.#path)) {
            return 'El archivo no existe en la base de datos.'
        }
        // Lee los datos del archivo y parsea los carritos existentes
        let data = await fs.promises.readFile(this.#path, 'utf-8')
        let carts = JSON.parse(data)
        // Busca el carrito por ID y lo devuelve, o devuelve un mensaje de no encontrado
        let cart = carts.find(item => item.id === id)

        if (!cart) {
            return 'No encontrado.'
        }

        return cart
    }

    // Método público para agregar un producto a un carrito
    async addProductToCart(cid, pid) {
        if (!fs.existsSync(this.#path)) {
            return 'El archivo no existe en la base de datos.'
        }
        // Obtiene el producto por ID utilizando la instancia de ProductManager
        let result = await productManager.getProductById(pid)
        // Verifica si el producto se encontró, si no, devuelve un mensaje de error
        if (typeof result == 'string') {
            return `El producto con el id=${pid} no se ha encontrado.`
        }
        // Obtiene el carrito por ID utilizando el método getProductsFromCart
        const cart = await this.getProductsFromCart(cid)
        // Verifica si el carrito se encontró, si no, devuelve un mensaje de error
        if (typeof cart == 'string') {
            return `El carro con el id=${cid} no se ha encontrado.`
        }
        // Busca si el producto ya está en el carrito y actualiza la cantidad o lo agrega con cantidad 1
        const productIndex = cart.products.findIndex(item => item.product === pid)

        if (productIndex > -1) {
            cart.products[productIndex].quantity += 1

        } else {
            cart.products.push({ product: pid, quantity: 1 })
        }
        // Lee los datos del archivo, actualiza el carrito y escribe los datos actualizados en el archivo
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
