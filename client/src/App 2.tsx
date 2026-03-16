import { useState, useEffect } from "react";
import { login, register, logout, getMe, getAddresses, addAddress } from "./api";
import type { User, Address } from "./types";
import MapView from "./MapView";
import "./App.css";

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [view, setView] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Formulaire ajout d'adresse favorite
  const [searchWord, setSearchWord] = useState("");
  const [addrName, setAddrName] = useState("");
  const [addrDesc, setAddrDesc] = useState("");
  const [addAddrError, setAddAddrError] = useState("");
  const [addingAddr, setAddingAddr] = useState(false);

  const loadUser = async () => {
    const me = await getMe();
    setUser(me);
    if (me) {
      const addrs = await getAddresses();
      setAddresses(addrs);
    } else {
      setAddresses([]);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (view === "register") {
        await register(email, password);
        setError("");
        setView("login");
        setPassword("");
      } else {
        await login(email, password);
        await loadUser();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setAddresses([]);
    setEmail("");
    setPassword("");
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddAddrError("");
    setAddingAddr(true);
    try {
      await addAddress(searchWord.trim(), addrName.trim(), addrDesc.trim() || undefined);
      setSearchWord("");
      setAddrName("");
      setAddrDesc("");
      const addrs = await getAddresses();
      setAddresses(addrs);
    } catch (err) {
      setAddAddrError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setAddingAddr(false);
    }
  };

  if (user) {
    return (
      <div className="app logged-in">
        <header className="dashboard-header">
          <div className="card profile-card">
            <h1>Mon compte</h1>
            <dl className="user-info">
              <dt>Email</dt>
              <dd>{user.email}</dd>
              <dt>Inscrit le</dt>
              <dd>{formatDate(user.createdAt)}</dd>
            </dl>
            <button type="button" onClick={handleLogout} className="btn btn-outline">
              Se déconnecter
            </button>
          </div>
          <div className="card add-address-card">
            <h2>Ajouter un lieu favori</h2>
            <form onSubmit={handleAddAddress}>
              <label>
                Rechercher un lieu (adresse ou ville)
                <input
                  type="text"
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                  placeholder="ex: Paris, Tour Eiffel..."
                  required
                />
              </label>
              <label>
                Nom du lieu
                <input
                  type="text"
                  value={addrName}
                  onChange={(e) => setAddrName(e.target.value)}
                  placeholder="ex: Chez moi"
                  required
                />
              </label>
              <label>
                Description (optionnel)
                <input
                  type="text"
                  value={addrDesc}
                  onChange={(e) => setAddrDesc(e.target.value)}
                  placeholder="ex: Appartement"
                />
              </label>
              {addAddrError && <p className="error">{addAddrError}</p>}
              <button type="submit" disabled={addingAddr} className="btn">
                {addingAddr ? "Ajout..." : "Ajouter à mes favoris"}
              </button>
            </form>
          </div>
        </header>
        <div className="map-section">
          <MapView addresses={addresses} />
        </div>
        <div className="card addresses-card">
          <h2>Mes adresses favorites ({addresses.length})</h2>
          {addresses.length === 0 ? (
            <p className="no-addresses">Aucune adresse. Recherche un lieu ci-dessus pour l’ajouter.</p>
          ) : (
            <ul className="address-list">
              {addresses.map((addr) => (
                <li key={addr.id}>
                  <strong>{addr.name}</strong>
                  {addr.description && <span className="addr-desc"> — {addr.description}</span>}
                  <span className="addr-coords"> ({addr.lat.toFixed(4)}, {addr.lng.toFixed(4)})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="card">
        <h1>{view === "login" ? "Connexion" : "Inscription"}</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label>
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={view === "login" ? "current-password" : "new-password"}
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading} className="btn">
            {loading ? "..." : view === "login" ? "Se connecter" : "S'inscrire"}
          </button>
        </form>
        <button
          type="button"
          className="link"
          onClick={() => {
            setView(view === "login" ? "register" : "login");
            setError("");
          }}
        >
          {view === "login" ? "Créer un compte" : "Déjà un compte ? Se connecter"}
        </button>
      </div>
    </div>
  );
}
