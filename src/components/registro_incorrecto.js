import React, { useState, useEffect } from "react";
import "./registro_incorrecto.css";
import Logo from "../images/logo.png";
import ForbbidenIcon from "../assets/forbidden.svg";

const RegistroIncorrecto = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
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

      <button className="error-button">Error, no te encuentras en tu sede IEDEP</button>
      <button className="inicio-button">Inicio</button>
    </div>
  );
};

export default RegistroIncorrecto;
