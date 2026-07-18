const express = require("express");
const cors = require("cors");

const disponibilidad = require("./routes/disponibilidad");
const crearCita = require("./routes/crearCita");
const profesionales = require("./routes/profesionales");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("✅ Backend de Cogniversos funcionando");
});

app.use("/disponibilidad", disponibilidad);
app.use("/crear-cita", crearCita);
app.use("/profesionales", profesionales);

const PORT = process.env.PORT || 3000;

console.log("TOKEN_DANIEL existe:", !!process.env.TOKEN_DANIEL);
console.log("GOOGLE_CREDENTIALS existe:", !!process.env.GOOGLE_CREDENTIALS);

app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado en el puerto ${PORT}`);
});