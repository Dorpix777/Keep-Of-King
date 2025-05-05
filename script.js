const symbols = ['🔵', '🟢', '🟡', '🟣', '🔴', '💎', '⚡'];
const gridSize = 3;
let balance = 100.00;
let freeSpins = 0;
let betAmount = 10;
let multiplier = 1;
const freeSpinCost = 100;
let dailyChallenge = { task: "Gire 10 vezes hoje", completed: 0, reward: "R$50,00" };
let gameHistory = [];

function createGrid() {
  const grid = document.getElementById('slot-grid');
  grid.innerHTML = '';
  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('slot-cell');
    grid.appendChild(cell);
  }
}

function updateUI() {
  document.getElementById('balance').textContent = `Saldo: R$${balance.toFixed(2)}`;
  document.getElementById('bet-value').textContent = `Aposta: R$${betAmount},00`;
  document.getElementById('free-spins').textContent = `Rodadas Grátis: ${freeSpins}`;
}

function applyMultiplier() {
  multiplier = Math.floor(Math.random() * 3) + 1;
  alert(`Multiplicador de aposta: ${multiplier}x`);
}

function spin() {
  const cells = document.querySelectorAll('.slot-cell');
  const results = [];

  cells.forEach((cell, index) => {
    cell.classList.add('fall');
    setTimeout(() => {
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      cell.textContent = randomSymbol;
      results.push(randomSymbol);
      cell.classList.remove('fall');
    }, 200 * index);
  });

  setTimeout(() => {
    checkWin(results);
    checkDailyChallenge();
  }, 1000);
}

function checkWin(results) {
  const symbolCount = {};
  results.forEach(symbol => {
    symbolCount[symbol] = (symbolCount[symbol] || 0) + 1;
  });

  let winAmount = 0;
  for (const [symbol, count] of Object.entries(symbolCount)) {
    if (count >= 3) {
      if (symbol === '⚡') {
        freeSpins++;
        alert('Você ganhou uma rodada grátis!');
      } else {
        winAmount += count * betAmount * multiplier;
      }
    }
  }

  if (winAmount > 0) {
    balance += winAmount;
    gameHistory.push({ type: 'ganho', amount: winAmount });
    alert(`Você ganhou R$${winAmount.toFixed(2)}!`);
  } else {
    balance -= betAmount;
    gameHistory.push({ type: 'perda', amount: betAmount });
  }

  updateUI();
}

function spinFreeRounds() {
  for (let i = 0; i < 10; i++) {
    setTimeout(spin, 1500 * i);
  }
}

function checkDailyChallenge() {
  dailyChallenge.completed++;
  if (dailyChallenge.completed >= 10) {
    alert(`Desafio diário concluído! Você ganhou ${dailyChallenge.reward}`);
    balance += 50;
    updateUI();
  }
}

function closeChallenge() {
  document.getElementById('challenge-modal').style.display = 'none';
}

// Eventos
document.getElementById('spin-btn').addEventListener('click', () => {
  if (balance >= betAmount || freeSpins > 0) {
    if (freeSpins > 0) {
      freeSpins--;
      spinFreeRounds();
    } else {
      applyMultiplier();
      balance -= betAmount;
      spin();
    }
  } else {
    alert('Saldo insuficiente!');
  }
});

document.getElementById('bet-amount').addEventListener('input', (e) => {
  betAmount = parseInt(e.target.value) || 10;
  updateUI();
});

document.getElementById('buy-free-spins').addEventListener('click', () => {
  const cost = freeSpinCost * betAmount;
  if (balance >= cost) {
    freeSpins++;
    balance -= cost;
    alert('Você comprou uma rodada grátis!');
    updateUI();
  } else {
    alert('Saldo insuficiente para rodadas grátis!');
  }
});

document.getElementById('payout-table-btn').addEventListener('click', () => {
  document.getElementById('payout-table').style.display = 'block';
});

// Inicialização
createGrid();
updateUI();
