let horaSeleccionada = null;

document
    .getElementById("cerrarModal")
    .addEventListener("click", cerrarModal);

document
    .getElementById("crearCita")
    .addEventListener("click", guardarCita);

function abrirModal(hora) {

    horaSeleccionada = hora;

    document
        .getElementById("horaSeleccionada")
        .textContent = "Hora: " + hora;

    document
        .getElementById("modal")
        .classList.remove("hidden");

    document
        .getElementById("modal")
        .classList.add("flex");

    document
        .getElementById("nombre")
        .focus();

}

function cerrarModal() {

    document
        .getElementById("modal")
        .classList.add("hidden");

    document
        .getElementById("modal")
        .classList.remove("flex");

    document.getElementById("nombre").value = "";
    document.getElementById("correo").value = "";
    document.getElementById("celular").value = "";
    document.getElementById("motivo").value = "";

}

async function guardarCita() {

    const nombre =
        document.getElementById("nombre").value.trim();

    const correo =
        document.getElementById("correo").value.trim();

    const celular =
        document.getElementById("celular").value.trim();

    const motivo =
        document.getElementById("motivo").value.trim();

    if (!nombre) {

        alert("Escribe el nombre del paciente.");

        return;

    }

    if (!correo) {

        alert("El correo es obligatorio.");

        return;

    }

    try {

        const fecha =
            document.getElementById("fecha").value;

        const respuesta =
            await apiCrearCita({

                calendarId:
                    profesionalSeleccionado.calendarId,

                nombre,

                correo,

                celular,

                motivo,

                fecha,

                hora:
                    horaSeleccionada

            });

        cerrarModal();

        await cargarAgenda();

        mostrarResultado(

            respuesta.meet,

            respuesta.mensaje

        );

    }

    catch (e) {

        console.error(e);

        alert(e.message);

    }

}