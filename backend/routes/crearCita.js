const express = require("express");
const crypto = require("crypto");
const { google } = require("googleapis");

const obtenerAuth = require("../services/googleAuthService");
const profesionales = require("../data/profesionales");

const router = express.Router();

router.post("/", async (req, res) => {

    try {

        const {
            calendarId,
            nombre,
            correo,
            celular,
            fecha,
            hora,
            motivo
        } = req.body;

        if (
            !calendarId ||
            !nombre ||
            !correo ||
            !fecha ||
            !hora
        ) {

            return res.status(400).json({
                error: "Faltan datos obligatorios."
            });

        }

        const profesional = profesionales.find(
            p => p.calendarId === calendarId
        );

        if (!profesional) {

            return res.status(404).json({
                error: "Profesional no encontrado."
            });

        }

        const auth = await obtenerAuth(profesional.token);

        const calendar = google.calendar({

            version: "v3",
            auth

        });

        const inicio = new Date(`${fecha}T${hora}:00-05:00`);
        const fin = new Date(inicio.getTime() + 40 * 60000);

        const evento = await calendar.events.insert({

            calendarId,

            conferenceDataVersion: 1,

            requestBody: {

                summary: `${nombre} y ${profesional.nombre} - Cogniversos`,

                description:
`Paciente: ${nombre}

Correo: ${correo}

Celular: ${celular || "No registrado"}

Motivo:
${motivo || "No registrado"}`,

                start: {

                    dateTime: inicio.toISOString(),
                    timeZone: "America/Bogota"

                },

                end: {

                    dateTime: fin.toISOString(),
                    timeZone: "America/Bogota"

                },

                conferenceData: {

                    createRequest: {

                        requestId: crypto.randomUUID(),

                        conferenceSolutionKey: {

                            type: "hangoutsMeet"

                        }

                    }

                }

            }

        });

        const fechaBonita = inicio.toLocaleDateString(
            "es-CO",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

        const horaBonita = inicio.toLocaleTimeString(
            "es-CO",
            {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            }
        );

        const mensaje =
`Te confirmo la cita 😊

${fechaBonita}
${horaBonita}

Profesional en psicología: ${profesional.nombre}

Link de Google Meet de tu sesión:
${evento.data.hangoutLink}

Recuerda que puedes hacer el pago de la sesión hasta 1 hora antes por la llave:

${profesional.llavePago}

En caso de que necesites cancelar o reagendar, debes hacerlo con mínimo 12 horas de anticipación. Si lo haces después de este tiempo, deberás asumir el costo total de la sesión, dado que ese espacio ya estaba reservado en la agenda de la psicóloga 😊`;

        res.json({

            ok: true,

            id: evento.data.id,

            meet: evento.data.hangoutLink,

            evento: evento.data.htmlLink,

            mensaje

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            error: err.message

        });

    }

});

module.exports = router;