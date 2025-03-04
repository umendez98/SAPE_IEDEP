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
      navigate("/registro-incorrecto");
      return;
    }

    try {
      // Validar si el usuario existe en la API
      const usuario = await obtenerUsuariosPorExpediente(expedienteInt);
      console.log("Usuario obtenido:", usuario);
      
      if (usuario && usuario.length > 0) {
        console.log("Usuario válido:", usuario);

        // Obtener ID del usuario y convertirlo en número entero
        const id_usuario = parseInt(usuario[0][1], 10);
        console.log("Usuario", usuario);
        console.log("ID de usuario:", id_usuario);
        const id_lugar = 1; // Simulación de ID de locación

        // Verificación de datos antes de enviar
        console.log("Enviando a registrar entrada:");
        console.log("tipo_registro:", "entrada");
        console.log("id_usuario:", id_usuario, " (Tipo:", typeof id_usuario, ")");
        console.log("id_lugar:", id_lugar, " (Tipo:", typeof id_lugar, ")");

        // Validar que id_usuario sea un número válido antes de registrar
        if (isNaN(id_usuario)) {
          console.error("Error: ID de usuario inválido.");
          navigate("/registro-incorrecto");
          return;
        }

        // Registrar entrada
        const registro = await registrarEntrada("entrada", id_usuario, id_lugar);
        console.log("Registro de entrada:", registro);

        // Redirigir a registro_correcto
        navigate("/registro-correcto");
      } else {
        console.log("Usuario no encontrado");
        navigate("/registro-incorrecto");
      }
    } catch (error) {
      console.error("Error al validar el usuario:", error);
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
