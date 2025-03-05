import React, { useState, useEffect } from "react";
import "./reportes.css";
import Logo from "../images/logo.png";
import { obtenerUsuariosPorNombre, obtenerRegistrosPorIdUsuario } from "./consumidor.js";

const Reportes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setResults([]);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const usuarios = await obtenerUsuariosPorNombre(searchTerm);
        if (usuarios && usuarios.length > 0) {
          const usersWithRecords = await Promise.all(
            usuarios.map(async (user) => {
              const registros = await obtenerRegistrosPorIdUsuario(user[0][1]); // user[1] = ID de usuario
              return {
                id: user[1],
                name: `${user[0][0]} ${user[0][3]} ${user[0][4]}`, // user[0][0] = Nombre, user[0][3] = Apellido Paterno, user[0][4] = Apellido Materno
                expediente: user[0], // user[0] = Expediente
                registros: registros || [],
              };
            })
          );
          setResults(usersWithRecords);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setError("No se pudieron cargar los datos.");
      }
      setLoading(false);
    };

    fetchUsers();
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateSelect = (e) => {
    setSelectedDate(e.target.value);
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="reportes-container">
      <img src={Logo} alt="IEDEP Logo" className="logo" />

      <div className="search-section">
        <label className="search-label">Buscar:</label>
        <input
          type="text"
          placeholder="Nombre, expediente o ID"
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="search-button">Buscar</button>
      </div>

      <div className="filter-section">
        <label className="filter-label">Filtros</label>
        <input
          type="date"
          className="date-picker"
          value={selectedDate}
          onChange={handleDateSelect}
        />
      </div>

      <div className="results-container">
        {loading ? (
          <p className="loading">Cargando...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : results.length > 0 ? (
          results.map((person) => (
            <div key={person.id} className="result-item">
              <div className="result-header" onClick={() => toggleRow(person.id)}>
                {person.name}
                <span className="toggle-icon">{expandedRows[person.id] ? "▲" : "▼"}</span>
              </div>
              {expandedRows[person.id] && person.registros.length > 0 && (
                <div className="result-details">
                  <table>
                    <thead>
                      <tr>
                        <th>Exp</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Sede</th>
                        <th>Registro</th>
                      </tr>
                    </thead>
                    <tbody>
                      {person.registros
                        .filter((registro) => (selectedDate ? registro.fecha === selectedDate : true))
                        .map((registro, index) => (
                          <tr key={index}>
                            <td>{person.expediente}</td>
                            <td>{registro.fecha}</td>
                            <td>{registro.hora}</td>
                            <td>{registro.sede}</td>
                            <td>{registro.tipo}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-results">No se encontraron registros.</p>
        )}
      </div>
    </div>
  );
};

export default Reportes;
