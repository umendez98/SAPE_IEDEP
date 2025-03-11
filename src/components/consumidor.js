///
///
/// Funciones de Locaciones
///
///
///
async function obtenerLocacionPorID(id_locacion) {
    try {
        const response = await fetch("https://luis.umegamentes.uk/IEDEP/api/servicios/locaciones/index.php", {
            method: "POST",
            headers: {
                "Authorization": "123",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id": id_locacion,
                "endPoint": "obtenerLocacionesPorId"
            }),
        });

        const datos = await response.json();
        if (datos.status !== 200) throw new Error("Error en la respuesta API");
        return JSON.parse(datos.data);
    } catch (error) {
        console.error("Error al obtener locación por ID:", error);
        return null;
    }
}

async function obtenerLocacionPorNombre(nombre_locacion) {
    try {
        const response = await fetch("https://luis.umegamentes.uk/IEDEP/api/servicios/locaciones/index.php", {
            method: "POST",
            headers: {
                "Authorization": "123",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "nombre": nombre_locacion,
                "endPoint": "obtenerLocacionesPorNombre"
            }),
        });

        const datos = await response.json();
        if (datos.status !== 200) throw new Error("Error en la respuesta API");
        return JSON.parse(datos.data);
    } catch (error) {
        console.error("Error al obtener locación por nombre:", error);
        return null;
    }
}



///
///
/// Funciones de Registros
///
///
///
async function obtenerRegistrosPorIdUsuario(id_usuario) {
    try {
        const response = await fetch("https://luis.umegamentes.uk/IEDEP/api/servicios/registros/index.php", {
            method: "POST",
            headers: {
                "Authorization": "123",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id_usuario": id_usuario,
                "endPoint": "obtenerRegistrosPorIdUsuario"
            }),
        });

        const datos = await response.json();
        if (datos.status !== 200) throw new Error("Error en la respuesta API");
        return JSON.parse(datos.data);
    } catch (error) {
        console.error("Error al obtener registros por ID de usuario:", error);
        return null;
    }
}

async function obtenerRegistrosPorIdLugar(id_lugar) {
    try {
        const response = await fetch("https://luis.umegamentes.uk/IEDEP/api/servicios/registros/index.php", {
            method: "POST",
            headers: {
                "Authorization": "123",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id_lugar": id_lugar,
                "endPoint": "obtenerRegistroPorIdLugar"
            }),
        });

        const datos = await response.json();
        if (datos.status !== 200) throw new Error("Error en la respuesta API");
        return JSON.parse(datos.data);
    } catch (error) {
        console.error("Error al obtener registros por ID de lugar:", error);
        return null;
    }
}



async function registrarEntrada(tipo_registro, id_usuario, id_lugar) {
    try {
        const response = await fetch("https://luis.umegamentes.uk/IEDEP/api/servicios/registros/index.php", {
            method: "POST",
            headers: {
                "Authorization": "123",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "tipo_registro": tipo_registro,
                "id_usuario": id_usuario,
                "id_lugar": id_lugar,
                "endPoint": "registrarEntrada"
            }),
        });

        //IMPRIMIR RESPUESTA ANTES DE PARSEARLA
        const responseText = await response.text();
        console.log("Respuesta cruda de la API:", responseText);

        // Convertir la respuesta a JSON
        const datos = JSON.parse(responseText);

        if (datos.status !== 200) throw new Error("Error en la respuesta API");
        return JSON.parse(datos.data);
    } catch (error) {
        console.error("Error al registrar entrada:", error);
        return null;
    }
}

///
///
/// Funciones de Usuarios
///
///
///
async function obtenerUsuariosPorID(id_usuario) {
    try {
        const response = await fetch("https://luis.umegamentes.uk/IEDEP/api/servicios/usuarios/index.php", {
            method: "POST",
            headers: {
                "Authorization": "123",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id": id_usuario,
                "endPoint": "obtenerUsuariosPorId"
            }),
        });

        const datos = await response.json();
        if (datos.status !== 200) throw new Error("Error en la respuesta API");
        return JSON.parse(datos.data);
    } catch (error) {
        console.error("Error al obtener usuario por ID:", error);
        return null;
    }
}

