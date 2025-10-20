import React, { useState, useEffect } from "react";
import { db } from "../firebase.js"; // pega seu arquivo firebase.js
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

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
const EnrollmentForm = ({ team, onGoBack, onSubscriptionSuccess }) => {
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

    // Check for existing subscription with same phone number and team
    const q = query(
      collection(db, "inscricoes"),
      where("numeroTelefone", "==", formData.numeroTelefone),
      where("time", "==", formData.time)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      alert("Você já está inscrito nesta modalidade!");
      return;
    }

    try {
      await addDoc(collection(db, "inscricoes"), {
        ...formData,
        dataEnvio: new Date(),
      });

      // Call parent component's success handler with subscription data
      onSubscriptionSuccess({
        time: formData.time,
        sport: team.sport,
        icon: team.icon,
        color: team.color,
      });
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
          <p className="opacity-75">{team.sport}</p>
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
            <label htmlFor="turno">Turno que estuda</label>
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

        <div className="form-disclaimer">
          <div className="disclaimer-icon">
            <i className="fas fa-info-circle"></i>
          </div>
          <div className="disclaimer-content">
            <p>
              <strong>Aviso Importante</strong>
            </p>
            <ul>
              <li>
                Podemos entrar em contato para confirmar ou esclarecer
                informações do seu cadastro.
              </li>
              <li>
                Certifique-se de que todos os dados fornecidos estão corretos.
              </li>
            </ul>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onGoBack} className="back-button">
            Voltar
          </button>
          <button type="submit" className="submit-button">
            Confirmar Inscrição
          </button>
        </div>
      </form>
    </div>
  );
};

