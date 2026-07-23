async function enviarDatos(urlCompleta, datos) {
    const respuesta = await fetch(urlCompleta, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    const texto = await respuesta.text();
    let contenido;

    if (texto.trim() === '') {
        throw new Error(`Respuesta vacía del servidor (${respuesta.status})`);
    }

    try {
        contenido = JSON.parse(texto);
    } catch (error) {
        console.error('Error parseando JSON:', texto);
        throw new Error('Respuesta inválida del servidor.');
    }

    if (!respuesta.ok || contenido.exito === false) {
        throw new Error(contenido.mensaje || `Error del servidor (${respuesta.status})`);
    }

    return contenido.datos;
}