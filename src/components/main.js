import React, { useState, useEffect } from "react";
import "./main.css";
import Logo from "../images/logo.png";

const Main = () => {
  const [expediente, setExpediente] = useState("");
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    setExpediente(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Expediente ingresado:", expediente);
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
