let profesionales = [];

async function cargarProfesionales() {

    profesionales = await obtenerProfesionales();

    const lista =
        document.getElementById(
            "listaProfesionales"
        );

    lista.innerHTML = "";

    profesionales.forEach(p => {

        const boton =
            document.createElement("button");

        boton.textContent = p.nombre;

        boton.className =
            "w-full p-3 rounded-lg bg-slate-700 hover:bg-violet-700 transition text-left";

        boton.onclick = () => {

            profesionalSeleccionado = p;

            document
                .querySelectorAll("#listaProfesionales button")
                .forEach(b => {

                    b.style.outline = "none";
                    b.classList.remove("bg-violet-700");

                });

            boton.style.outline =
                "3px solid #8b5cf6";

            boton.classList.add("bg-violet-700");

            document.getElementById(
                "profesionalActual"
            ).textContent = p.nombre;

            document.getElementById(
                "disponibilidadActual"
            ).textContent = p.disponibilidad;

            document.getElementById(
                "resultado"
            ).classList.add("hidden");

            cargarAgenda();

        };

        lista.appendChild(boton);

    });

    // Seleccionar automáticamente el primero

    if (profesionales.length > 0) {

        lista.firstElementChild.click();

    }

}

window.addEventListener(
    "load",
    cargarProfesionales
);