// Componente Principal
function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [lastSubscriptionTime, setLastSubscriptionTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Initialize the end time in localStorage if it doesn't exist
  useEffect(() => {
    if (!localStorage.getItem("registrationEndTime")) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 5);
      localStorage.setItem("registrationEndTime", endDate.getTime().toString());
    }
  }, []);

  useEffect(() => {
    // Check if all assets are loaded
    const handleLoad = () => {
      setIsLoading(false);
    };

    // Check if page is already loaded
    if (document.readyState === "complete") {
      setIsLoading(false);
    } else {
      window.addEventListener("load", handleLoad);
    }

    const introTimeout = setTimeout(() => {
      setShowIntro(false);
    }, 4000);

    return () => {
      window.removeEventListener("load", handleLoad);
      clearTimeout(introTimeout);
    };
  }, []);

  const handleCardClick = (team) => {
    // Check if user has a recent subscription (within 2 hours)
    if (lastSubscriptionTime) {
      const twoHoursInMs = 2 * 60 * 60 * 1000;
      const timeSinceLastSubscription =
        new Date() - new Date(lastSubscriptionTime);

      if (timeSinceLastSubscription < twoHoursInMs) {
        const timeLeftMs = twoHoursInMs - timeSinceLastSubscription;
        const hoursLeft = Math.floor(timeLeftMs / (1000 * 60 * 60));
        const minutesLeft = Math.ceil(
          (timeLeftMs % (1000 * 60 * 60)) / (1000 * 60)
        );

        alert(
          `Aguarde ${hoursLeft}h ${minutesLeft}m antes de fazer uma nova inscrição.`
        );
        return;
      }
    }

    setSelectedTeam(team);
  };

  const handleGoBack = () => {
    setSelectedTeam(null);
  };

  // Countdown Timer component
  useEffect(() => {
    // Check if we have a stored end time, if not, set one
    if (!localStorage.getItem("registrationEndTime")) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 5);
      localStorage.setItem("registrationEndTime", endDate.getTime().toString());
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const storedEndTime = parseInt(
        localStorage.getItem("registrationEndTime")
      );
      const difference = storedEndTime - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        // Registration period has ended
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, []); // Removed registrationEndTime from dependencies

  // Registration Countdown component
  const RegistrationCountdown = () => (
    <div className="registration-countdown">
      <h3>Tempo até o fim das inscrições iniciais:</h3>
      <div className="countdown-timer">
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.days}</span>
          <span className="countdown-label">dias</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">
          <span className="countdown-value">
            {timeLeft.hours.toString().padStart(2, "0")}
          </span>
          <span className="countdown-label">horas</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">
          <span className="countdown-value">
            {timeLeft.minutes.toString().padStart(2, "0")}
          </span>
          <span className="countdown-label">min</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">
          <span className="countdown-value">
            {timeLeft.seconds.toString().padStart(2, "0")}
          </span>
          <span className="countdown-label">seg</span>
        </div>
      </div>
    </div>
  );

  // Welcome component
  const WelcomeMessage = () => (
    <div className="welcome-message">
      <div className="welcome-content">
        <h2>Bem-vindo ao treinamento Solarys!</h2>
        <p>Sua inscrição foi realizada com sucesso.</p>
        <div className="sport-icons">
          <i
            className={selectedTeam?.icon}
            style={{
              fontSize: "2rem",
              margin: "0 10px",
              color: selectedTeam?.color,
            }}
          ></i>
        </div>
        <button onClick={() => setShowWelcome(false)} className="close-button">
          Fechar
        </button>
      </div>
    </div>
  );

  // Loading screen
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  // Update notification component
  const UpdateNotification = () => {
    const [showNotification, setShowNotification] = useState(() => {
      // Check if user has seen the notification before
      return !localStorage.getItem("hasSeenUpdateNotification");
    });

    const handleClose = () => {
      setShowNotification(false);
      localStorage.setItem("hasSeenUpdateNotification", "true");
    };

    if (!showNotification) return null;

    return (
      <div className="update-notification">
        <div className="update-content">
          <i className="fas fa-info-circle"></i>
          <p>
            <strong>Atualização:</strong> Adaptamos nosso sistema! Se você já
            realizou sua inscrição, não é necessário enviar novamente. Seu
            cadastro já está confirmado.
          </p>
          <button onClick={handleClose} className="close-update-notification">
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="home">
      <UpdateNotification />
      {showWelcome && <WelcomeMessage />}
      <RegistrationCountdown />
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
          <EnrollmentForm
            team={selectedTeam}
            onGoBack={handleGoBack}
            onSubscriptionSuccess={() => {
              setShowWelcome(true);
              setLastSubscriptionTime(new Date());
              setSelectedTeam(null);
            }}
          />
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

        /* Welcome Message */
        .welcome-message {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .welcome-content {
          background: #1a1a2e;
          padding: 2rem;
          border-radius: 10px;
          text-align: center;
          max-width: 90%;
          width: 500px;
        }

        .welcome-content h2 {
          color: #fff;
          margin-bottom: 1rem;
        }

        .sport-icons {
          margin: 1.5rem 0;
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .close-button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.5rem 1.5rem;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          margin-top: 1rem;
          transition: background 0.3s;
        }

        .close-button:hover {
          background: #2563eb;
        }

        /* Registration Countdown */
        .registration-countdown {
          background: #1a1a2e;
          border-radius: 10px;
          padding: 1.5rem;
          margin: 1rem auto;
          max-width: 800px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }

        .registration-countdown h3 {
          margin: 0 0 1rem 0;
          color: #fff;
          font-size: 1.2rem;
        }

        .countdown-timer {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
        }

        .countdown-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 60px;
        }

        .countdown-value {
          font-size: 2rem;
          font-weight: bold;
          color: #8b5cf6;
          line-height: 1;
        }

        .countdown-label {
          font-size: 0.8rem;
          color: #a1a1aa;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .countdown-separator {
          font-size: 2rem;
          font-weight: bold;
          color: #4b5563;
          margin: 0 -0.5rem;
          line-height: 1;
        }

        /* Update Notification */
        .update-notification {
          background: #1a1a2e;
          border-left: 4px solid #8b5cf6;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .update-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #e2e8f0;
        }

        .update-content i {
          color: #8b5cf6;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .update-content p {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .update-content strong {
          color: #fff;
          font-weight: 600;
        }

        .close-update-notification {
          background: none;
          border: none;
          color: #a1a1aa;
          cursor: pointer;
          padding: 0.5rem;
          margin-left: auto;
          font-size: 1.2rem;
          transition: color 0.2s;
        }

        .close-update-notification:hover {
          color: #fff;
        }

        /* Loading Screen */
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #0a0a14;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          border-top-color: #3b82f6;
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 1rem;
        }

        .loading-screen p {
          color: #fff;
          font-size: 1.2rem;
          margin-top: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
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
