
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const users = {};

function getReward(num) {
  if (num <= 9885) return 0.000062165;
  if (num <= 9985) return 0.000621652;
  if (num <= 9993) return 0.006216517;
  if (num <= 9997) return 0.06216517;
  if (num <= 9999) return 0.6216517;
  return 6.2165;
}

app.get('/roll', (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ error: 'Missing user_id' });

  const now = Date.now();
  if (!users[userId]) {
    users[userId] = { balance: 0.000001, nextRoll: 0 };
  }

  if (now < users[userId].nextRoll) {
    const wait = Math.ceil((users[userId].nextRoll - now) / 1000);
    return res.json({ message: 'Wait for cooldown', secondsLeft: wait });
  }

  const num = Math.floor(Math.random() * 10001);
  const reward = getReward(num);
  users[userId].balance += reward;
  users[userId].nextRoll = now + 40 * 60 * 1000;

  res.json({
    luckyNumber: num,
    reward,
    balance: users[userId].balance.toFixed(6),
    nextRollIn: 40 * 60
  });
});

app.get('/boost', (req, res) => {
  const userId = req.query.user_id;
  if (!userId || !users[userId]) return res.status(400).json({ error: 'Invalid user_id' });

  users[userId].nextRoll = Math.max(Date.now(), users[userId].nextRoll - 10 * 60 * 1000);
  const wait = Math.ceil((users[userId].nextRoll - Date.now()) / 1000);

  res.json({ message: 'Timer boosted', secondsLeft: wait });
});

app.get('/balance', (req, res) => {
  const userId = req.query.user_id;
  if (!userId || !users[userId]) return res.status(400).json({ error: 'Invalid user_id' });

  res.json({ balance: users[userId].balance.toFixed(6) });
});

app.listen(PORT, () => {
  console.log(`CryptoForge backend running on port ${PORT}`);
});
