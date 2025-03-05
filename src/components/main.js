import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./main.css";
import Logo from "../images/logo.png";
import { obtenerUsuariosPorExpediente, registrarEntrada } from "./consumidor.js";

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

        // Concatenar nombre completo
        const nombre_completo = `${nombre_usuario} ${apellido_paterno} ${apellido_materno}`;

        console.log("ID de usuario:", id_usuario);
        console.log("Nombre completo:", nombre_completo);

        // Simulación de ID de locación (ajustar según API)
        const id_lugar = 1;

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

        // Guardar datos del usuario en sessionStorage
        sessionStorage.setItem(
          "usuario",
          JSON.stringify({
            nombre: nombre_completo,
            expediente: expedienteInt,
          })
        );

        // Registrar entrada en la API
        const registro = await registrarEntrada("entrada", id_usuario, id_lugar);
        console.log("Registro de entrada:", registro);

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
