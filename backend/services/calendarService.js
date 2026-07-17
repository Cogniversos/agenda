const { google } = require("googleapis");

const obtenerAuth = require("./googleAuthService");

const {
    generarBloques,
    horaAMinutos
} = require("../utils/horarios");

const profesionales = require("../data/profesionales");

// Obtiene una instancia del calendario del profesional
async function obtenerCalendar(calendarId) {

    const profesional = profesionales.find(
        p => p.calendarId === calendarId
    );

    if (!profesional) {
        throw new Error("Profesional no encontrado.");
    }

    const auth = await obtenerAuth(profesional.token);

    return google.calendar({
        version: "v3",
        auth
    });

}

// Devuelve los eventos de un día
async function obtenerEventos(calendarId, fecha) {

    const calendar = await obtenerCalendar(calendarId);

    const inicioDia = new Date(`${fecha}T00:00:00-05:00`);
    const finDia = new Date(`${fecha}T23:59:59-05:00`);

    const response = await calendar.events.list({

        calendarId,

        timeMin: inicioDia.toISOString(),

        timeMax: finDia.toISOString(),

        singleEvents: true,

        orderBy: "startTime"

    });

    return response.data.items;

}

// Extrae los datos guardados en la descripción
function obtenerDato(descripcion, campo) {

    if (!descripcion) return "";

    const regex = new RegExp(`${campo}:\\s*(.*)`, "i");

    const encontrado = descripcion.match(regex);

    return encontrado ? encontrado[1].trim() : "";

}

// Devuelve la agenda lista para mostrar
async function obtenerAgenda(calendarId, fecha, horaInicio, horaFin) {

    const eventos = await obtenerEventos(
        calendarId,
        fecha
    );

    const bloques = generarBloques(
        horaInicio,
        horaFin
    );

    return bloques.map(hora => {

        const minutosBloque = horaAMinutos(hora);

        for (const evento of eventos) {

            if (!evento.start.dateTime || !evento.end.dateTime) {
                continue;
            }

            const inicio = horaAMinutos(
                evento.start.dateTime.substring(11,16)
            );

            const fin = horaAMinutos(
                evento.end.dateTime.substring(11,16)
            );

            if (
                minutosBloque >= inicio &&
                minutosBloque < fin
            ) {

                return {

                    hora,

                    ocupado: true,

                    paciente: obtenerDato(
                        evento.description,
                        "Paciente"
                    ),

                    correo: obtenerDato(
                        evento.description,
                        "Correo"
                    ),

                    celular: obtenerDato(
                        evento.description,
                        "Celular"
                    ),

                    motivo: obtenerDato(
                        evento.description,
                        "Motivo"
                    )

                };

            }

        }

        return {

            hora,

            ocupado: false,

            paciente: "",

            correo: "",

            celular: "",

            motivo: ""

        };

    });

}

module.exports = {

    obtenerEventos,
    obtenerAgenda

};