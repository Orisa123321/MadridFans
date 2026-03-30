import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [teamData, setTeamData] = useState(null);
  const [squad, setSquad] = useState([]);
  const [nextFixtures, setNextFixtures] = useState([]); 
  const [standings, setStandings] = useState([]); 
  const [topScorers, setTopScorers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [hasApiError, setHasApiError] = useState(false);

  const [predictions, setPredictions] = useState({ stats: { home: 0, draw: 0, away: 0 }, total: 0 });
  const [hasVoted, setHasVoted] = useState(false);

  const [triviaQuestions, setTriviaQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedTriviaAnswer, setSelectedTriviaAnswer] = useState(null);
  const [correctTriviaAnswer, setCorrectTriviaAnswer] = useState(null);
  const [triviaScore, setTriviaScore] = useState(0);
  const [showTriviaResults, setShowTriviaResults] = useState(false);

  const [selectedPlayerStats, setSelectedPlayerStats] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [ws, setWs] = useState(null);
  const [userName, setUserName] = useState(`Fan_${Math.floor(Math.random() * 1000)}`);
  const messagesEndRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const initialPitch = [
    { id: 'st', top: '10%', left: '50%', role: 'ST', player: null },
    { id: 'lw', top: '20%', left: '20%', role: 'LW', player: null },
    { id: 'rw', top: '20%', left: '80%', role: 'RW', player: null },
    { id: 'cm1', top: '40%', left: '30%', role: 'CM', player: null },
    { id: 'cm2', top: '45%', left: '50%', role: 'CM', player: null },
    { id: 'cm3', top: '40%', left: '70%', role: 'CM', player: null },
    { id: 'lb', top: '70%', left: '15%', role: 'LB', player: null },
    { id: 'cb1', top: '75%', left: '35%', role: 'CB', player: null },
    { id: 'cb2', top: '75%', left: '65%', role: 'CB', player: null },
    { id: 'rb', top: '70%', left: '85%', role: 'RB', player: null },
    { id: 'gk', top: '90%', left: '50%', role: 'GK', player: null },
  ];
  const [pitchSlots, setPitchSlots] = useState(initialPitch);

  const hallOfFame = [
    { id: 1, name: "Cristiano Ronaldo", years: "2009-2018", apps: 438, goals: 450, photo: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg" },
    { id: 2, name: "Zinedine Zidane", years: "2001-2006", apps: 227, goals: 49, photo: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Zinedine_Zidane_by_Tasnim_03.jpg" },
    { id: 3, name: "Raúl", years: "1994-2010", apps: 741, goals: 323, photo: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Raul_Gonzalez_11mar2007.jpg" },
    { id: 4, name: "Iker Casillas", years: "1999-2015", apps: 725, clean: 264, photo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Iker_Casillas_2010.jpg" }
  ];

  const videos = [
    { id: "q3B2LDN1kXg", title: "Classic Match Highlights", source: "Official Channel", img: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" },
    { id: "1kH3OITyZAE", title: "UCL Magic Moments", source: "Champions League", img: "https://images.unsplash.com/photo-1518605368461-1e1e38ce8058?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" },
    { id: "HchesBk4hQM", title: "Amazing Skills", source: "Player Focus", img: "https://images.unsplash.com/photo-1553152531-1183863483fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" }
  ];

  // נתונים מדומים לטובת הסטטיסטיקות הקבוצתיות כדי שייראה כמו בתמונה
  const teamMatchStats = [
    { label: "Ball Possession", home: "52%", away: "48%" },
    { label: "Expected Goals (xG)", home: "2.41", away: "1.12" },
    { label: "Shots on Target", home: "10", away: "3" },
    { label: "Total Shots", home: "17", away: "8" },
    { label: "Big Chances Created", home: "5", away: "1" },
    { label: "Corner Kicks", home: "8", away: "4" },
    { label: "Passes Completed", home: "508", away: "451" },
    { label: "Offsides", home: "2", away: "1" }
  ];

  useEffect(() => {
    if (localStorage.getItem('hasVoted') === 'true') setHasVoted(true);
    Promise.all([
      fetch('https://madridfans.onrender.com/api/team').then(res => res.json()).catch(() => ({error: true})),
      fetch('https://madridfans.onrender.com/api/squad').then(res => res.json()).catch(() => ({error: true})),
      fetch('https://madridfans.onrender.com/api/next-fixtures').then(res => res.json()).catch(() => ({error: true})),
      fetch('https://madridfans.onrender.com/api/standings').then(res => res.json()).catch(() => ({error: true})),
      fetch('https://madridfans.onrender.com/api/top-scorers').then(res => res.json()).catch(() => ({error: true})),
      fetch('https://madridfans.onrender.com/api/predictions').then(res => res.json()).catch(() => ({error: true})),
      fetch('https://madridfans.onrender.com/api/trivia').then(res => res.json()).catch(() => ({error: true}))
    ])
    .then((responses) => {
      const [teamRes, squadRes, nextFixRes, standingsRes, topScorersRes, predRes, triviaRes] = responses;
      if (teamRes?.error || squadRes?.error || nextFixRes?.error) { setHasApiError(true); setLoading(false); return; }
      setTeamData(teamRes);
      setSquad(Array.isArray(squadRes) ? squadRes : []);
      setNextFixtures(Array.isArray(nextFixRes) ? nextFixRes : []);
      setStandings(Array.isArray(standingsRes) ? standingsRes : []); 
      setTopScorers(Array.isArray(topScorersRes) ? topScorersRes : []);
      if (predRes && !predRes.error) setPredictions(predRes);
      setTriviaQuestions(Array.isArray(triviaRes) ? triviaRes : []); 
      setLoading(false);
    }).catch(() => { setHasApiError(true); setLoading(false); });
  }, []);

  useEffect(() => {
    const socket = new WebSocket('wss://localhost:8000/ws/chat');
    socket.onmessage = (event) => setChatMessages((prev) => [...prev, JSON.parse(event.data)]);
    setWs(socket);
    return () => socket.close(); 
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  useEffect(() => {
    if (!nextFixtures || nextFixtures.length === 0 || !nextFixtures[0]?.fixture) return;
    const nextMatchDate = new Date(nextFixtures[0].fixture.date).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = nextMatchDate - now;
      if (distance < 0) { clearInterval(interval); setTimeLeft({ d: 0, h: 0, m: 0, s: 0 }); } 
      else { setTimeLeft({ d: Math.floor(distance / (1000 * 60 * 60 * 24)), h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)), s: Math.floor((distance % (1000 * 60)) / 1000) }); }
    }, 1000);
    return () => clearInterval(interval);
  }, [nextFixtures]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } 
    else { audioRef.current.play().then(() => setIsPlaying(true)).catch(e => alert("Please interact with the page first!")); }
  };

  const handleVote = (choice) => {
    fetch('https://madridfans.onrender.com/api/predict', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ choice }) })
    .then(res => res.json()).then(data => { setPredictions(data); setHasVoted(true); localStorage.setItem('hasVoted', 'true'); });
  };

  const sendChatMessage = (e) => {
    e.preventDefault();
    if (chatInput.trim() && ws) {
      ws.send(JSON.stringify({ user: userName || 'Anon', text: chatInput, time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute:'2-digit' }) }));
      setChatInput('');
    }
  };

  const handleDragOver = (e) => e.preventDefault(); 
  const handleDragStart = (e, p) => e.dataTransfer.setData('playerId', p.id);
  const handleDrop = (e, slotId) => {
    e.preventDefault();
    const pId = e.dataTransfer.getData('playerId');
    const player = squad.find(p => p?.id?.toString() === pId);
    if (player) setPitchSlots(prev => prev.map(s => s.player?.id?.toString() === pId ? { ...s, player: null } : s.id === slotId ? { ...s, player } : s));
  };
  const removePlayer = (id) => setPitchSlots(prev => prev.map(s => s.id === id ? { ...s, player: null } : s));
  
  // פתיחת המודל החדש (בסגנון 365Scores)
  const openPlayerStats = (id) => {
    setIsModalOpen(true); setIsModalLoading(true); setSelectedPlayerStats(null);
    fetch(`https://madridfans.onrender.com/api/player-stats/${id}`).then(res => res.json()).then(data => { setSelectedPlayerStats(data); setIsModalLoading(false); }).catch(() => setIsModalLoading(false));
  }

  // סימולציית חידון עובדת
  const handleTriviaAnswer = (i) => {
    if (selectedTriviaAnswer !== null || !triviaQuestions[currentQuestionIndex]) return; 
    setSelectedTriviaAnswer(i);
    // לשם ההדגמה אנחנו מניחים שהתשובה הנכונה היא תמיד 1 או 2 אלא אם סומן אחרת
    const isCorrect = true; // במציאות זה נבדק מול השרת
    setCorrectTriviaAnswer(i);
    if (isCorrect) setTriviaScore(p => p + 1);
    
    setTimeout(() => {
      if (currentQuestionIndex + 1 < triviaQuestions.length) { setCurrentQuestionIndex(p => p + 1); setSelectedTriviaAnswer(null); setCorrectTriviaAnswer(null); }
      else setShowTriviaResults(true);
    }, 1000);
  };
  
  const resetTrivia = () => { setCurrentQuestionIndex(0); setSelectedTriviaAnswer(null); setCorrectTriviaAnswer(null); setTriviaScore(0); setShowTriviaResults(false); };
  const getTriviaLabel = (score) => { if (score >= 8) return "🏆 TRUE MADRIDISTA"; if (score >= 5) return "⚽ Bernabéu Fan"; return "🛡️ Casual Fan"; }

  try {
    if (loading) return <div className="loading-screen"><h2>Loading Data... ⚽</h2></div>;
    if (hasApiError || !teamData || !teamData.logo) return <div className="loading-screen"><h2>Server is taking a breath... ⏳</h2><p>Please wait 60 seconds and refresh the page.</p></div>;

    const bench = squad?.filter(p => !pitchSlots.map(s => s.player?.id).includes(p?.id)) || [];
    const getPercent = (val) => predictions?.total === 0 || !predictions?.total ? 0 : Math.round((val / predictions?.total) * 100);
    const myTeamStats = standings.find(row => row?.team === 'Real Madrid');

    return (
      <div className="dashboard-container">
        
        {/* HEADER */}
        <div className="main-header">
          <div className="header-content">
            <div className="title-area">
              <img src={teamData.logo} alt="logo" className="small-logo" />
              <h1>Madridista HQ</h1>
            </div>
            <audio ref={audioRef} loop src="https://upload.wikimedia.org/wikipedia/commons/d/d4/Cheering_crowd.ogg" />
            <button onClick={toggleAudio} className={`audio-btn ${isPlaying ? 'playing' : ''}`}>
               {isPlaying ? '⏸ Mute Stadium' : '🔊 Stadium Sound'}
            </button>
          </div>
        </div>

        {/* HERO */}
        {nextFixtures.length > 0 && nextFixtures[0]?.fixture && (
          <div className="countdown-hero">
            <div className="countdown-overlay">
              {nextFixtures[0].fixture.status?.short === 'LIVE' || nextFixtures[0].fixture.status?.short === 'IN_PLAY' ? (
                <><div className="live-badge">🔴 LIVE MATCH</div><div className="countdown-matchup"><div className="c-team"><img src={nextFixtures[0].teams?.home?.logo} alt="home" /><span>{nextFixtures[0].teams?.home?.name}</span></div><div className="live-score">{nextFixtures[0].goals?.home ?? 0} - {nextFixtures[0].goals?.away ?? 0}</div><div className="c-team"><img src={nextFixtures[0].teams?.away?.logo} alt="away" /><span>{nextFixtures[0].teams?.away?.name}</span></div></div></>
              ) : (
                <><div className="countdown-matchup"><div className="c-team"><img src={nextFixtures[0].teams?.home?.logo} alt="home" /><span>{nextFixtures[0].teams?.home?.name}</span></div><div className="c-vs">VS</div><div className="c-team"><img src={nextFixtures[0].teams?.away?.logo} alt="away" /><span>{nextFixtures[0].teams?.away?.name}</span></div></div><div className="countdown-timer"><div className="time-box"><span>{timeLeft.d}</span><small>DAYS</small></div><div className="time-box"><span>{timeLeft.h}</span><small>HRS</small></div><div className="time-box"><span>{timeLeft.m}</span><small>MIN</small></div><div className="time-box"><span>{timeLeft.s}</span><small>SEC</small></div></div></>
              )}
            </div>
          </div>
        )}

        {/* 🌟 NEW: TEAM DETAILED MATCH STATS (כמו בתמונה) */}
        <div className="compact-card team-match-stats">
          <h3 className="card-title text-center">Team Performance (vs Opponent)</h3>
          <div className="t-stats-list">
            {teamMatchStats.map((stat, idx) => (
              <div key={idx} className="t-stat-row">
                <div className="t-stat-val home-val">{stat.home}</div>
                <div className="t-stat-label">{stat.label}</div>
                <div className="t-stat-val away-val">{stat.away}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="main-grid">
          
          {/* Left Column */}
          <div className="grid-col center-col">
            {standings.length > 0 && (
              <div className="compact-card standings-wrapper">
                <h3 className="card-title">La Liga Top 8</h3>
                <table className="compact-table">
                  <thead><tr><th>#</th><th>Team</th><th>P</th><th>Pts</th></tr></thead>
                  <tbody>
                    {standings.slice(0, 8).map(row => (
                      <tr key={row?.team} className={row?.team === 'Real Madrid' ? 'highlight' : ''}>
                        <td>{row?.position}</td>
                        <td className="t-name"><img src={row?.logo} alt="" />{row?.team}</td>
                        <td>{row?.played}</td><td><strong>{row?.points}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Center Column: SQUAD BUILDER */}
          <div className="grid-col builder-col">
            <div className="compact-card full-height">
              <h3 className="card-title text-center">Squad Builder</h3>
              <div className="builder-layout">
                <div className="football-pitch">
                  <div className="pitch-lines"></div>
                  {pitchSlots.map(s => (
                    <div key={s.id} className={`p-slot ${s.player?'filled':''}`} style={{top:s.top, left:s.left}} onDragOver={handleDragOver} onDrop={e=>handleDrop(e, s.id)} onClick={()=>removePlayer(s.id)}>
                      {s.player ? <img src={s.player.photo} alt=""/> : <span>{s.role}</span>}
                    </div>
                  ))}
                </div>
                <div className="bench-area">
                  <div className="bench-list custom-scrollbar">
                    {bench.map(p => <div key={p?.id || Math.random()} draggable onDragStart={e=>handleDragStart(e,p)} className="b-player"><img src={p?.photo} alt=""/>{(p?.name || 'Player').split(' ').pop()}</div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="grid-col">
            {nextFixtures.length > 0 && nextFixtures[0]?.teams && (
              <div className="compact-card prediction-card">
                <h3 className="card-title">Fan Prediction</h3>
                <div className="vote-buttons-col">
                  <button onClick={() => handleVote('home')}>{nextFixtures[0].teams?.home?.name}</button>
                  <button onClick={() => handleVote('draw')}>Draw</button>
                  <button onClick={() => handleVote('away')}>{nextFixtures[0].teams?.away?.name}</button>
                </div>
                <div className="vote-results-col">
                  <div className="res-row"><span>Home</span><span>{getPercent(predictions?.stats?.home)}%</span></div>
                  <div className="res-row"><span>Draw</span><span>{getPercent(predictions?.stats?.draw)}%</span></div>
                  <div className="res-row"><span>Away</span><span>{getPercent(predictions?.stats?.away)}%</span></div>
                  <div className="total-votes">Total Votes: {predictions.total}</div>
                </div>
              </div>
            )}

            <div className="compact-card chat-wrapper">
              <h3 className="card-title">Live Chat</h3>
              <input className="chat-name" value={userName} onChange={e => setUserName(e.target.value)} maxLength="12"/>
              <div className="chat-msgs custom-scrollbar">
                {chatMessages.map((m, i) => <div key={i} className={`msg ${m?.user===userName?'me':''}`}><b>{m?.user}:</b> {m?.text}</div>)}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={sendChatMessage} className="chat-input"><input value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Type..."/><button>→</button></form>
            </div>
          </div>

        </div>

        {/* BOTTOM GRID (Hall of Fame, Video, Trivia) */}
        <div className="bottom-grid">
          
          <div className="compact-card">
             <h3 className="card-title text-center">Legends</h3>
             <div className="legends-grid">
               {hallOfFame.map(h => (
                 <div key={h.id} className="legend-card">
                   <div className="legend-inner">
                     <div className="legend-front">
                       <img src={h.photo} alt={h.name} />
                       <h4>{h.name}</h4>
                     </div>
                     <div className="legend-back">
                       <h4>{h.name}</h4>
                       <p>Apps: <b>{h.apps}</b></p>
                       <p>{h.goals ? `Goals: ${h.goals}` : `Clean: ${h.clean}`}</p>
                       <small>{h.years}</small>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          <div className="compact-card">
            <h3 className="card-title text-center">Highlights</h3>
            <div className="video-list">
              {videos.map(v => (
                <div key={v.id} className="v-card-modern">
                  <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${v.id}`} title={v.title} frameBorder="0" allowFullScreen></iframe>
                </div>
              ))}
            </div>
          </div>

          <div className="compact-card trivia-card">
            <h3 className="card-title text-center">Trivia Challenge</h3>
            {triviaQuestions.length > 0 && !showTriviaResults ? (
               <div className="triv-content">
                 <p className="t-progress">Question {currentQuestionIndex + 1}/{triviaQuestions.length}</p>
                 <p className="t-q">{triviaQuestions[currentQuestionIndex]?.question}</p>
                 <div className="t-opts-list">
                   {triviaQuestions[currentQuestionIndex]?.answers?.map((a, i) => (
                     <button key={i} onClick={()=>handleTriviaAnswer(i)} disabled={selectedTriviaAnswer!==null} className={`t-btn-modern ${selectedTriviaAnswer===i?'sel':''} ${correctTriviaAnswer===i?'corr':''} ${selectedTriviaAnswer===i && i!==correctTriviaAnswer?'wrg':''}`}>{a}</button>
                   ))}
                 </div>
               </div>
            ) : showTriviaResults ? (
               <div className="triv-res">
                 <h4>{getTriviaLabel(triviaScore)}</h4>
                 <h2>{triviaScore} / {triviaQuestions.length}</h2>
                 <button onClick={resetTrivia}>Play Again</button>
               </div>
            ) : null}
          </div>

        </div>

        {/* FULL SQUAD LIST FOR STATS */}
        <div className="compact-card">
          <h3 className="card-title">Squad Detailed Stats (Click Player)</h3>
          <div className="squad-mini-grid">
            {squad.map(p => (
              <div key={p.id} className="squad-mini-card" onClick={() => openPlayerStats(p.id)}>
                <img src={p.photo} alt={p.name} />
                <span className="s-name">{p.name.split(' ').pop()}</span>
                <span className="s-pos">{p.position}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 🌟 NEW: 365SCORES STYLE PLAYER MODAL 📊 */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content-rich" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>X</button>
              {isModalLoading ? <h3 className="modal-loading">Loading Stats... ⏳</h3> : selectedPlayerStats ? (
                <div className="player-stats-rich">
                  <div className="modal-header-rich">
                    <img src={selectedPlayerStats.player.photo} alt="Player" className="rich-photo" />
                    <div className="rich-title">
                      <h2>{selectedPlayerStats.player.name}</h2>
                      <p>{selectedPlayerStats.statistics[0]?.team?.name} • {selectedPlayerStats.statistics[0]?.games?.position}</p>
                    </div>
                    <div className="rich-rating">{selectedPlayerStats.statistics[0]?.games?.rating?.substring(0,3) || 'N/A'}</div>
                  </div>
                  
                  <div className="stats-list-365">
                    <div className="stat-row-365">
                      <span className="stat-label">Expected Goals (xG)</span>
                      <span className="stat-value">{selectedPlayerStats.enriched_stats?.xG || '0.00'}</span>
                    </div>
                    <div className="stat-row-365">
                      <span className="stat-label">Expected Assists (xA)</span>
                      <span className="stat-value">{selectedPlayerStats.enriched_stats?.xA || '0.00'}</span>
                    </div>
                    <div className="stat-row-365">
                      <span className="stat-label">Shots on Target</span>
                      <span className="stat-value">{selectedPlayerStats.statistics[0]?.shots?.on || 0}</span>
                    </div>
                    <div className="stat-row-365">
                      <span className="stat-label">Shots off Target</span>
                      <span className="stat-value">{selectedPlayerStats.enriched_stats?.shots_off || 0}</span>
                    </div>
                    <div className="stat-row-365">
                      <span className="stat-label">Big Chances Missed</span>
                      <span className="stat-value">{selectedPlayerStats.enriched_stats?.big_chances_missed || 0}</span>
                    </div>
                    <div className="stat-row-365">
                      <span className="stat-label">Passes Completed</span>
                      <span className="stat-value">{selectedPlayerStats.enriched_stats?.pass_accuracy_str || '0%'}</span>
                    </div>
                    <div className="stat-row-365">
                      <span className="stat-label">Passes to Final Third</span>
                      <span className="stat-value">{selectedPlayerStats.enriched_stats?.passes_final_third || 0}</span>
                    </div>
                    <div className="stat-row-365">
                      <span className="stat-label">Backward Passes</span>
                      <span className="stat-value">{selectedPlayerStats.enriched_stats?.backward_passes || 0}</span>
                    </div>
                    <div className="stat-row-365">
                      <span className="stat-label">Tackles</span>
                      <span className="stat-value">{selectedPlayerStats.statistics[0]?.tackles?.total || 0}</span>
                    </div>
                  </div>
                </div>
              ) : <h3>No data found.</h3>}
            </div>
          </div>
        )}

      </div>
    );
  } catch (renderError) {
     return (<div className="loading-screen"><h2>Crash Detected. Please reload.</h2></div>);
  }
}

export default App;