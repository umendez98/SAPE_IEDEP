import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./registro_correcto.css";
import Logo from "../images/logo.png";
import CheckIcon from "../assets/check.svg";

const RegistroCorrecto = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Imprimir datos almacenados en sessionStorage para depuración
    console.log("Session Storage:", sessionStorage.getItem("usuario"));

    // Obtener datos del usuario desde sessionStorage
    const storedUser = sessionStorage.getItem("usuario");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUsuario(parsedUser);
      } catch (error) {
        console.error("Error al parsear usuario:", error);
        //setTimeout(() => navigate("/"), 1000);
      }
    } else {
      console.warn("No hay usuario registrado en sessionStorage.");
      //setTimeout(() => navigate("/"), 1000);
    }

    // Actualizar la hora cada segundo
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="registro-container">
      <img src={Logo} alt="IEDEP Logo" className="logo" />
      <h2 className="time">{time}</h2>

      {usuario ? (
        <div className="user-info">
          <p className="name">{usuario.tipo_registro}</p>
          <p className="name">{usuario.nombre}</p>
          <p className="fecha">Fecha y hora: {usuario.fecha_hora}</p>
          <p className="expediente">Expediente: {usuario.expediente}</p>
        </div>
      ) : (
        <p className="loading">Cargando datos...</p>
      )}

      <img src={CheckIcon} alt="Check Icon" className="check-icon" />

      <button className="success-button" onClick={() => navigate("/")}>Inicio</button>
    </div>
  );
};

export default RegistroCorrecto;
