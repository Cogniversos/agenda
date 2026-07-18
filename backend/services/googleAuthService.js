const fs = require("fs").promises;
const path = require("path");
const { google } = require("googleapis");

const CREDENTIALS_PATH = path.join(
    __dirname,
    "..",
    "client_secret_109258926584-f061qokltts61297fb3l6t28ijfj7lbu.apps.googleusercontent.com.json"
);

const TOKENS = {
    milena: "TOKEN_MILENA",
    alejandra: "TOKEN_ALEJANDRA",
    johanna: "TOKEN_JOHANNA",
    tatiana: "TOKEN_TATIANA",
    elemileth: "TOKEN_ELEMILETH",
    daniel: "TOKEN_DANIEL",
    analucia: "TOKEN_ANALUCIA",
    karen: "TOKEN_KAREN"
};

async function obtenerCredenciales() {

    if (process.env.GOOGLE_CREDENTIALS) {
        return JSON.parse(process.env.GOOGLE_CREDENTIALS);
    }

    const contenido = await fs.readFile(CREDENTIALS_PATH, "utf8");
    return JSON.parse(contenido);

}

async function obtenerToken(nombreToken) {

    const variable = TOKENS[nombreToken.toLowerCase()];

    if (variable && process.env[variable]) {
        return JSON.parse(process.env[variable]);
    }

    const tokenPath = path.join(
        __dirname,
        "..",
        "auth",
        "tokens",
        `${nombreToken}.json`
    );

    const contenido = await fs.readFile(tokenPath, "utf8");
    return JSON.parse(contenido);

}

async function obtenerAuth(nombreToken) {

    const credenciales = await obtenerCredenciales();
    const token = await obtenerToken(nombreToken);

    const datos = credenciales.web || credenciales.installed;

    const oauth2Client = new google.auth.OAuth2(
        datos.client_id,
        datos.client_secret,
        datos.redirect_uris[0]
    );

    oauth2Client.setCredentials(token);

    return oauth2Client;

}

module.exports = obtenerAuth;