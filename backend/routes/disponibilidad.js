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

        // Buscar el psicólogo para conocer su horario
        const profesional = profesionales.find(
            p => p.calendarId === calendarId
        );

        if (!profesional) {

            return res.status(404).json({
                error: "Profesional no encontrado."
            });

        }

        const agenda = await obtenerAgenda(

            calendarId,

            fecha,

            profesional.horario.inicio,

            profesional.horario.fin

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