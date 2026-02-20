const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001; // Usamos el 3001 para no chocar con tu servidor de la panadería

app.use(cors());

app.get('/hello', (req, res) => {
  res.send("Hello from the Backend me name is Jostin! 🥖✨");
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de saludo corriendo en http://localhost:${PORT}/hello`);
});