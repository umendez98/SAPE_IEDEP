import React, { useState, useEffect } from "react";
import "./registro_correcto.css";
import Logo from "../images/logo.png";
import CheckIcon from "../assets/check.svg";
import { useNavigate } from "react-router-dom";

const RegistroCorrecto = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const navigate = useNavigate();

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

      <div className="user-info">
        <p className="name">Moíses Espíndola Oropeza</p>
        <p className="expediente">Expediente: 1366</p>
      </div>

      <img src={CheckIcon} alt="Check Icon" className="check-icon" />

      <button className="success-button" onClick={() => navigate("/")}>Inicio</button>
    </div>
  );
};

export default RegistroCorrecto;
