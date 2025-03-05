import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./components/main";
import RegistroCorrecto from "./components/registro_correcto";
import RegistroIncorrecto from "./components/registro_incorrecto";
import Menu_Admin from "./components/menu_admin";
import Reportes from "./components/reportes";
import Login from "./components/login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/registro-correcto" element={<RegistroCorrecto />} />
        <Route path="/registro-incorrecto" element={<RegistroIncorrecto />} />
        <Route path="/menu-admin" element={<Menu_Admin />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
