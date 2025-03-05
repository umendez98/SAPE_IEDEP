import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import Logo from "../images/logo.png";
import { obtenerUsuariosPorExpediente } from "./consumidor.js";

const Login = () => {
  const [expediente, setExpediente] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "expediente") setExpediente(value);
    else if (id === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    // Convertir expediente a número entero
    const expedienteInt = parseInt(expediente, 10);
    if (isNaN(expedienteInt)) {
      setError("Expediente no válido.");
      return;
    }

    try {
      // Consultar usuario en la API
      const usuario = await obtenerUsuariosPorExpediente(expedienteInt);
      console.log("Usuario obtenido:", usuario);

      if (usuario && usuario.length > 0) {
        const id_usuario = parseInt(usuario[0][1], 10); // ID del usuario
        const nombre_usuario = usuario[0][3]; // Nombre
        const apellido_usuario = usuario[0][2]; // Apellido
        const rol_usuario = usuario[0][4]; // Rol (admin, usuario normal)
        const password_api = usuario[0][5]; // Contraseña desde API

        // Verificar si el usuario es administrador
        if (rol_usuario !== "admin") {
          setError("No tienes permisos de administrador.");
          return;
        }

        // Validar la contraseña (esto debería manejarse con hashing en un backend seguro)
        if (password !== password_api) {
          setError("Contraseña incorrecta.");
          return;
        }

        // Guardar sesión en sessionStorage
        sessionStorage.setItem(
          "admin",
          JSON.stringify({
            id: id_usuario,
            nombre: `${nombre_usuario} ${apellido_usuario}`,
            expediente: expedienteInt,
          })
        );

        // Redirigir al menú de administración
        navigate("/menu-admin");
      } else {
        setError("Expediente no encontrado.");
      }
    } catch (error) {
      console.error("Error al validar el usuario:", error);
      setError("Error al conectar con la API.");
    }
  };

  return (
    <div className="login-container">
      <img src={Logo} alt="IEDEP Logo" className="logo" />
      <h2 className="title">Administrador</h2>

      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="expediente" className="input-label">Ingresa tu expediente:</label>
        <input
          type="text"
          id="expediente"
          placeholder="Expediente"
          className="input-field"
          value={expediente}
          onChange={handleInputChange}
        />

        <label htmlFor="password" className="input-label">Ingresa tu contraseña:</label>
        <input
          type="password"
          id="password"
          placeholder="Contraseña"
          className="input-field"
          value={password}
          onChange={handleInputChange}
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="login-button">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;
