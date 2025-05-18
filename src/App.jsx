// src/App.jsx
import { useState, useEffect, useRef } from 'react';
import './style.css';
import logoSrc from './assets/logo.png';
import tonSrc from './assets/ton-logo.png';

const FARM_INTERVAL = 120 * 60; // 120 минут в секундах

export default function App() {
  const [timer, setTimer] = useState(0);
  const [balance, setBalance] = useState(0);
  const lastTsRef = useRef(0);
  const intervalRef = useRef(null);

  // Функция для обновления таймера на основе lastTs
  const updateTimer = () => {
    const now = Date.now();
    const elapsedSec = Math.floor((now - lastTsRef.current) / 1000);
    const remaining = Math.max(0, FARM_INTERVAL - elapsedSec);
    setTimer(remaining);
  };

  // При монтировании: сначала подгружаем баланс и lastTs из API
  useEffect(() => {
    fetch(`/api?tg=@menbe1s`)
      .then((res) => res.json())
      .then(({ balance: bal, lastTs }) => {
        setBalance(bal);
        lastTsRef.current = lastTs;
        // если lastTs = 0 (первый запуск) — сразу устанавливаем timer=0
        if (lastTs === 0) {
          setTimer(0);
        } else {
          updateTimer();
        }
        // запустим интервал для каждую секунду обновлять таймер, но только если он >0
        intervalRef.current = setInterval(() => {
          updateTimer();
        }, 1000);
      })
      .catch(console.error);

    return () => clearInterval(intervalRef.current);
  }, []);

   const handleFarm = () => {
   if (timer === 0) {
-    setBalance((b) => b + 1);
-    const now = Date.now();
-    lastTsRef.current = now;
-    setTimer(FARM_INTERVAL);
-
-    fetch('/api', {
-      method: 'POST',
-      headers: { 'Content-Type': 'application/json' },
-      body: JSON.stringify({ tg: '@menbe1s', amount: balance + 1 }),
-    }).catch(console.error);
+    // 1) Вычисляем новый баланс
+    const newBalance = balance + 1;
+
+    // 2) Обновляем локальный стейт
+    setBalance(newBalance);
+
+    // 3) Отмечаем время фарма и запускаем таймер
+    const now = Date.now();
+    lastTsRef.current = now;
+    setTimer(FARM_INTERVAL);
+
+    // 4) Отправляем новый баланс на сервер
+    fetch('/api', {
+      method: 'POST',
+      headers: { 'Content-Type': 'application/json' },
+      body: JSON.stringify({ tg: '@menbe1s', amount: newBalance }),
+    }).catch(console.error);
   }
 };

  // Формат mm:ss
  const formatTime = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${m}:${sec}`;
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
        Фармить 1 Статер
      </button>
      <div className="footer">@Crypt0Forge_bot</div>
    </div>
  );
}
