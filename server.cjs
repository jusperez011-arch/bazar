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
app.post('/products', async (req, res) => {
    const { name, price, stock, image } = req.body;
    
    try {
        // Verificar si existe para actualizar o crear
        const checkExist = await pool.query('SELECT * FROM productos WHERE LOWER(nombre) = LOWER($1)', [name]);

        if (checkExist.rows.length > 0) {
            // ACTUALIZAR STOCK
            const newStock = Number(checkExist.rows[0].stock) + Number(stock);
            await pool.query('UPDATE productos SET stock = $1, precio = $2 WHERE nombre = $3', [newStock, price, name]);
        } else {
            // INSERTAR NUEVO
            await pool.query(
                'INSERT INTO productos (nombre, precio, stock, imagen) VALUES ($1, $2, $3, $4)',
                [name, price, stock, image || "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000"]
            );
        }
        
        const allProducts = await pool.query('SELECT * FROM productos ORDER BY id ASC');
        res.json(allProducts.rows);
    } catch (err) {
        res.status(500).send("Error al procesar producto");
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
app.post('/checkout', async (req, res) => {
    const cartItems = req.body;
    try {
        for (const item of cartItems) {
            await pool.query('UPDATE productos SET stock = stock - $1 WHERE id = $2', [item.quantity, item.id]);
        }
        // Nota: Para guardar la venta en 'ventas', necesitaríamos otra tabla. 
        // Por ahora, esto ya descuenta el stock de forma permanente.
        res.json({ message: "Venta exitosa" });
    } catch (err) {
        res.status(500).send("Error en la venta");
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor con Postgres activo en puerto ${PORT}`);
});