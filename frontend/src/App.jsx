import React from "react";
import { useEffect, useState } from "react";

const API = "https://x-monitor-zha3.onrender.com";

function formatDate(value) {
  return new Date(value).toLocaleString("pt-BR");
}

function browserName(userAgent = "") {
  if (userAgent.includes("Edg/")) return "Microsoft Edge";
  if (userAgent.includes("Chrome/")) return "Google Chrome";
  if (userAgent.includes("Firefox/")) return "Firefox";
  if (userAgent.includes("Safari/") && !userAgent.includes("Chrome/")) return "Safari";
  return "Outro";
}

export default function App() {
  const [stats, setStats] = useState({ total: 0, today: 0 });
  const [visits, setVisits] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      const [statsRes, visitsRes] = await Promise.all([
        fetch(`${API}/api/stats`),
        fetch(`${API}/api/visits`)
      ]);

      if (!statsRes.ok || !visitsRes.ok) throw new Error("API offline");

      setStats(await statsRes.json());
      setVisits(await visitsRes.json());
      setError("");
    } catch {
      setError("Não consegui conectar ao servidor. Abra o backend primeiro.");
    }
  }

  useEffect(() => {
    load();
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">X MONITOR</p>
          <h1>Painel de acessos</h1>
          <p className="muted">
            Registre cliques no seu link e acessos ao seu próprio site.
          </p>
        </div>
        <button onClick={load}>Atualizar</button>
      </section>

      {error && <div className="alert">{error}</div>}

      <section className="cards">
        <div className="card">
          <span>Total de acessos</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="card">
          <span>Acessos hoje</span>
          <strong>{stats.today}</strong>
        </div>
        <div className="card">
          <span>Status</span>
          <strong className="online">● Online</strong>
        </div>
      </section>

      <section className="panel">
        <div className="panelHead">
          <div>
            <h2>Últimos acessos</h2>
            <p className="muted">Atualiza automaticamente a cada 5 segundos.</p>
          </div>
        </div>

        <div className="table">
          <div className="row header">
            <span>Data</span>
            <span>Origem</span>
            <span>Navegador</span>
            <span>Página</span>
          </div>

          {visits.length === 0 ? (
            <div className="empty">Nenhum acesso registrado ainda.</div>
          ) : (
            visits.map((visit) => (
              <div className="row" key={visit.id}>
                <span>{formatDate(visit.createdAt)}</span>
                <span>{visit.source || "site"}</span>
                <span>{browserName(visit.userAgent)}</span>
                <span>{visit.path}</span>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="info">
        <h3>Importante sobre o X</h3>
        <p>
          Se alguém apenas abrir seu perfil no X e não clicar no seu link,
          este painel não recebe essa informação. O X não entrega uma lista
          de visitantes do perfil para este tipo de aplicação.
        </p>
      </section>
    </main>
  );
}