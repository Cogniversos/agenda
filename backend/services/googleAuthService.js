const fs = require("fs").promises;
const path = require("path");
const { google } = require("googleapis");

const CREDENTIALS_PATH = path.join(
    __dirname,
    "..",
    "client_secret_109258926584-1e5pl3pjtcbtp64hre0l45mkp010449n.apps.googleusercontent.com.json"
);

async function obtenerAuth(nombreToken) {

    const tokenPath = path.join(
        __dirname,
        "..",
        "auth",
        "tokens",
        `${nombreToken}.json`
    );

    const [credencialesTexto, tokenTexto] = await Promise.all([
        fs.readFile(CREDENTIALS_PATH, "utf8"),
        fs.readFile(tokenPath, "utf8")
    ]);

    const credenciales = JSON.parse(credencialesTexto);
    const token = JSON.parse(tokenTexto);

    const datos = credenciales.installed || credenciales.web;

    const oauth2Client = new google.auth.OAuth2(
        datos.client_id,
        datos.client_secret,
        datos.redirect_uris[0]
    );

    oauth2Client.setCredentials(token);

    return oauth2Client;
}

module.exports = obtenerAuth;