import React, { useState, useEffect, useCallback } from "react";
import { db, auth } from "../firebase.js";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

// Dados fictícios para simular as equipes
const teams = [
  {
    name: "Matira",
    sport: "Vôlei",
    icon: "fas fa-volleyball-ball",
    color: "#3b82f6",
    hoverColor: "#1e40af", // Azul escuro para hover
  },
  {
    name: "Nexon",
    sport: "Basquete",
    icon: "fas fa-basketball-ball",
    color: "#ef4444",
    hoverColor: "#b91c1c", // Vermelho escuro para hover
  },
  {
    name: "Falxtra",
    sport: "Futsal",
    icon: "fas fa-futbol",
    color: "#8b5cf6",
    hoverColor: "#6d28d9", // Roxo escuro para hover
  },
];

const App = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(true);

  // Monitora o estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handler para o login com Firebase Auth
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // O usuário será definido automaticamente pelo onAuthStateChanged
    } catch (error) {
      console.error("Erro no login:", error);
      setLoginError("Credenciais inválidas ou erro de conexão.");
    }
  };

  // Handler para logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

  // Tela de loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a14] p-4 font-sans">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-purple-500 mb-4"></i>
          <p className="text-white">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a14] p-4 font-sans">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <div className="bg-[#1a1a2e] p-8 rounded-2xl shadow-lg w-full max-w-sm">
          <h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
            Login
          </h2>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-400"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-400"
              >
                Senha
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                required
              />
            </div>
            {loginError && (
              <p className="text-red-500 text-sm text-center">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              Entrar
            </button>
          </form>
        </div>
        <script src="https://cdn.tailwindcss.com"></script>
      </div>
    );
  }

  // Se o usuário estiver logado, renderiza o painel de administração
  return <AdminDashboard onLogout={handleLogout} />;
};

