import { useState, useEffect } from "react";
import tonLogo from "./ton-logo.png";

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
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleFarm = () => {
    if (timer === 0) {
      setBalance(balance + 1);
      setTimer(7200);
    }
  };

  return (
    <div className="forge-ui">
      <div className="header">
        <img src={tonLogo} alt="TON logo" className="logo"/>
        <h1>CryptoForge</h1>
        <p>Твой баланс: {balance} Статеров</p>
      </div>
      <div className="timer">
        {timer > 0 ? (
          <h2>Жди: {formatTime(timer)}</h2>
        ) : (
          <button onClick={handleFarm}>Фармить 1 Статер</button>
        )}
      </div>
      <p className="bot-hint">@Crypt0Forge_bot</p>
    </div>
  );
};

export default App;
