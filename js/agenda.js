let profesionalSeleccionado = null;

document
    .getElementById("fecha")
    .addEventListener("change", cargarAgenda);

async function cargarAgenda() {

    if (!profesionalSeleccionado) return;

    const fecha = document.getElementById("fecha").value;

    if (!fecha) return;

    try {

        const agenda = await obtenerDisponibilidad(

            profesionalSeleccionado.calendarId,

            fecha

        );

        pintarAgenda(agenda);

    }

    catch (e) {

        console.error(e);

        alert("No se pudo cargar la agenda.");

    }

}

function pintarAgenda(agenda) {

    const contenedor =
        document.getElementById("horarios");

    contenedor.innerHTML = "";

    agenda.forEach(bloque => {

        const tarjeta =
            document.createElement("div");

        tarjeta.className =
            "rounded-xl p-4 shadow transition";

        if (bloque.ocupado) {

            tarjeta.classList.add(
                "bg-red-700",
                "border",
                "border-red-500"
            );

            tarjeta.innerHTML = `

                <div class="text-lg font-bold mb-2">
                    ${bloque.hora}
                </div>

                <div class="font-semibold">
                    ${bloque.paciente || "Paciente"}
                </div>

                <div class="text-sm text-red-100 break-all">
                    ${bloque.correo || ""}
                </div>

            `;

        }

        else {

            tarjeta.classList.add(
                "bg-green-700",
                "hover:bg-green-600",
                "cursor-pointer"
            );

            tarjeta.innerHTML = `

                <div class="text-lg font-bold">
                    ${bloque.hora}
                </div>

                <div class="text-sm mt-2">
                    Disponible
                </div>

            `;

            tarjeta.onclick = () => abrirModal(bloque.hora);

        }

        contenedor.appendChild(tarjeta);

    });

}