import React, { useState, useEffect } from "react";
import { db } from "../firebase.js"; // pega seu arquivo firebase.js
import { collection, addDoc } from "firebase/firestore";

// Dados dos times
const teams = [
  {
    name: "Matira",
    sport: "Vôlei",
    icon: "fas fa-volleyball-ball",
    color: "#3b82f6",
  },
  {
    name: "Nexon",
    sport: "Basquete",
    icon: "fas fa-basketball-ball",
    color: "#ef4444",
  },
  {
    name: "Falxtra",
    sport: "Futsal",
    icon: "fas fa-futbol",
    color: "#8b5cf6",
  },
];

// Componente do Formulário de Inscrição
const EnrollmentForm = ({ team, onGoBack }) => {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    dataNascimento: "",
    email: "",
    numeroTelefone: "",
    sala: "",
    turno: "",
    anoEscolar: "",
    horarioTreino: "Contraturno",
    problemaSaude: "",
    time: team.name,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "inscricoes"), {
        ...formData,
        dataEnvio: new Date(),
      });
      console.log("Formulário enviado com sucesso!");
      setFormData({
        nomeCompleto: "",
        dataNascimento: "",
        email: "",
        numeroTelefone: "",
        sala: "",
        turno: "",
        anoEscolar: "",
        horarioTreino: "Contraturno",
        problemaSaude: "",
        time: team.name,
      });
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
    }
  };

  return (
    <div className="enrollment-form">
      <div className="form-header">
        <div className="header-info">
          <i className={team.icon} style={{ color: team.color }}></i>
          <h2>Inscrição - {team.name}</h2>
        </div>
        <div className="team-info">
          <span>
            {team.name} - {team.sport}
          </span>
          <i className={team.icon} style={{ color: team.color }}></i>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="nomeCompleto">Nome Completo</label>
            <input
              type="text"
              id="nomeCompleto"
              name="nomeCompleto"
              value={formData.nomeCompleto}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row three-cols">
          <div className="form-group">
            <label htmlFor="email">Email(não obrigatorio)</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="numeroTelefone">Número de Telefone</label>
            <input
              type="tel"
              id="numeroTelefone"
              name="numeroTelefone"
              value={formData.numeroTelefone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="problemaSaude">Problema de Saúde?</label>
            <input
              type="text"
              id="problemaSaude"
              name="problemaSaude"
              placeholder="Descreva, se houver"
              value={formData.problemaSaude}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row three-cols">
          <div className="form-group">
            <label htmlFor="anoEscolar">Série</label>
            <input
              type="number"
              id="anoEscolar"
              name="anoEscolar"
              value={formData.anoEscolar}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="sala">Turma</label>
            <input
              type="text"
              id="sala"
              name="sala"
              value={formData.sala}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="turno">Turno</label>
            <select
              id="turno"
              name="turno"
              value={formData.turno}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o turno</option>
              <option value="Manhã">Matutino (Manhã)</option>
              <option value="Tarde">Vespertino (Tarde)</option>
            </select>
          </div>
        </div>
        <div className="form-row three-cols">
          <div className="form-group">
            <label htmlFor="dataNascimento">Data de Nascimento</label>
            <input
              type="date"
              id="dataNascimento"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="horarioTreino">Horário de Treino</label>
            <select
              id="horarioTreino"
              name="horarioTreino"
              value={formData.horarioTreino}
              onChange={handleChange}
            >
              <option value="Contraturno">Contraturno</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onGoBack} className="back-button">
            Voltar
          </button>
          <button type="submit" className="submit-button">
            Enviar Inscrição
          </button>
        </div>
      </form>
    </div>
  );
};

