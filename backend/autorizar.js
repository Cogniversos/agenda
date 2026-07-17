const autorizar = require("./auth/auth");

const nombre = process.argv[2];

if (!nombre) {

    console.log("");
    console.log("Uso:");
    console.log("node autorizar.js milena");
    console.log("");

    process.exit();

}

autorizar(nombre)
.then(() => {

    console.log("");
    console.log("==================================");
    console.log("Cuenta autorizada correctamente");
    console.log(`Token guardado: auth/tokens/${nombre}.json`);
    console.log("==================================");

})
.catch(console.error);