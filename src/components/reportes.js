import React, { useState } from "react";
import "./reportes.css";
import Logo from "../images/logo.png";

const Reportes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  
  // Placeholder (hasta implementar los endpoints).
  const results = [
    {
      id: 1,
      name: "Moíses Espíndola",
      expediente: "1366",
      registros: [
        { fecha: "24/02/25", hora: "9:10", sede: "Central", tipo: "Entrada" },
        { fecha: "24/02/25", hora: "6:10", sede: "Central", tipo: "Salida" },
      ],
    },
    {
      id: 2,
      name: "Moíses Pérez",
      expediente: "1453",
      registros: [],
    },
    {
      id: 3,
      name: "Moíses Arango",
      expediente: "1523",
      registros: [],
    },
    {
      id: 4,
      name: "Moíses Muñoz",
      expediente: "1784",
      registros: [],
    },
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateSelect = (e) => {
    setSelectedDate(e.target.value);
    setShowCalendar(false);
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
        {results
          .filter(
            (person) =>
              person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              person.expediente.includes(searchTerm)
          )
          .map((person) => (
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
                      {person.registros.map((registro, index) => (
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
          ))}
      </div>
    </div>
  );
};

export default Reportes;
