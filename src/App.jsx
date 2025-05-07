import { useState, useEffect } from 'react';

const App = () => {
  const [timer, setTimer] = useState(1800);
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
      setBalance(balance + 2);
      setTimer(1800);
    }
  };

  return (
    <div className="text-center p-4">
      <h1 className="text-3xl font-bold mb-4">CryptoForge</h1>
      <p className="mb-2">Твой баланс: {balance} Статеров</p>
      <button
        onClick={handleFarm}
        disabled={timer > 0}
        className="bg-yellow-500 text-black px-6 py-2 rounded-xl disabled:opacity-50 transition"
      >
        {timer > 0 ? `Жди: ${formatTime(timer)}` : 'Фармить 2 Статера'}
      </button>
    </div>
  );
};

export default App;