const AdminDashboard = ({ onLogout }) => {
  const [selectedTeam, setSelectedTeam] = useState(teams[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar inscrições do Firestore
  const fetchInscriptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const inscricoesRef = collection(db, "inscricoes");
      const querySnapshot = await getDocs(inscricoesRef);

      const inscricoesData = [];
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();

        // Filtra apenas as inscrições do time selecionado
        if (data.time === selectedTeam.name) {
          inscricoesData.push({
            id: docSnapshot.id, // Adiciona o ID do documento
            name: data.nomeCompleto,
            grade: data.anoEscolar + "ª série",
            class: data.sala,
            shift: data.turno,
            phone: data.numeroTelefone,
            email: data.email,
            birthDate: data.dataNascimento,
            healthIssues: data.problemaSaude,
            trainingTime: data.horarioTreino,
            submissionDate:
              data.dataEnvio?.toDate?.() || new Date(data.dataEnvio),
          });
        }
      });

      setInscriptions(inscricoesData);
    } catch (err) {
      console.error("Erro ao buscar inscrições:", err);
      setError("Erro ao carregar as inscrições. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [selectedTeam]);

  // Função para deletar uma inscrição
  const handleDeleteInscription = async (inscriptionId, studentName) => {
    if (
      window.confirm(
        `Tem certeza que deseja deletar a inscrição de ${studentName}?`
      )
    ) {
      try {
        await deleteDoc(doc(db, "inscricoes", inscriptionId));
        // Atualiza a lista após deletar
        fetchInscriptions();
        alert(`Inscrição de ${studentName} deletada com sucesso!`);
      } catch (error) {
        console.error("Erro ao deletar inscrição:", error);
        alert("Erro ao deletar inscrição. Tente novamente.");
      }
    }
  };

  // Buscar inscrições quando o componente monta ou quando o time selecionado muda
  useEffect(() => {
    fetchInscriptions();
  }, [selectedTeam, fetchInscriptions]);

  return (
    <div className="admin-dashboard">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
      />

      <div className="flex-1 flex flex-col md:flex-row min-h-screen">
        {isSidebarOpen && (
          <div
            className="overlay md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <aside
          className={`sidebar ${
            isSidebarOpen ? "sidebar-open" : ""
          } md:translate-x-0`}
        >
          <div className="sidebar-header">
            <h1>Solarys Admin</h1>
            <button
              className="close-sidebar-btn md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <nav className="sidebar-nav">
            {teams.map((team) => (
              <button
                key={team.name}
                onClick={() => {
                  setSelectedTeam(team);
                  setIsSidebarOpen(false);
                }}
                className={`nav-item ${
                  selectedTeam.name === team.name ? "active" : ""
                }`}
                style={{ "--hover-color": team.hoverColor }}
              >
                <i className={team.icon}></i>
                <span>{team.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="main-content">
          <header className="main-header">
            <button
              className="menu-btn md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <i className="fas fa-bars"></i>
            </button>
            <div className="welcome-section">
              <h1 className="welcome-title">Bem-vindo ADMIN SOLARYS</h1>
              <div className="header-info">
                <i
                  className={selectedTeam.icon}
                  style={{ color: selectedTeam.color }}
                ></i>
                <h2>Inscrições - {selectedTeam.name}</h2>
              </div>
            </div>
            <div className="header-actions">
              <div className="stats hidden md:flex">
                <span>Total de Inscritos: </span>
                <span className="stat-value">{inscriptions.length}</span>
              </div>
              <button onClick={onLogout} className="logout-btn">
                <i className="fas fa-sign-out-alt"></i>
                Sair
              </button>
            </div>
          </header>

          <div className="inscriptions-table-container">
            {loading ? (
              <div className="loading">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Carregando inscrições...</p>
              </div>
            ) : error ? (
              <div className="error">
                <i className="fas fa-exclamation-triangle"></i>
                <p>{error}</p>
                <button
                  onClick={() => fetchInscriptions()}
                  className="retry-button"
                >
                  Tentar Novamente
                </button>
              </div>
            ) : inscriptions.length > 0 ? (
              <table className="inscriptions-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Série</th>
                    <th>Turma</th>
                    <th>Turno</th>
                    <th>Telefone</th>
                    <th>Email</th>
                    <th>Problema de Saúde</th>
                    <th>Data de Inscrição</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {inscriptions.map((insc) => (
                    <tr key={insc.id}>
                      <td>{insc.name}</td>
                      <td>{insc.grade}</td>
                      <td>{insc.class}</td>
                      <td>{insc.shift}</td>
                      <td>{insc.phone}</td>
                      <td>{insc.email || "Não informado"}</td>
                      <td>{insc.healthIssues || "Nenhum problema relatado"}</td>
                      <td>
                        {insc.submissionDate?.toLocaleDateString("pt-BR") ||
                          "Não disponível"}
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            handleDeleteInscription(insc.id, insc.name)
                          }
                          className="delete-btn"
                          title="Deletar inscrição"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-inscriptions">
                <i className="fas fa-exclamation-circle"></i>
                <p>Não há inscrições para esta modalidade ainda.</p>
              </div>
            )}
          </div>
        </main>
      </div>
      <style>{`
        .admin-dashboard {
          display: flex;
          min-height: 100vh;
          font-family: 'Poppins', sans-serif;
          background: #0a0a14;
          color: #fff;
          position: relative;
        }
        
        /* Overlay para mobile */
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 900;
        }
        
        /* Sidebar */
        .sidebar {
          width: 250px;
          background: #1a1a2e;
          padding: 2rem 1.5rem;
          border-right: 1px solid #333;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.3s ease-in-out;
          flex-shrink: 0;
        }

        .sidebar-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-header h1 {
          font-size: 1.5rem;
          background: linear-gradient(to right, #ec4899, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sidebar-nav {
          width: 100%;
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #2a2a3e;
          border: none;
          color: #fff;
          font-size: 1rem;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.3s, transform 0.2s;
        }

        /* Hover com a cor da equipe */
        .nav-item:hover {
          background: var(--hover-color);
          transform: translateY(-2px);
        }

        .nav-item i {
          font-size: 1.2rem;
          color: #ddd;
        }

        .nav-item.active {
          background: var(--hover-color);
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
        }

        .nav-item.active {
          background: var(--hover-color);
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
        }

        /* Main Content */
        .main-content {
          flex: 1;
          padding: 2rem;
        }

        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #1a1a2e;
          padding: 1.5rem 2rem;
          border-radius: 15px;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }
        
        .header-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-info i {
          font-size: 2.5rem;
        }

        .header-info h2 {
          font-size: 1.8rem;
          margin: 0;
        }

        .stats {
          font-size: 1.2rem;
          color: #ccc;
        }

        .stat-value {
          font-weight: 700;
          color: #fff;
          font-size: 1.5rem;
        }

        .menu-btn, .close-sidebar-btn {
          background: none;
          border: none;
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
        }

        /* Table */
        .inscriptions-table-container {
          background: #1a1a2e;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
          overflow-x: auto; /* Adiciona scroll horizontal em telas pequenas */
        }

        .inscriptions-table {
          width: 100%;
          min-width: 600px; /* Garante que a tabela não fique espremida */
          border-collapse: collapse;
        }

        .inscriptions-table th,
        .inscriptions-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #333;
        }

        .inscriptions-table th {
          background: #2a2a3e;
          color: #ddd;
          font-weight: 600;
          text-transform: uppercase;
        }

        .inscriptions-table tr:hover {
          background: #2a2a3e;
        }

        .inscriptions-table tr:last-child td {
          border-bottom: none;
        }

        .no-inscriptions {
          text-align: center;
          padding: 2rem;
          color: #aaa;
        }

        .no-inscriptions i {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        /* Loading e Error States */
        .loading, .error {
          text-align: center;
          padding: 3rem 2rem;
          color: #aaa;
        }

        .loading i, .error i {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .loading i {
          color: #8b5cf6;
        }

        .error i {
          color: #ef4444;
        }

        .error p {
          margin-bottom: 1.5rem;
        }

        .retry-button {
          background: linear-gradient(to right, #ef4444, #8b5cf6);
          color: #fff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-size: 1rem;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }

        .retry-button:hover {
          opacity: 0.9;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .admin-dashboard {
            flex-direction: column;
          }
          
          .overlay {
            display: block; /* Mostra o overlay quando a sidebar estiver aberta */
          }

          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            padding-top: 5rem;
            z-index: 1000;
            transform: translateX(-100%); /* Escondido por padrão */
            transition: transform 0.3s ease-in-out;
          }
          
          .sidebar-open {
            transform: translateX(0); /* Mostra a sidebar */
          }
        }
      `}</style>
      <script src="https://cdn.tailwindcss.com"></script>
    </div>
  );
};

export default App;
