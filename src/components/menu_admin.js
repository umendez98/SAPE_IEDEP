import React from "react";
import { useNavigate } from "react-router-dom";
import "./menu_admin.css";
import Logo from "../images/logo.png";

const Menu_Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      <img src={Logo} alt="IEDEP Logo" className="logo" />

      <div className="button-container">
        <button className="main-button" onClick={() => navigate("/")}>Registro</button>
        <button className="main-button" onClick={() => navigate("/reportes")}>Reportes</button>
      </div>
    </div>
  );
};

export default Menu_Admin;
