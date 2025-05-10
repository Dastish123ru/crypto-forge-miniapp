import { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [timer, setTimer] = useState(7200);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleFarm = () => {
    if (timer === 0) {
      setBalance(balance + 1);
      setTimer(7200);
    }
  };

  return (
    <div className="forge-wrapper">
      <div className="forge-header">
        <h1>CryptoForge</h1>
        <p>Твой баланс: {balance} Статеров</p>
      </div>
      <div className="forge-core">
        <div className="timer-display">
          {timer > 0 ? `Жди: ${formatTime(timer)}` : 'Фармить 1 Статер'}
        </div>
        <button onClick={handleFarm} disabled={timer > 0} className="forge-button">
          Фармить
        </button>
      </div>
      <div className="forge-footer">@Crypt0Forge_bot</div>
    </div>
  );
};

export default App;