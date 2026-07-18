const express = require("express");
const router = express.Router();

const { obtenerAgenda } = require("../services/calendarService");
const profesionales = require("../data/profesionales");

router.get("/", async (req, res) => {

    try {

        const { calendarId, fecha } = req.query;

        if (!calendarId || !fecha) {

            return res.status(400).json({
                error: "Faltan parámetros."
            });

        }

        // Buscar el psicólogo
        const profesional = profesionales.find(
            p => p.calendarId === calendarId
        );

        if (!profesional) {

            return res.status(404).json({
                error: "Profesional no encontrado."
            });

        }

        // Obtener el día de la semana
        const dias = [
            "domingo",
            "lunes",
            "martes",
            "miercoles",
            "jueves",
            "viernes",
            "sabado"
        ];

        const dia = dias[new Date(`${fecha}T12:00:00`).getDay()];

        const horario = profesional.horario[dia];

        // Si ese día no trabaja
        if (!horario) {

            return res.json([]);

        }

        const agenda = await obtenerAgenda(

            calendarId,

            fecha,

            horario.inicio,

            horario.fin

        );

        res.json(agenda);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});

module.exports = router;