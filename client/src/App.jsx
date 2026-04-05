import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// --- App.jsx (Replace playersData and SquadBuilder) ---

// Expanded Real Madrid Squad 24/25 with basic details
const playersData = [
  { id: 1, name: "Courtois", pos: "GK", number: 1, img: "https://ui-avatars.com/api/?name=Thibaut+Courtois&background=f8fafc&color=0f172a&bold=true" },
  { id: 13, name: "Lunin", pos: "GK", number: 13, img: "https://ui-avatars.com/api/?name=Andriy+Lunin&background=f8fafc&color=0f172a&bold=true" },
  { id: 2, name: "Carvajal", pos: "DF", number: 2, img: "https://ui-avatars.com/api/?name=Dani+Carvajal&background=f8fafc&color=0f172a&bold=true" },
  { id: 3, name: "Militao", pos: "DF", number: 3, img: "https://ui-avatars.com/api/?name=Eder+Militao&background=f8fafc&color=0f172a&bold=true" },
  { id: 4, name: "Alaba", pos: "DF", number: 4, img: "https://ui-avatars.com/api/?name=David+Alaba&background=f8fafc&color=0f172a&bold=true" },
  { id: 22, name: "Rudiger", pos: "DF", number: 22, img: "https://ui-avatars.com/api/?name=Antonio+Rudiger&background=f8fafc&color=0f172a&bold=true" },
  { id: 23, name: "Mendy", pos: "DF", number: 23, img: "https://ui-avatars.com/api/?name=Ferland+Mendy&background=f8fafc&color=0f172a&bold=true" },
  { id: 8, name: "Valverde", pos: "MF", number: 8, img: "https://ui-avatars.com/api/?name=Fede+Valverde&background=f8fafc&color=0f172a&bold=true" },
  { id: 14, name: "Tchouameni", pos: "MF", number: 14, img: "https://ui-avatars.com/api/?name=A+Tchouameni&background=f8fafc&color=0f172a&bold=true" },
  { id: 12, name: "Camavinga", pos: "MF", number: 12, img: "https://ui-avatars.com/api/?name=E+Camavinga&background=f8fafc&color=0f172a&bold=true" },
  { id: 5, name: "Bellingham", pos: "MF", number: 5, img: "https://ui-avatars.com/api/?name=Jude+Bellingham&background=f8fafc&color=0f172a&bold=true" },
  { id: 10, name: "Modric", pos: "MF", number: 10, img: "https://ui-avatars.com/api/?name=Luka+Modric&background=f8fafc&color=0f172a&bold=true" },
  { id: 7, name: "Vinicius", pos: "FW", number: 7, img: "https://ui-avatars.com/api/?name=Vinicius+Jr&background=f8fafc&color=0f172a&bold=true" },
  { id: 9, name: "Mbappe", pos: "FW", number: 9, img: "https://ui-avatars.com/api/?name=Kylian+Mbappe&background=f8fafc&color=0f172a&bold=true" },
  { id: 11, name: "Rodrygo", pos: "FW", number: 11, img: "https://ui-avatars.com/api/?name=Rodrygo+Goes&background=f8fafc&color=0f172a&bold=true" },
  { id: 21, name: "Brahim", pos: "FW", number: 21, img: "https://ui-avatars.com/api/?name=Brahim+Diaz&background=f8fafc&color=0f172a&bold=true" },
  { id: 16, name: "Endrick", pos: "FW", number: 16, img: "https://ui-avatars.com/api/?name=Endrick&background=f8fafc&color=0f172a&bold=true" }
];

