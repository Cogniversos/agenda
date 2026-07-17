const resultado = document.getElementById("resultado");

const meetInput = document.getElementById("meetLink");

const mensajeInput = document.getElementById("mensajeWhatsapp");

const toast = document.getElementById("toast");

function mostrarResultado(meet, mensaje) {

    meetInput.value = meet;

    mensajeInput.value = mensaje;

    resultado.classList.remove("hidden");

    resultado.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}

function copiarTexto(texto, mensajeToast) {

    if (!texto) return;

    if (navigator.clipboard && window.isSecureContext) {

        navigator.clipboard.writeText(texto)
            .then(() => {

                mostrarToast(mensajeToast);

            })
            .catch(() => {

                copiarFallback(texto, mensajeToast);

            });

    } else {

        copiarFallback(texto, mensajeToast);

    }

}

function copiarFallback(texto, mensajeToast) {

    const area = document.createElement("textarea");

    area.value = texto;

    area.style.position = "fixed";
    area.style.left = "-9999px";

    document.body.appendChild(area);

    area.focus();
    area.select();

    try {

        document.execCommand("copy");

        mostrarToast(mensajeToast);

    }
    catch {

        alert("No fue posible copiar automáticamente.");

    }

    document.body.removeChild(area);

}

function mostrarToast(texto) {

    toast.textContent = texto;

    toast.classList.remove("hidden");

    setTimeout(() => {

        toast.classList.add("hidden");

    }, 2000);

}

document
    .getElementById("copiarMeet")
    .addEventListener("click", () => {

        copiarTexto(

            meetInput.value,

            "✅ Link de Meet copiado"

        );

    });

document
    .getElementById("copiarMensaje")
    .addEventListener("click", () => {

        copiarTexto(

            mensajeInput.value,

            "✅ Mensaje copiado"

        );

    });