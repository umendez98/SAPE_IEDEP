import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./main.css";
import Logo from "../images/logo.png";
import { obtenerUsuariosPorExpediente, comprobarRegistros, comprobarLugar, obtenerLocacionPorID } from "./consumidor.js";

// Obtener lugar actual
let latitud;
let longitud;
navigator.geolocation.getCurrentPosition(
  function (position) {
    latitud = position.coords.latitude;
    longitud = position.coords.longitude;
    console.log(latitud, longitud);
  },
  function (error) {
    console.error("Error al obtener la ubicación", error);
  }
);

const Main = () => {
  const [expediente, setExpediente] = useState("");
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Función para obtener el expediente almacenado en la cookie
  const getExpedienteFromCookie = () => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      if (cookie.startsWith("expediente=")) {
        return cookie.split("=")[1];
      }
    }
    return null;
  };

  // Función para almacenar el expediente en la cookie
  const setExpedienteCookie = (expediente) => {
    document.cookie = `expediente=${expediente}; path=/; max-age=31536000`; // 1 año de duración
  };

  const handleInputChange = (e) => {
    setExpediente(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Expediente ingresado:", expediente);

    // Convertir expediente a número entero
    const expedienteInt = parseInt(expediente, 10);

    // Validar que sea un número válido
    if (isNaN(expedienteInt)) {
      console.error("Error: El expediente no es un número válido.");
      sessionStorage.setItem("errorRegistro", "El expediente ingresado no es un número válido.");
      navigate("/registro-incorrecto");
      return;
    }

    // Verificar si hay un expediente almacenado en la cookie
    const expedienteGuardado = getExpedienteFromCookie();
    if (expedienteGuardado && expedienteGuardado !== expedienteInt.toString()) {
      console.error("Error: No puedes registrar otro expediente en este dispositivo.");
      sessionStorage.setItem("errorRegistro", "No puedes registrar otro expediente en este dispositivo.");
      navigate("/registro-incorrecto");
      return;
    }

    try {
      // Validar si el usuario existe en la API
      const usuario = await obtenerUsuariosPorExpediente(expedienteInt);
      console.log("Usuario obtenido:", usuario);

      if (usuario && usuario.length > 0) {
        console.log("Usuario válido:", usuario);

        // Acceder a los atributos del usuario
        const id_usuario = parseInt(usuario[0][1], 10); // ID del usuario
        const apellido_materno = usuario[0][4]; // Apellido Materno
        const apellido_paterno = usuario[0][3]; // Apellido Paterno
        const nombre_usuario = usuario[0][0]; // Nombre
        const id_lugar = parseInt(usuario[0][6]); // ID de la locación

        // Obtener locación por ID
        const lugar = await obtenerLocacionPorID(id_lugar);
        const estaEnLugar = await comprobarLugar(latitud, longitud, lugar[0][1]);
        console.log("Está en el lugar correcto:", estaEnLugar);

        // Concatenar nombre completo
        const nombre_completo = `${nombre_usuario} ${apellido_paterno} ${apellido_materno}`;

        console.log("ID de usuario:", id_usuario);
        console.log("Nombre completo:", nombre_completo);

        // Verificación de datos antes de enviar
        console.log("Enviando a registrar entrada:");
        console.log("tipo_registro:", "entrada");
        console.log("id_usuario:", id_usuario, " (Tipo:", typeof id_usuario, ")");
        console.log("id_lugar:", id_lugar, " (Tipo:", typeof id_lugar, ")");

        // Validar que id_usuario sea un número válido antes de registrar
        if (isNaN(id_usuario)) {
          console.error("Error: ID de usuario inválido.");
          sessionStorage.setItem("errorRegistro", "El ID del usuario obtenido no es válido.");
          navigate("/registro-incorrecto");
          return;
        }

        if (!estaEnLugar) {
          console.error("Error: Lugar incorrecto");
          sessionStorage.setItem("errorRegistro", "No estás en tu sede");
          navigate("/registro-incorrecto");
          return;
        }

        // Registrar entrada en la API
        const registro = await comprobarRegistros(id_usuario, id_lugar);
        let tipo_registro = registro.tipo_registro;
        let fecha_hora = String(registro.fechayHora);

        // Guardar datos del usuario en sessionStorage
        sessionStorage.setItem(
          "usuario",
          JSON.stringify({
            nombre: nombre_completo,
            expediente: expedienteInt,
            fecha_hora: fecha_hora,
            tipo_registro: tipo_registro,
          })
        );

        // Almacenar expediente en la cookie
        setExpedienteCookie(expedienteInt);

        // Redirigir a registro_correcto
        navigate("/registro-correcto");
      } else {
        console.log("Usuario no encontrado");
        sessionStorage.setItem("errorRegistro", "El expediente ingresado no pertenece a ningún usuario registrado.");
        navigate("/registro-incorrecto");
      }
    } catch (error) {
      console.error("Error al validar el usuario:", error);

      // Guardar el mensaje de error en sessionStorage
      sessionStorage.setItem("errorRegistro", error.message || "Error desconocido al registrar asistencia.");

      // Redirigir a registro_incorrecto
      navigate("/registro-incorrecto");
    }
  };

  return (
    <div className="main-container">
      <img src={Logo} alt="IEDEP Logo" className="logo" />
      <h2 className="time">{time}</h2>

      <form onSubmit={handleSubmit} className="main-form">
        <label htmlFor="expediente" className="input-label">Ingresa tu expediente:</label>
        <input
          type="text"
          id="expediente"
          placeholder="Expediente"
          className="input-field"
          value={expediente}
          onChange={handleInputChange}
        />
        <button type="submit" className="main-button">Ingresar</button>
      </form>
    </div>
  );
};

export default Main;
