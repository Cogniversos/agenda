const API = "https://agenda-fcmt.onrender.com";

async function obtenerProfesionales() {

    const respuesta = await fetch(`${API}/profesionales`);

    if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los profesionales");
    }

    return await respuesta.json();

}

async function obtenerDisponibilidad(calendarId, fecha) {

    const respuesta = await fetch(
        `${API}/disponibilidad?calendarId=${encodeURIComponent(calendarId)}&fecha=${fecha}`
    );

    if (!respuesta.ok) {
        throw new Error("No se pudo consultar la disponibilidad");
    }

    return await respuesta.json();

}

async function apiCrearCita(datos) {

    const respuesta = await fetch(`${API}/crear-cita`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    const json = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(json.error || "Error al crear la cita.");
    }

    return json;

}