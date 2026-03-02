# 📦 Shirley Bazar 2026 - Sistema de Gestión de Inventario & Ventas

Aplicación web **Full-Stack** diseñada para la digitalización de un negocio minorista. El sistema permite la gestión integral de productos, control de stock en tiempo real y registro automatizado de ventas.

## 🛠️ Desafíos Técnicos Resueltos
* **Sincronización en Tiempo Real:** Implementación de una arquitectura donde cada venta descuenta automáticamente el stock de la base de datos PostgreSQL, evitando errores de inventario.
* **Diseño Mobile-First:** Optimización de la interfaz con Tailwind CSS para garantizar que el administrador pueda gestionar el negocio desde su celular con la misma fluidez que en una computadora.
* **Persistencia de Datos:** Configuración de un servidor en Node.js/Express desplegado en la nube (Render), asegurando que la información de ventas e inventario sea permanente y segura.

## 🌟 Funcionalidades Destacadas
* **Dashboard Administrativo:** Visualización instantánea del capital total invertido y alertas de productos agotados.
* **Carrito de Compras Inteligente:** Validación de disponibilidad de stock antes de procesar cualquier transacción.
* **Módulo de Reportes:** Historial cronológico de ventas con desglose de artículos y totales recaudados.
* **Experiencia de Usuario:** Interfaz minimalista con efectos visuales dinámicos y feedback instantáneo mediante SweetAlert2.

## 💻 Stack Tecnológico
* **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons.
* **Backend:** Node.js, Express API.
* **Base de Datos:** PostgreSQL.
* **Despliegue:** GitHub & Render Cloud.

## 🔍 Verificación del Sistema
Puedes comprobar que el servidor está activo accediendo a la ruta de prueba:
`https://bazar-server-vend.onrender.com/hello`
*(Deberías ver el mensaje: **"Hello from the Backend"**)*.
