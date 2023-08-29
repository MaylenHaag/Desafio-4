import ProductManager from './src/ProductManager.js'

const mockProduct = {
    title: 'Producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25
}
const mockFailProduct = {
    title: 'Producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25
}
const productManager = new ProductManager('./products.json')

const test = async () => {
    console.log('\n---TEST---')
    console.log('getProducts() debe devolver un array vacío:')
    console.log(await productManager.getProducts())

    console.log('\n---TEST---')
    console.log('addProduct(mockProduct) debe devolver el producto creado:')
    console.log(await productManager.addProduct(mockProduct))

    console.log('\n---TEST---')
    console.log('getProducts() debe devolver un array con 1 producto:')
    console.log(await productManager.getProducts())

    console.log('\n---TEST---')
    console.log('addProduct(mockFailProduct) debe devolver error por falta de campos requeridos:')
    console.log(await productManager.addProduct(mockFailProduct))

    console.log('\n---TEST---')
    console.log('addProduct(mockProduct) debe devoler error de CODE repetido:')
    console.log(await productManager.addProduct(mockProduct))

    console.log('\n---TEST---')
    console.log('getProducts() debe devolver un array con 1 producto:')
    console.log(await productManager.getProducts())

    console.log('\n---TEST---')
    console.log('getProductById(1) debe devolver el producto con id=1:')
    console.log(await productManager.getProductById(1))

    console.log('\n---TEST---')
    console.log('getProductById(2) debe devolver error de producto no encontrado:')
    console.log(await productManager.getProductById(2))

    console.log('\n---TEST---')
    console.log('updateProduct(1,{price:250}) debe devolver el producto actualizado:')
    console.log(await productManager.updateProduct(1, { price: 250 }))

    console.log('\n---TEST---')
    console.log('updateProduct(2,{price:250}) debe devolver error pues el producto con id=2 no existe:')
    console.log(await productManager.updateProduct(2, { price: 250 }))

    console.log('\n---TEST---')
    console.log('deleteProduct(1) debe devolver la lista de productos sin el producto con id=1:')
    console.log(await productManager.deleteProduct(1))

    console.log('\n---TEST---')
    console.log('deleteProduct(2) debe devolver error pues el producto con id=2 no existe:')
    console.log(await productManager.deleteProduct(2))
}

test()