// Componente Principal
function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const introTimeout = setTimeout(() => {
      setShowIntro(false);
    }, 4000);

    return () => clearTimeout(introTimeout);
  }, []);

  const handleCardClick = (team) => {
    setSelectedTeam(team);
  };

  const handleGoBack = () => {
    setSelectedTeam(null);
  };

  return (
    <div className="home">
      {/* Font Awesome */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />
      {/* Google Fonts */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
      />

      {/* Intro */}
      {showIntro && !selectedTeam && (
        <div className="intro">
          <div className="intro-icons">
            {teams.map((team, i) => (
              <div
                key={i}
                className="intro-circle"
                style={{ background: team.color }}
              >
                <i className={team.icon}></i>
              </div>
            ))}
          </div>
          <div className="intro-text">
            <h1>Solarys</h1>
            <p>Nós somos a nova geração</p>
          </div>
        </div>
      )}

      {/* Conteúdo */}
      {!showIntro && !selectedTeam && (
        <div className="content">
          <div className="banner">
            <h2>
              <i className="fas fa-trophy"></i> Movimento e Transformação
            </h2>
            <p>Junte-se ao melhor</p>
          </div>

          <h3 className="title">Escolha sua modalidade</h3>

          <div className="cards">
            {teams.map((team, index) => (
              <div
                key={index}
                className="card"
                onClick={() => handleCardClick(team)}
              >
                <div
                  className="card-icon"
                  style={{
                    boxShadow: `0 0 40px ${team.color}, inset 0 0 10px #000`,
                  }}
                >
                  <i
                    className={team.icon}
                    style={{
                      backgroundImage: `linear-gradient(135deg, white, ${team.color})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  ></i>
                </div>
                <h4>{team.name}</h4>
                <p>{team.sport}</p>
                <div className="colors">
                  <div
                    className="color"
                    style={{ background: team.color }}
                  ></div>
                  <div className="color border"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulário */}
      {selectedTeam && (
        <div className="content">
          <EnrollmentForm team={selectedTeam} onGoBack={handleGoBack} />
        </div>
      )}

      {/* CSS */}
      <style>{`
        body, html, .home {
          margin: 0;
          padding: 0;
          font-family: 'Poppins', sans-serif;
          background: #0a0a14;
          color: #fff;
          min-height: 100vh;
        }

        /* Intro */
        .intro {
          position: fixed;
          inset: 0;
          background: #0a0a14;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          text-align: center;
        }

        .intro-icons {
          display: flex;
          gap: 2rem;
        }

        .intro-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s infinite;
        }

        .intro-circle i {
          font-size: 2.5rem;
          color: #111;
        }

        .intro-text {
          margin-top: 3rem;
        }

        .intro-text h1 {
          font-size: 4rem;
          background: linear-gradient(to right, #3b82f6, #ef4444, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .intro-text p {
          margin-top: 1rem;
          font-size: 1.5rem;
          color: #ccc;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        /* Content */
        .content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        .banner {
          background: #1a1a2e;
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          margin-bottom: 3rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }

        .banner h2 {
          font-size: 2rem;
          background: linear-gradient(to right, #ec4899, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .banner h2 i {
          margin-right: .5rem;
          color: #ddd;
        }

        .banner p {
          margin-top: 1rem;
          color: #aaa;
          font-size: 1.2rem;
        }

        .title {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 2.5rem;
        }

        /* Cards */
        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2.5rem;
        }

        .card {
          background: #0d0d1a;
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 8px 30px rgba(0,0,0,0.6);
          transition: transform 0.3s ease;
          cursor: pointer;
        }

        .card:hover {
          transform: scale(1.05);
        }

        .card-icon {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem auto;
        }

        .card-icon i {
          font-size: 3rem;
        }

        .card h4 {
          font-size: 1.8rem;
          margin: .5rem 0;
        }

        .card p {
          color: #aaa;
          font-size: 1.1rem;
          margin-bottom: 1.2rem;
        }

        .colors {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .color {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }

        .color.border {
          border: 2px solid #fff;
          background: transparent;
        }
        
        /* Formulário */
        .enrollment-form {
          max-width: 800px;
          margin: 2rem auto;
          background: #0d0d1a;
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.6);
        }

        .form-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #333;
            padding-bottom: 1.5rem;
            margin-bottom: 2rem;
        }

        .form-header .header-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .form-header .header-info i {
            font-size: 2.5rem;
        }

        .form-header .header-info h2 {
            font-size: 2rem;
            margin: 0;
        }
        
        .form-header .team-info {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.2rem;
            color: #ccc;
        }

        .form-header .team-info i {
            font-size: 1.5rem;
        }
        
        .form-row {
            display: flex;
            flex-wrap: wrap;
            gap: 2rem;
            margin-bottom: 1.5rem;
        }

        .form-row.three-cols {
          gap: 1rem;
        }
        
        .form-group {
            flex: 1;
            min-width: 200px;
            display: flex;
            flex-direction: column;
        }

        .form-group.full-width {
            flex: 1 1 100%;
        }
        
        .form-group label {
            margin-bottom: 0.5rem;
            font-size: 1rem;
            color: #ccc;
        }
        
        .form-group input, .form-group select {
            background: #1a1a2e;
            border: 1px solid #333;
            border-radius: 10px;
            padding: 0.75rem;
            color: #fff;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }

        .form-group input:focus, .form-group select:focus {
            outline: none;
            border-color: #ef4444;
        }

        .form-group select {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3e%3cpolyline points="6 9 12 15 18 9"%3e%3c/polyline%3e%3c/svg%3e');
            background-repeat: no-repeat;
            background-position: right 1rem center;
            background-size: 1.2em;
        }
        
        .form-actions {
            display: flex;
            justify-content: flex-start;
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .form-actions button {
            padding: 0.75rem 2rem;
            border-radius: 10px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .back-button {
            background: #2a2a3e;
            color: #fff;
            border: none;
        }
        
        .back-button:hover {
            background: #3a3a5e;
        }
        
        .submit-button {
            background: linear-gradient(to right, #ef4444, #8b5cf6);
            color: #fff;
            border: none;
        }
        
        .submit-button:hover {
            opacity: 0.9;
        }
      `}</style>
    </div>
  );
}

export default Home;