const SquadBuilder = () => {
  // State for a full 11-man lineup (4-3-3 formation)
  const [lineup, setLineup] = useState({
    GK: null,
    DF1: null, DF2: null, DF3: null, DF4: null,
    MF1: null, MF2: null, MF3: null,
    FW1: null, FW2: null, FW3: null
  });

  // Smart function to find the first empty slot for the player's position
  const addToLineup = (player) => {
    // Prevent duplicates
    const isAlreadyInLineup = Object.values(lineup).some(p => p && p.id === player.id);
    if (isAlreadyInLineup) return;

    if (player.pos === "GK") {
      setLineup(prev => ({ ...prev, GK: player }));
    } else if (player.pos === "DF") {
      if (!lineup.DF1) setLineup(prev => ({ ...prev, DF1: player }));
      else if (!lineup.DF2) setLineup(prev => ({ ...prev, DF2: player }));
      else if (!lineup.DF3) setLineup(prev => ({ ...prev, DF3: player }));
      else if (!lineup.DF4) setLineup(prev => ({ ...prev, DF4: player }));
    } else if (player.pos === "MF") {
      if (!lineup.MF1) setLineup(prev => ({ ...prev, MF1: player }));
      else if (!lineup.MF2) setLineup(prev => ({ ...prev, MF2: player }));
      else if (!lineup.MF3) setLineup(prev => ({ ...prev, MF3: player }));
    } else if (player.pos === "FW") {
      if (!lineup.FW1) setLineup(prev => ({ ...prev, FW1: player }));
      else if (!lineup.FW2) setLineup(prev => ({ ...prev, FW2: player }));
      else if (!lineup.FW3) setLineup(prev => ({ ...prev, FW3: player }));
    }
  };

  // Remove player from pitch on click
  const removeFromLineup = (slot) => {
    setLineup(prev => ({ ...prev, [slot]: null }));
  };

  return (
    <div className="page squad-page">
      <h2>My Starting XI ⚽️</h2>
      <p>Select your 11 players for the next match. Click a player on the pitch to remove them.</p>
      
      <div className="builder-container">
        {/* Full 11-man Pitch */}
        <div className="pitch full-pitch">
          
          <div className="attack-row">
            <div className="position fw" onClick={() => removeFromLineup('FW1')}>{lineup.FW1 ? <img src={lineup.FW1.img} /> : "LW"}</div>
            <div className="position fw" onClick={() => removeFromLineup('FW2')}>{lineup.FW2 ? <img src={lineup.FW2.img} /> : "ST"}</div>
            <div className="position fw" onClick={() => removeFromLineup('FW3')}>{lineup.FW3 ? <img src={lineup.FW3.img} /> : "RW"}</div>
          </div>
          
          <div className="midfield-row">
            <div className="position mf" onClick={() => removeFromLineup('MF1')}>{lineup.MF1 ? <img src={lineup.MF1.img} /> : "CM"}</div>
            <div className="position mf" onClick={() => removeFromLineup('MF2')}>{lineup.MF2 ? <img src={lineup.MF2.img} /> : "CDM"}</div>
            <div className="position mf" onClick={() => removeFromLineup('MF3')}>{lineup.MF3 ? <img src={lineup.MF3.img} /> : "CM"}</div>
          </div>
          
          <div className="defense-row">
            <div className="position df" onClick={() => removeFromLineup('DF1')}>{lineup.DF1 ? <img src={lineup.DF1.img} /> : "LB"}</div>
            <div className="position df" onClick={() => removeFromLineup('DF2')}>{lineup.DF2 ? <img src={lineup.DF2.img} /> : "CB"}</div>
            <div className="position df" onClick={() => removeFromLineup('DF3')}>{lineup.DF3 ? <img src={lineup.DF3.img} /> : "CB"}</div>
            <div className="position df" onClick={() => removeFromLineup('DF4')}>{lineup.DF4 ? <img src={lineup.DF4.img} /> : "RB"}</div>
          </div>
          
          <div className="goalie-row">
             <div className="position gk" onClick={() => removeFromLineup('GK')}>{lineup.GK ? <img src={lineup.GK.img} /> : "GK"}</div>
          </div>

        </div>

        {/* Expanded Player Roster */}
        <div className="player-list extended-list">
          <h3>Squad Roster</h3>
          <div className="players-grid">
            {playersData.map(player => {
              const isSelected = Object.values(lineup).some(p => p && p.id === player.id);
              return (
                <div 
                  key={player.id} 
                  className={`player-card ${isSelected ? 'selected' : ''}`} 
                  onClick={() => addToLineup(player)}
                >
                  <span className="player-number">{player.number}</span>
                  <img src={player.img} alt={player.name} />
                  <p>{player.name}</p>
                  <small>{player.pos}</small>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <button className="action-btn">Save Lineup to Database</button>
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
