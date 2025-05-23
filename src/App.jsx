// src/App.jsx
import { useState, useEffect, useRef } from 'react';
import './style.css';
import logoSrc from './assets/logo.png';
import tonSrc from './assets/ton-logo.png';

const FARM_INTERVAL = 120 * 60; // 120 минут

// Наша «таблица»: верхние границы диапазонов и выплаты
// src/App.jsx
// …в начале файла, вместо прежнего prizes
const prizes = [
  { max: 9885,   amount:    1   },   // 00001–09885  (90%)
  { max: 9985,   amount:   10   },   // 09886–09985  (8.889%)
  { max: 9993,   amount:  100   },   // 09986–09993  (1%)
  { max: 9997,   amount: 1000   },   // 09994–09997  (0.1%)
  { max: 9999,   amount:10000   },   // 09998–09999  (0.01%)
  { max:10000,   amount:100000  },   // 10000       (0.001%)
];


export default function App() {
  const [timer, setTimer]     = useState(0);
  const [balance, setBalance] = useState(0);
  const [spinValue, setSpinValue]   = useState('00000');
  const [isSpinning, setIsSpinning] = useState(false);
  const lastTsRef = useRef(0);
  const intervalRef = useRef(null);

  // Обновляем таймер раз в секунду
  const updateTimer = () => {
    const now = Date.now();
    const elapsedSec = Math.floor((now - lastTsRef.current) / 1000);
    setTimer(Math.max(0, FARM_INTERVAL - elapsedSec));
  };

  useEffect(() => {
    // Загрузка из API, как раньше
    fetch(`/api?tg=@menbe1s`)
      .then(r => r.json())
      .then(({ balance: bal, lastTs }) => {
        setBalance(bal);
        lastTsRef.current = lastTs;
        setTimer(lastTs === 0 ? 0 : Math.max(0, FARM_INTERVAL - Math.floor((Date.now() - lastTs)/1000)));
        intervalRef.current = setInterval(updateTimer, 1000);
      })
      .catch(console.error);
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleFarm = () => {
    if (timer > 0 || isSpinning) return;  // пока таймер идёт или уже спин, блокируем

    setIsSpinning(true);

    // 1. Запускаем «крутилку» цифр
    let spinCount = 0;
    const spinInterval = setInterval(() => {
      const rnd = Math.floor(Math.random() * 10000) + 1; // 1–10000
      setSpinValue(String(rnd).padStart(5, '0'));
      spinCount++;
      if (spinCount >= 30) {  // через 30 итераций (~1 секунда) останавливаем крутилку
        clearInterval(spinInterval);

        // 2. Окончательное случайное число
        const finalNum = Math.floor(Math.random() * 10000) + 1;
        const finalStr = String(finalNum).padStart(5, '0');
        setSpinValue(finalStr);

        // 3. Определяем выигрыш по таблице
        const prize = prizes.find(p => finalNum <= p.max).amount;

        // 4. Обновляем баланс атомарно
        const newBalance = balance + prize;
        setBalance(newBalance);

        // 5. Ставим новый lastTs и таймер
        lastTsRef.current = Date.now();
        setTimer(FARM_INTERVAL);

        // 6. Сохраняем на бэкенде
        fetch('/api', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tg: '@menbe1s', amount: newBalance }),
        }).catch(console.error);

        setIsSpinning(false);
      }
    }, 33); // примерно 30 кадров в секунду
  };

  const formatTime = s => {
    const m = String(Math.floor(s/60)).padStart(2,'0');
    const sec = String(s%60).padStart(2,'0');
    return `${m}:${sec}`;
  };

  return (
    <div className="app-container">
      <img src={logoSrc} alt="CryptoForge" className="logo" />
      <div className="balance">
        Баланс: {balance} <img src={tonSrc} alt="TON" className="ton-icon"/>
      </div>

      <div className="spinner">
        <span>{spinValue}</span>
      </div>

      <div className="timer">
        {timer>0 ? `Жди: ${formatTime(timer)}` : 'Готов!'}
      </div>

      <button
        className="farm-btn"
        onClick={handleFarm}
        disabled={timer>0 || isSpinning}
      >
        {isSpinning ? 'Крутим...' : 'Фармить'}
      </button>
      <div className="footer">@Crypt0Forge_bot</div>
    </div>
  );
}
