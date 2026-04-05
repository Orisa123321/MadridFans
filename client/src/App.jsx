import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Mock database for players (Using stable ESPN images)
const playersData = [
  { id: 1, name: "Courtois", pos: "GK", img: "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/153169.png" },
  { id: 2, name: "Militao", pos: "DF", img: "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/255863.png" },
  { id: 3, name: "Rudiger", pos: "DF", img: "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/159041.png" },
  { id: 4, name: "Bellingham", pos: "MF", img: "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/288096.png" },
  { id: 5, name: "Valverde", pos: "MF", img: "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/253969.png" },
  { id: 6, name: "Vinicius", pos: "FW", img: "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/258526.png" },
  { id: 7, name: "Mbappe", pos: "FW", img: "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/229014.png" },
  { id: 8, name: "Rodrygo", pos: "FW", img: "https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/268421.png" },
];

// Feature 1: Squad Builder (Existing)
const SquadBuilder = () => {
  const [lineup, setLineup] = useState({ GK: null, DF1: null, DF2: null, MF1: null, MF2: null, FW1: null });

  const addToLineup = (player, position) => {
    setLineup(prev => ({ ...prev, [position]: player }));
  };

  return (
    <div className="page squad-page">
      <h2>My Squad ⚽️</h2>
      <div className="builder-container">
        <div className="pitch">
          <div className="position gk">{lineup.GK ? <img src={lineup.GK.img} /> : "GK"}</div>
          <div className="midfield-row">
            <div className="position mf">{lineup.MF1 ? <img src={lineup.MF1.img} /> : "MF"}</div>
            <div className="position mf">{lineup.MF2 ? <img src={lineup.MF2.img} /> : "MF"}</div>
          </div>
          <div className="attack-row">
            <div className="position fw">{lineup.FW1 ? <img src={lineup.FW1.img} /> : "FW"}</div>
          </div>
        </div>
        <div className="player-list">
          <h3>Select Players</h3>
          <div className="players-grid">
            {playersData.map(player => (
              <div key={player.id} className="player-card" onClick={() => {
                if (player.pos === "GK") addToLineup(player, "GK");
                else if (player.pos === "MF") addToLineup(player, "MF1");
                else if (player.pos === "FW") addToLineup(player, "FW1");
              }}>
                <img src={player.img} alt={player.name} />
                <p>{player.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button className="action-btn">Share to Telegram</button>
    </div>
  );
};

// Feature 2: Player Ratings
const PlayerRatings = () => {
  const [ratings, setRatings] = useState({});

  const handleRate = (id, value) => {
    setRatings(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="page">
      <h2>Match Ratings ⭐️</h2>
      <p>Rate the players' performance from 1 to 10</p>
      <div className="ratings-container">
        {playersData.map(player => (
          <div key={player.id} className="rating-row">
            <img src={player.img} alt={player.name} className="rating-img" />
            <span className="rating-name">{player.name}</span>
            <input 
              type="range" min="1" max="10" 
              value={ratings[player.id] || 5} 
              onChange={(e) => handleRate(player.id, e.target.value)} 
              className="rating-slider"
            />
            <span className="rating-score">{ratings[player.id] || 5}</span>
          </div>
        ))}
      </div>
      <button className="action-btn" onClick={() => alert("Ratings submitted!")}>Submit Ratings</button>
    </div>
  );
};

// Feature 3: Predictions League
const Predictions = () => {
  const [prediction, setPrediction] = useState({ home: '', away: '', scorer: '' });

  return (
    <div className="page">
      <h2>Prediction League 🔮</h2>
      <p>Predict the exact score of the upcoming El Clásico!</p>
      
      <div className="prediction-board">
        <div className="team-pred">
          <h3>Real Madrid</h3>
          <input type="number" min="0" placeholder="0" 
                 onChange={(e) => setPrediction({...prediction, home: e.target.value})} />
        </div>
        <div className="vs-text">VS</div>
        <div className="team-pred">
          <h3>Barcelona</h3>
          <input type="number" min="0" placeholder="0" 
                 onChange={(e) => setPrediction({...prediction, away: e.target.value})} />
        </div>
      </div>

      <div className="scorer-select">
        <h3>First Goalscorer?</h3>
        <select onChange={(e) => setPrediction({...prediction, scorer: e.target.value})}>
          <option value="">Select a player...</option>
          {playersData.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
        </select>
      </div>

      <button className="action-btn" onClick={() => alert("Prediction saved!")}>Submit Prediction</button>
    </div>
  );
};

// Feature 4: Head to Head Debate
const HeadToHead = () => {
  // State to track if the user has voted to reveal results
  const [voted, setVoted] = useState(false);

  return (
    <div className="page">
      <h2>Head to Head ⚔️</h2>
      <h3>Who is the better midfielder this season?</h3>
      
      <div className="h2h-container">
        <div className="h2h-card" onClick={() => setVoted(true)}>
          <img src={playersData[3].img} alt="Bellingham" />
          <h4>Bellingham</h4>
          {voted && <div className="result-bar winner">68%</div>}
        </div>
        
        <div className="vs-badge">VS</div>
        
        <div className="h2h-card" onClick={() => setVoted(true)}>
          <img src={playersData[4].img} alt="Valverde" />
          <h4>Valverde</h4>
          {voted && <div className="result-bar loser">32%</div>}
        </div>
      </div>
    </div>
  );
};

// Home Page
const Home = () => (
  <div className="page">
    <h2>Welcome to MadridFans 👑</h2>
    <p>The ultimate community hub for Real Madrid fans.</p>
  </div>
);

// Main App Router
function App() {
  return (
    <Router>
      <div className="app-container" dir="rtl">
        <nav className="navbar">
          <h1 className="logo">MadridFans</h1>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/squad">Squad</Link>
            <Link to="/ratings">Ratings</Link>
            <Link to="/predictions">Predictions</Link>
            <Link to="/h2h">Head 2 Head</Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/squad" element={<SquadBuilder />} />
            <Route path="/ratings" element={<PlayerRatings />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/h2h" element={<HeadToHead />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
