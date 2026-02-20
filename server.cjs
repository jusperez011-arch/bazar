const express = require('express');
const cors = require('cors');
const fs = require('fs'); 
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- 1. UTILIDADES PARA ARCHIVOS ---

const getProductsFromFile = () => {
    const data = fs.readFileSync('./productos.json', 'utf-8');
    return JSON.parse(data);
};

const saveProductsToFile = (products) => {
    fs.writeFileSync('./productos.json', JSON.stringify(products, null, 2));
};

const saveSaleToFile = (nuevaVenta) => {
    const pathVentas = './ventas.json';
    let historial = [];

    if (fs.existsSync(pathVentas)) {
        try {
            const contenido = fs.readFileSync(pathVentas, 'utf-8');
            historial = JSON.parse(contenido);
        } catch (e) {
            historial = [];
        }
    }

    historial.push(nuevaVenta);
    fs.writeFileSync(pathVentas, JSON.stringify(historial, null, 2));
};

// --- 2. RUTAS DEL SISTEMA ---
// 📊 OBTENER HISTORIAL DE VENTAS
app.get('/sales', (req, res) => {
    const pathVentas = './ventas.json';
    if (fs.existsSync(pathVentas)) {
        const data = fs.readFileSync(pathVentas, 'utf-8');
        res.json(JSON.parse(data));
    } else {
        res.json([]); // Si no hay ventas aún, enviamos una lista vacía
    }
});

// OBTENER PRODUCTOS
app.get('/products', (req, res) => {
    const products = getProductsFromFile(); 
    res.json(products);
});

// CREAR O ACTUALIZAR PRODUCTO
app.post('/products', (req, res) => {
    const { name, price, stock, image, description } = req.body;
    let products = getProductsFromFile();
    
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock) || 0;

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
        return res.status(400).json("¡Error! El precio debe ser mayor a cero. 💸");
    }

    const index = products.findIndex(p => p.name.toLowerCase() === name.toLowerCase());

    if (index !== -1) {
        products[index].stock = Number(products[index].stock) + parsedStock;
        products[index].price = parsedPrice;
        console.log(`♻️ Actualizado: ${name}`);
    } else {
        const newProduct = {
            id: Date.now(),
            name,
            price: parsedPrice,
            stock: parsedStock,
            image: image || "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000",
            description: description || "Producto del Bazar."
        };
        products.push(newProduct);
        console.log(`✨ Nuevo: ${name}`);
    }

    saveProductsToFile(products); 
    res.json(products);
});

// EDITAR PRODUCTO
app.put('/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const { name, price, stock, image } = req.body; 
    let products = getProductsFromFile();
    const index = products.findIndex(p => Number(p.id) === id);

    if (index !== -1) {
        products[index] = { 
            ...products[index], 
            name, 
            price: Number(price), 
            stock: Number(stock),
            image: image
        }; 
        saveProductsToFile(products);
        res.json(products);
    } else {
        res.status(404).json({ message: "No encontrado" });
    }
});

// ELIMINAR PRODUCTO
app.delete('/products/:id', (req, res) => {
    const idABorrar = Number(req.params.id);
    let products = getProductsFromFile();
    const filteredProducts = products.filter(p => Number(p.id) !== idABorrar);
    saveProductsToFile(filteredProducts);
    res.json(filteredProducts);
});

// 💰 RUTA DE CHECKOUT (PROCESAR VENTA Y GUARDAR HISTORIAL)
app.post('/checkout', (req, res) => {
    const cartItems = req.body;
    let products = getProductsFromFile();
    let totalVenta = 0;

    // Restamos stock y calculamos total
    cartItems.forEach(item => {
        const index = products.findIndex(p => Number(p.id) === Number(item.id));
        if (index !== -1) {
            totalVenta += products[index].price * item.quantity;
            products[index].stock = Math.max(0, products[index].stock - item.quantity);
        }
    });

    // Creamos el registro de la venta
    const ventaRealizada = {
        id: Date.now(),
        fecha: new Date().toLocaleString('es-EC', { timeZone: 'America/Guayaquil' }),
        articulos: cartItems.map(i => ({ 
            nombre: i.name, 
            cantidad: i.quantity, 
            subtotal: i.price * i.quantity 
        })),
        total: totalVenta
    };

    saveSaleToFile(ventaRealizada); // <--- Guarda en ventas.json
    saveProductsToFile(products);  // <--- Actualiza stock en productos.json

    console.log(`💰 Venta registrada: $${totalVenta.toFixed(2)}`);
    res.json({ message: "Venta exitosa", updatedProducts: products });
});

// RUTA DE PRUEBA
app.get('/hello', (req, res) => {
    res.send("¡Hola desde el Backend! 🥖 Tus panes están listos.");
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor activo en el puerto ${PORT}`);
});