async function obtenerUsuariosPorExpediente(expediente) {
    try {
        const response = await fetch("https://luis.umegamentes.uk/IEDEP/api/servicios/usuarios/index.php", {
            method: "POST",
            headers: {
                "Authorization": "123",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "expediente": expediente,
                "endPoint": "obtenerUsuariosPorExpediente"
            }),
        });

        const datos = await response.json();
        if (datos.status !== 200) throw new Error("Error en la respuesta API");
        return JSON.parse(datos.data);
    } catch (error) {
        console.error("Error al obtener usuario por expediente:", error);
        return null;
    }
}

async function obtenerUsuariosPorNombre(nombre) {
    try {
        const response = await fetch("https://luis.umegamentes.uk/IEDEP/api/servicios/usuarios/index.php", {
            method: "POST",
            headers: {
                "Authorization": "123",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "nombre": nombre,
                "endPoint": "obtenerUsuariosPorNombre"
            }),
        });

        const datos = await response.json();
        if (datos.status !== 200) throw new Error("Error en la respuesta API");
        return JSON.parse(datos.data);
    } catch (error) {
        console.error("Error al obtener usuario por nombre:", error);
        return null;
    }
}

async function comprobarRegistros(id_usuario, id_lugar) {
    const registros = await obtenerRegistrosPorIdUsuario(id_usuario);
    if(registros.length ===0){
        console.log("PUS NO");
        const respuesta_registro = await registrarEntrada("entrada",id_usuario, id_lugar);
        return respuesta_registro;
    }else{

        let ultimo_registro = registros[0][0];
        if(ultimo_registro == "entrada"){
            //Ingresa salida
            const respuesta_registro = await registrarEntrada("salida",id_usuario, id_lugar);
            return respuesta_registro;
        }else{
            //Ingresa entrada
            const respuesta_registro = await registrarEntrada("entrada",id_usuario, id_lugar);
            return respuesta_registro;
        }
    }
        
}

async function login(expediente, password) {
    try {
        const response = await fetch("https://luis.umegamentes.uk/IEDEP/api/servicios/usuarios/index.php", {
            method: "POST",
            headers: {
                "Authorization": "123",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "expediente": expediente,
                "password": password,
                "endPoint": "login"
            }),
        });

        const datos = await response.json();
        if (datos.status !== 200) throw new Error("Error en la respuesta API");
        return JSON.parse(datos.data);
    } catch (error) {
        console.error("Error al obtener usuario por nombre:", error);
        return null;
    }
}

async function comprobarLugar(latitud, longitud, nombre) {
    let datos = await obtenerLocacionPorNombre(nombre);
    
    const lat1 = datos[0][2];
    const long1 = datos[0][3];
    
    // Convertir de grados a radianes
    function toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Distancia en el eje Y (latitud en metros)
    const distanciaLatitud = (latitud - lat1);
    
    // Distancia en el eje X (longitud en metros, corregida con cos(latitud))
    const distanciaLongitud = (longitud - long1) * (111320 * Math.cos(toRadians(latitud)));

    // Calcular la distancia euclidiana
    const distancia = Math.sqrt(distanciaLatitud**2 + distanciaLongitud**2);
    
    console.log(`Distancia: ${distancia.toFixed(1)} metros`);
    return distancia <= 50;
}



/*  **Pruebas de las funciones**
(async () => {
    console.log(await obtenerLocacionPorID(1));
    console.log(await obtenerLocacionPorNombre("dummy_Location"));
    console.log(await obtenerRegistrosPorIdUsuario(1));
    console.log(await obtenerRegistrosPorIdLugar(1));
    console.log(await registrarEntrada("entrada", 1, 1));
    console.log(await obtenerUsuariosPorID(1));
    console.log(await obtenerUsuariosPorExpediente(0));
    console.log(await obtenerUsuariosPorNombre("dummy"));
})();*/

export {login,obtenerLocacionPorID, obtenerLocacionPorNombre, obtenerRegistrosPorIdUsuario, obtenerRegistrosPorIdLugar, registrarEntrada, obtenerUsuariosPorID, obtenerUsuariosPorExpediente, obtenerUsuariosPorNombre, comprobarRegistros, comprobarLugar};
