function generarBloques(inicio, fin, duracion = 20) {

    const bloques = [];

    let actual = new Date(`2000-01-01T${inicio}:00`);
    const limite = new Date(`2000-01-01T${fin}:00`);

    while (actual < limite) {

        bloques.push(
            actual.toTimeString().substring(0,5)
        );

        actual = new Date(
            actual.getTime() + duracion * 60000
        );

    }

    return bloques;

}

function horaAMinutos(hora){

    const [h,m]=hora.split(":").map(Number);

    return h*60+m;

}

module.exports = {

    generarBloques,
    horaAMinutos

};
