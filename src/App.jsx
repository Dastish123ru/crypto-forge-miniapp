// src/App.jsx
import { useState, useEffect } from 'react';
import './style.css';
import logoSrc from './assets/logo.png';
import tonSrc from './assets/ton-logo.png';

export default function App() {
  const [timer, setTimer] = useState(120 * 60);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const formatTime = (s) => {
    const m = String(Math.floor(s/60)).padStart(2,'0');
    const sec = String(s%60).padStart(2,'0');
    return `${m}:${sec}`;
  };

  const handleFarm = () => {
    if (timer === 0) {
      setBalance((b) => b + 1);
      setTimer(120 * 60);
    }
  };

  return (
    <div className="app-container">
      <img src={logoSrc} alt="CryptoForge" className="logo" />
      <div className="balance">
        Баланс: {balance} 
        <img src={tonSrc} alt="TON" className="ton-icon" />
      </div>
      <div className="timer">
        {timer > 0 ? `Жди: ${formatTime(timer)}` : 'Готов!'}
      </div>
      <button
        className="farm-btn"
        onClick={handleFarm}
        disabled={timer > 0}
      >
        Фармить{timer === 0 && ' 1 Статер'}
      </button>
      <div className="footer">@Crypt0Forge_bot</div>
    </div>
  );
}
