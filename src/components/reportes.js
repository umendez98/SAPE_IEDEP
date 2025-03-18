import React, { useState, useEffect } from "react";
import "./reportes.css";
import Logo from "../images/logo.png";
import ExportIcon from "../assets/export.svg";
import { obtenerUsuariosPorNombre, obtenerRegistrosPorIdUsuario, obtenerUsuariosPorExpediente } from "./consumidor.js";

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
        let usuarios = [];
        if (/^\d+$/.test(searchTerm)) {
          usuarios = await obtenerUsuariosPorExpediente(searchTerm);
        } else {
          usuarios = await obtenerUsuariosPorNombre(searchTerm);
        }

        if (usuarios && usuarios.length > 0) {
          const usersWithRecords = await Promise.all(
            usuarios.map(async (user) => {
              let idint = parseInt(usuarios[0][1]);
              const registros = await obtenerRegistrosPorIdUsuario(idint);
              return {
                id: user[0],
                name: `${user[0]} ${user[3]} ${user[4]}`,
                expediente: user[2],
                registros: registros,
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

  // Función para exportar datos a CSV
  const exportToCSV = () => {
    if (results.length === 0) return;

    const csvRows = [];
    csvRows.push("Expediente,Fecha,Hora,Registro");

    results.forEach((person) => {
      person.registros
        .filter((registro) => (selectedDate ? registro[4].slice(0, 10) === selectedDate : true))
        .forEach((registro) => {
          csvRows.push(`${person.expediente},${registro[4].slice(0, 10)},${registro[4].slice(11, 16)},${registro[0]}`);
        });
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reportes.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="reportes-container">
      <img src={Logo} alt="IEDEP Logo" className="logo" />

      <div className="search-section">
        <label className="search-label">Buscar:</label>
        <input
          type="text"
          placeholder="Nombre o expediente"
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="filter-section">
        <label className="filter-label">Filtros</label>
        <div className="date-export-container">
          <input
            type="date"
            className="date-picker"
            value={selectedDate}
            onChange={handleDateSelect}
          />
        </div>
      </div>

      <div className="export-section">
        <img
            src={ExportIcon}
            alt="Export Icon"
            className={`export-icon ${results.length === 0 ? "disabled" : ""}`}
            onClick={results.length > 0 ? exportToCSV : null}
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
                        <th>Registro</th>
                      </tr>
                    </thead>
                    <tbody>
                      {console.log(person)}
                      {person.registros
                        .filter((registro) => (selectedDate ? registro[4].slice(0, 10) === selectedDate : true))
                        .map((registro, index) => (
                          <tr key={index}>
                            <td>{person.expediente}</td>
                            <td>{registro[4].slice(0, 10)}</td>
                            <td>{registro[4].slice(11, 16)}</td>
                            <td>{registro[0]}</td>
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
