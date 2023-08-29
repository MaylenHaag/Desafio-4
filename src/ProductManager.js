import fs from 'fs';

class ProductManager {
    #path

    constructor (path) {
        this.#path = path
        this.#init()
    }

    async #init() {
        // Verifica si el archivo especificado en el constructor existe.
        if (!fs.existsSync(this.#path)) {
            // Si no existe, crea un archivo vacío JSON en el camino especificado.
            await fs.promises.writeFile(this.#path, JSON.stringify([], null, 2))
        }
    }

    // Este método permite agregar un producto a la base de datos.
    async addProduct(product) {
        // Verifica si todos los campos requeridos están presentes en el producto.
        const requiredFields = ["title", "description", "price", "thumbnail", "code", "stock"];
        const allFieldsPresent = requiredFields.every((field) => product[field]);
        // Si no, devuelve un mensaje de error.
        if (!allFieldsPresent){
            return 'Todos los campos son obligatorios'
        }
        // Luego, verifica si el archivo de base de datos existe.
        if (!fs.existsSync(this.#path)) {
            // Si no existe, devuelve un mensaje de error.
            return 'El archivo no existe en la base de datos.'
        }
        // Lee los datos actuales del archivo JSON, verifica si ya existe un producto con el mismo código y agrega el nuevo producto si no existe.
        let data = await fs.promises.readFile(this.#path, 'utf-8')
        let products = JSON.parse(data)
        const found = products.find(item => item.code === product.code)
    
        if (found) {
            return 'El código ya existe.'
        }

        const productToAdd = { id: this.#generateId(products), status: true, thumbnails: [], ...product }
        products.push(productToAdd)
        // Finalmente, guarda los datos actualizados en el archivo JSON.
        await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 2))

        return productToAdd
    }

    // Este método genera un nuevo ID para un producto que se va a agregar.
    #generateId(products) {
        // Si no hay productos en la lista, asigna 1 como ID inicial.
        if (products.length === 0) {
            return 1 
        }
        // Toma la longitud actual de la lista de productos y agrega 1 al último ID existente.
        return products[products.length-1].id + 1
    }

    // Este método devuelve todos los productos almacenados en la base de datos.
    async getProducts() {
        if (!fs.existsSync(this.#path)) {
            return 'El archivo no existe en la base de datos.'
        }
        // Lee los datos del archivo JSON y los devuelve como una lista de productos.
        let data = await fs.promises.readFile(this.#path, 'utf-8')
        const products = JSON.parse(data)

        return products
    }

    // Este método busca un producto por su ID y lo devuelve
    async getProductById(id) {
        if (!fs.existsSync(this.#path)) {
            return 'El archivo no existe en la base de datos.'
        }
        // Lee los datos del archivo JSON, busca un producto con el ID especificado y lo devuelve.
        let data = await fs.promises.readFile(this.#path, 'utf-8')
        let products = JSON.parse(data)
        let product = products.find(item => item.id === id)
        // Si no encuentra el producto, devuelve un mensaje de error.
        if (!product) {
            return { error: 'Producto no encontrado.' }
        }

        return product
    }

    // Este método actualiza un producto existente en la base de datos
    async updateProduct(id, updateProduct) {
        if (!fs.existsSync(this.#path)) {
            return 'El archivo no existe en la base de datos.'
        }
        // Lee los datos del archivo JSON, busca el producto por su ID, lo actualiza con los datos proporcionados y guarda los datos actualizados en el archivo JSON.
        let isFound = false
        let data = await fs.promises.readFile(this.#path, 'utf-8')
        let products = JSON.parse(data)
        let newProducts = products.map(item => {
            if (item.id === id) {
                isFound = true

                return {
                    ...item,
                    ...updateProduct
                }
            } else {
                return item
            }
        })
        // Si no encuentra el producto, devuelve un mensaje de error.
        if (!isFound) {
            return 'El producto no existe.'
        }

        await fs.promises.writeFile(this.#path, JSON.stringify(newProducts, null, 2))

        return newProducts.find(item => item.id === id)
    }

    // Este método elimina un producto de la base de datos por su ID.
    async deleteProduct(id) {
        if (!fs.existsSync(this.#path)) {
            return 'El archivo no existe en la base de datos.'
        }
        // Lee los datos del archivo JSON, elimina el producto con el ID especificado de la lista de productos y guarda los datos actualizados en el archivo JSON.
        let isFound = false
        let data = await fs.promises.readFile(this.#path, 'utf-8')
        let products = JSON.parse(data)
        let newProducts = products.filter(item => item.id !== id)

        if (products.length !== newProducts.length) {
            isFound = true
        }

        if (!isFound) {
            return 'El producto no existe.'
        }

        await fs.promises.writeFile(this.#path, JSON.stringify(newProducts, null, 2))
        
        return newProducts

    }
}

export default ProductManager