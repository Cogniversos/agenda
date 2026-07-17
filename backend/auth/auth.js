const fs = require("fs").promises;
const path = require("path");

const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

const SCOPES = [
    "https://www.googleapis.com/auth/calendar"
];

const TOKENS_FOLDER = path.join(__dirname, "tokens");

const CREDENTIALS_PATH = path.join(
    __dirname,
    "..",
    "client_secret_109258926584-1e5pl3pjtcbtp64hre0l45mkp010449n.apps.googleusercontent.com.json"
);

function obtenerRutaToken(nombreToken) {
    return path.join(TOKENS_FOLDER, `${nombreToken}.json`);
}

async function asegurarCarpetaTokens() {
    try {
        await fs.mkdir(TOKENS_FOLDER, { recursive: true });
    } catch {}
}

async function cargarCredencialesGuardadas(nombreToken) {

    try {

        const contenido = await fs.readFile(obtenerRutaToken(nombreToken));

        const credenciales = JSON.parse(contenido);

        return google.auth.fromJSON(credenciales);

    } catch {

        return null;

    }

}

async function guardarCredenciales(client, nombreToken) {

    const contenido = await fs.readFile(CREDENTIALS_PATH);

    const keys = JSON.parse(contenido);

    const key = keys.installed || keys.web;

    const payload = JSON.stringify({

        type: "authorized_user",

        client_id: key.client_id,

        client_secret: key.client_secret,

        refresh_token: client.credentials.refresh_token

    });

    await asegurarCarpetaTokens();

    await fs.writeFile(
        obtenerRutaToken(nombreToken),
        payload
    );

}

async function autorizar(nombreToken) {

    let client = await cargarCredencialesGuardadas(nombreToken);

    if (client) {

        return client;

    }

    client = await authenticate({

        scopes: SCOPES,

        keyfilePath: CREDENTIALS_PATH

    });

    if (client.credentials) {

        await guardarCredenciales(client, nombreToken);

    }

    return client;

}

module.exports = autorizar;