const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- 1. CONFIGURACIÓN DE LA BASE DE DATOS ---
const pool = new Pool({
    connectionString: 'postgresql://justin:q2n7TCISIZ1NS1rYpPdRsYIvyGZ2V76V@dpg-d6dhvoh4tr6s73crdg60-a.oregon-postgres.render.com/bazar_db_44kr',
    ssl: {
        rejectUnauthorized: false
    }
});

// --- 2. RUTAS DEL SISTEMA ---

// 📊 OBTENER HISTORIAL DE VENTAS (Con conversión a FLOAT para evitar errores en Frontend)
app.get('/sales', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, fecha, articulos, total::FLOAT FROM ventas ORDER BY fecha DESC');
        res.json(result.rows);
    } catch (err) {
        console.error("Error al obtener ventas:", err);
        res.json([]); 
    }
});

// 📦 OBTENER PRODUCTOS
app.get('/products', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, nombre AS name, precio AS price, stock, imagen AS image 
            FROM productos ORDER BY id ASC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener productos");
    }
});

// 📝 ACTUALIZAR PRODUCTO
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, stock, image } = req.body;
    try {
        const cleanPrice = Number(price) || 0;
        const cleanStock = Number(stock) || 0;
        await pool.query(
            'UPDATE productos SET nombre = $1, precio = $2, stock = $3, imagen = $4 WHERE id = $5',
            [name, cleanPrice, cleanStock, image, id]
        );
        const result = await pool.query('SELECT id, nombre AS name, precio AS price, stock, imagen AS image FROM productos ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send("Error al actualizar");
    }
});
// Ruta para vaciar el historial de ventas
app.delete('/sales', async (req, res) => {
    try {
        await pool.query('TRUNCATE TABLE ventas');
        res.json({ message: "Historial borrado con éxito" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al vaciar el historial");
    }
});

// 💰 RUTA DE CHECKOUT (Única y funcional)
app.post('/checkout', async (req, res) => {
    const cartItems = req.body; // Viene como { name, price, quantity }
    const total = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

    try {
        // Guardamos los artículos tal cual vienen del frontend (en inglés)
        // para que cuando el frontend los pida de vuelta, los reconozca.
        await pool.query(
            'INSERT INTO ventas (articulos, total) VALUES ($1, $2)',
            [JSON.stringify(cartItems), total] 
        );

        // Descontar stock (aquí usamos los nombres de la DB: stock, id)
        for (const item of cartItems) {
            await pool.query('UPDATE productos SET stock = stock - $1 WHERE id = $2', [item.quantity, item.id]);
        }

        const updated = await pool.query('SELECT id, nombre AS name, precio AS price, stock, imagen AS image FROM productos ORDER BY id ASC');
        res.json({ message: "Venta exitosa", updatedProducts: updated.rows });
    } catch (err) {
        res.status(500).send("Error");
    }
});

// 🗑️ ELIMINAR PRODUCTO
app.delete('/products/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await pool.query('DELETE FROM productos WHERE id = $1', [id]);
        const allProducts = await pool.query('SELECT id, nombre AS name, precio AS price, stock, imagen AS image FROM productos ORDER BY id ASC');
        res.json(allProducts.rows);
    } catch (err) {
        res.status(500).send("Error al borrar");
    }
});

// 🌐 RUTA DE PRUEBA (Instrucción 25-Ene)
app.get('/test', (req, res) => {
    res.send("Hello from the Backend 🚀");
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor con Postgres activo en puerto ${PORT}`);
});