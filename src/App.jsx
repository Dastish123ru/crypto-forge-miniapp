import { useState, useEffect } from "react";

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
    <div className="app">
      <h1>CryptoForge Кран</h1>
      <p>Баланс: {balance} Статер</p>
      <button onClick={handleFarm} disabled={timer > 0}>
        {timer > 0 ? `Жди: ${formatTime(timer)}` : "Фармить 1 Статер"}
      </button>
    </div>
  );
};

export default App;
