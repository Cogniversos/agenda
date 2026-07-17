const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
    keyFile: "cogniversos-agenda-35eb42a050d1.json",
    scopes: ["https://www.googleapis.com/auth/calendar"]
});

module.exports = {
    google,
    auth
};