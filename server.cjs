const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Quitamos 'fs' porque ya no usaremos archivos
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

// 📊 OBTENER HISTORIAL DE VENTAS (Debes crear la tabla 'ventas' en pgAdmin después)
app.get('/sales', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ventas ORDER BY fecha DESC');
        res.json(result.rows);
    } catch (err) {
        res.json([]); 
    }
});

// OBTENER PRODUCTOS
app.get('/products', async (req, res) => {
    try {
        // Renombramos las columnas de español a inglés para que el Frontend no se confunda
        const result = await pool.query(`
            SELECT 
                id, 
                nombre AS name, 
                precio AS price, 
                stock, 
                imagen AS image 
            FROM productos 
            ORDER BY id ASC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener productos");
    }
});

// CREAR O ACTUALIZAR PRODUCTO

// --- ACTUALIZAR PRODUCTO REFORZADO ---
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, stock, image } = req.body;

    try {
        // Forzamos que sean números para que la DB no se confunda
        const cleanPrice = Number(price) || 0;
        const cleanStock = Number(stock) || 0;

        await pool.query(
            'UPDATE productos SET nombre = $1, precio = $2, stock = $3, imagen = $4 WHERE id = $5',
            [name, cleanPrice, cleanStock, image, id]
        );

        // Devolvemos la lista con alias y asegurando el orden
        const result = await pool.query(`
            SELECT id, nombre AS name, precio AS price, stock, imagen AS image 
            FROM productos ORDER BY id ASC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).send("Error al actualizar");
    }
});

// --- CHECKOUT QUE SÍ GUARDA EN TU NUEVA TABLA VENTAS ---
app.post('/checkout', async (req, res) => {
    const cartItems = req.body;
    const total = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

    try {
        // 1. Descontar stock
        for (const item of cartItems) {
            await pool.query('UPDATE productos SET stock = stock - $1 WHERE id = $2', [item.quantity, item.id]);
        }

        // 2. Insertar en la tabla que creaste en pgAdmin
        await pool.query(
            'INSERT INTO ventas (articulos, total) VALUES ($1, $2)',
            [JSON.stringify(cartItems), total]
        );

        // 3. Devolver productos actualizados
        const updated = await pool.query('SELECT id, nombre AS name, precio AS price, stock, imagen AS image FROM productos ORDER BY id ASC');
        res.json({ message: "Venta exitosa", updatedProducts: updated.rows });
    } catch (err) {
        res.status(500).send("Error en la venta");
    }
});

// ELIMINAR PRODUCTO
app.delete('/products/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await pool.query('DELETE FROM productos WHERE id = $1', [id]);
        const allProducts = await pool.query('SELECT * FROM productos ORDER BY id ASC');
        res.json(allProducts.rows);
    } catch (err) {
        res.status(500).send("Error al borrar");
    }
});

// 💰 RUTA DE CHECKOUT
// En tu server.js
app.post('/checkout', async (req, res) => {
    const cartItems = req.body;
    const total = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

    try {
        // Descuenta stock
        for (const item of cartItems) {
            await pool.query('UPDATE productos SET stock = stock - $1 WHERE id = $2', [item.quantity, item.id]);
        }

        // 📝 GUARDA LA VENTA (Para que el botón REPORTES funcione)
        await pool.query(
            'INSERT INTO ventas (articulos, total) VALUES ($1, $2)',
            [JSON.stringify(cartItems), total]
        );

        const updated = await pool.query('SELECT id, nombre AS name, precio AS price, stock, imagen AS image FROM productos ORDER BY id ASC');
        res.json({ message: "Venta exitosa", updatedProducts: updated.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor con Postgres activo en puerto ${PORT}`);
});