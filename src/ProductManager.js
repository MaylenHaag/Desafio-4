import fs from 'fs';

class ProductManager {
    #path

    constructor (path) {
        this.#path = path
        this.#init()
    }

    async #init() {
        
        if (!fs.existsSync(this.#path)) {
            
            await fs.promises.writeFile(this.#path, JSON.stringify([], null, 2))
        }
    }

    async addProduct(product) {
        
        const requiredFields = ["title", "description", "price", "code", "stock"];
        const allFieldsPresent = requiredFields.every((field) => product[field]);
        
        if (!allFieldsPresent){
            return 'Todos los campos son obligatorios'
        }
        
        if (!fs.existsSync(this.#path)) {
            
            return 'El archivo no existe en la base de datos.'
        }
        
        let data = await fs.promises.readFile(this.#path, 'utf-8')
        let products = JSON.parse(data)
        const found = products.find(item => item.code === product.code)
    
        if (found) {
            return 'El código ya existe.'
        }

        const productToAdd = { id: this.#generateId(products), status: true, thumbnails: [], ...product }
        products.push(productToAdd)
        
        await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 2))

        return productToAdd
    }

    #generateId(products) {
       
        if (products.length === 0) {
            return 1 
        }
        
        return products[products.length-1].id + 1
    }

    async getProducts() {
        if (!fs.existsSync(this.#path)) {
            return 'El archivo no existe en la base de datos.'
        }
        
        let data = await fs.promises.readFile(this.#path, 'utf-8')
        const products = JSON.parse(data)

        return products
    }

    async getProductById(id) {
        if (!fs.existsSync(this.#path)) {
            return 'El archivo no existe en la base de datos.'
        }
        
        let data = await fs.promises.readFile(this.#path, 'utf-8')
        let products = JSON.parse(data)
        let product = products.find(item => item.id === id)
        
        if (!product) {
            return { error: 'Producto no encontrado.' }
        }

        return product
    }

    async updateProduct(id, updateProduct) {
        if (!fs.existsSync(this.#path)) {
            return 'El archivo no existe en la base de datos.'
        }
        
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
        
        if (!isFound) {
            return 'El producto no existe.'
        }

        await fs.promises.writeFile(this.#path, JSON.stringify(newProducts, null, 2))

        return newProducts.find(item => item.id === id)
    }

    async deleteProduct(id) {
        if (!fs.existsSync(this.#path)) {
            return 'El archivo no existe en la base de datos.'
        }
        
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