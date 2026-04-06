import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './App.css';

// --- Expanded Real Madrid Squad 24/25 ---
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

// --- Feature 1: Community News / Articles ---
const CommunityNews = () => {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({ title: '', author: '', content: '' });

  // Fetch articles from Supabase when the page loads
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false }); // Newest first
    
    if (error) console.error("Error fetching articles:", error);
    else setArticles(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.author || !newArticle.content) return alert("Please fill all fields!");

    const { error } = await supabase
      .from('articles')
      .insert([newArticle]);

    if (error) {
      alert("Error posting article.");
      console.error(error);
    } else {
      setNewArticle({ title: '', author: '', content: '' }); // Clear form
      fetchArticles(); // Refresh feed
    }
  };

  return (
    <div className="page news-page">
      <h2>Community News 📰</h2>
      <p>Read the latest updates or write your own article for the fans!</p>

      {/* Form to write a new article */}
      <form className="news-form" onSubmit={handleSubmit}>
        <input 
          type="text" placeholder="Article Title" value={newArticle.title}
          onChange={(e) => setNewArticle({...newArticle, title: e.target.value})} 
        />
        <input 
          type="text" placeholder="Your Name" value={newArticle.author}
          onChange={(e) => setNewArticle({...newArticle, author: e.target.value})} 
        />
        <textarea 
          placeholder="Write your article here..." rows="4" value={newArticle.content}
          onChange={(e) => setNewArticle({...newArticle, content: e.target.value})} 
        ></textarea>
        <button type="submit" className="action-btn">Post Article</button>
      </form>

      {/* Feed of articles */}
      <div className="articles-feed">
        {articles.length === 0 ? <p className="no-articles">No articles yet. Be the first to write one!</p> : null}
        
        {articles.map((article) => (
          <div key={article.id} className="article-card">
            <h3>{article.title}</h3>
            <small>By {article.author} • {new Date(article.created_at).toLocaleDateString()}</small>
            <p>{article.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Feature 2: Squad Builder ---
const SquadBuilder = () => {
  const [lineup, setLineup] = useState({
    GK: null, DF1: null, DF2: null, DF3: null, DF4: null,
    MF1: null, MF2: null, MF3: null, FW1: null, FW2: null, FW3: null
  });

  const addToLineup = (player) => {
    const isAlreadyInLineup = Object.values(lineup).some(p => p && p.id === player.id);
    if (isAlreadyInLineup) return;

    if (player.pos === "GK") setLineup(prev => ({ ...prev, GK: player }));
    else if (player.pos === "DF") {
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

  const removeFromLineup = (slot) => setLineup(prev => ({ ...prev, [slot]: null }));

  const saveLineup = async () => {
    const isLineupEmpty = Object.values(lineup).every(player => player === null);
    if (isLineupEmpty) return alert("Please select at least one player before saving!");

    try {
      const { error } = await supabase.from('lineups').insert([{ formation_data: lineup }]);
      if (error) throw error;
      alert("Lineup saved successfully to the database! 🎉");
    } catch (error) {
      console.error("Error saving lineup:", error.message);
      alert("There was an error saving your lineup. Check the console.");
    }
  };

  return (
    <div className="page squad-page">
      <h2>My Starting XI ⚽️</h2>
      <p>Select your 11 players for the next match. Click a player on the pitch to remove them.</p>
      
      <div className="builder-container">
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

        <div className="player-list extended-list">
          <h3>Squad Roster</h3>
          <div className="players-grid">
            {playersData.map(player => {
              const isSelected = Object.values(lineup).some(p => p && p.id === player.id);
              return (
                <div key={player.id} className={`player-card ${isSelected ? 'selected' : ''}`} onClick={() => addToLineup(player)}>
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
      <button className="action-btn" onClick={saveLineup}>Save Lineup to Database</button>
    </div>
  );
};

// --- Home Page ---
const Home = () => (
  <div className="page">
    <h2>Welcome to MadridFans 👑</h2>
    <p>The ultimate community hub for Real Madrid fans.</p>
  </div>
);

// --- Main App Router ---
function App() {
  return (
    <Router>
      <div className="app-container" dir="rtl">
        <nav className="navbar">
          <h1 className="logo">MadridFans</h1>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/news">News</Link>  {/* NEW LINK */}
            <Link to="/squad">Squad</Link>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<CommunityNews />} /> {/* NEW ROUTE */}
            <Route path="/squad" element={<SquadBuilder />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
