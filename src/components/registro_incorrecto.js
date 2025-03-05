import React, { useState, useEffect } from "react";
import "./registro_incorrecto.css";
import Logo from "../images/logo.png";
import ForbbidenIcon from "../assets/forbidden.svg";
import { useNavigate } from "react-router-dom";

const RegistroIncorrecto = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [errorMensaje, setErrorMensaje] = useState("No se pudo registrar la asistencia.");
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el mensaje de error de sessionStorage
    const storedError = sessionStorage.getItem("errorRegistro");
    if (storedError) {
      setErrorMensaje(storedError);
      console.error("Error en registro:", storedError); // Imprime el error en la consola
    }

    // Actualizar la hora cada segundo
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="registro-container">
      <img src={Logo} alt="IEDEP Logo" className="logo" />
      <h2 className="time">{time}</h2>

      <img src={ForbbidenIcon} alt="Forbidden Icon" className="forbidden-icon" />

      <button className="error-button">{errorMensaje}</button>
      <button className="inicio-button" onClick={() => navigate("/")}>Inicio</button>
    </div>
  );
};

export default RegistroIncorrecto;
