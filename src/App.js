import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./components/main";
import RegistroCorrecto from "./components/registro_correcto";
import RegistroIncorrecto from "./components/registro_incorrecto";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/registro-correcto" element={<RegistroCorrecto />} />
        <Route path="/registro-incorrecto" element={<RegistroIncorrecto />} />
      </Routes>
    </Router>
  );
}

export default App;
