/* script.js */
const symbols = ['🔵', '🟢', '🟡', '🟣', '🔴', '💎', '⚡'];
const gridSize = 6;
let balance = 100.00;
let freeSpins = 0;
let betAmount = 10;
let multiplier = 1;
const freeSpinCost = 25;
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

function updateBalance() {
  document.getElementById('balance').textContent = `Saldo: R$${balance.toFixed(2)}`;
}

function updateBet() {
  document.getElementById('bet-value').textContent = `Aposta: R$${betAmount},00`;
}

function spin() {
  const cells = document.querySelectorAll('.slot-cell');
  const results = [];
  const grid = [];

  cells.forEach(cell => {
    cell.classList.add('fall');
    setTimeout(() => {
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      grid.push(randomSymbol);
      cell.textContent = randomSymbol;
      cell.classList.remove('fall');
    }, 500); 
  });

  setTimeout(() => {
    checkWin(grid);
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
        freeSpins += 1;
        document.getElementById('free-spins').textContent = `Rodadas Grátis: ${freeSpins}`;
        alert('Rodadas Grátis Ativadas!');
      } else {
        winAmount += count * 10 * multiplier;
      }
    }
  }

  if (winAmount > 0) {
    balance += winAmount;
    alert(`Você ganhou R$${winAmount.toFixed(2)}!`);
    gameHistory.push({ type: 'ganho', amount: winAmount });
  } else {
    balance -= betAmount;
    gameHistory.push({ type: 'perda', amount: betAmount });
  }

  updateBalance();
}

function applyMultiplier() {
  multiplier = Math.floor(Math.random() * 3) + 1;  // Aplica um multiplicador aleatório
  alert(`Multiplicador de aposta: ${multiplier}x`);
}

document.getElementById('spin-btn').addEventListener('click', () => {
  if (balance >= betAmount || freeSpins > 0) {
    if (freeSpins > 0) {
      freeSpins -= 1;
      document.getElementById('free-spins').textContent = `Rodadas Grátis: ${freeSpins}`;
    } else {
      applyMultiplier();
      balance -= betAmount;
    }
    spin();
  } else {
    alert('Saldo insuficiente!');
  }
});

document.getElementById('bet-amount').addEventListener('input', (e) => {
  betAmount = parseInt(e.target.value);
  updateBet();
});

document.getElementById('buy-free-spins').addEventListener('click', () => {
  if (balance >= freeSpinCost) {
    freeSpins += 1;
    balance -= freeSpinCost;
    updateBalance();
    document.getElementById('free-spins').textContent = `Rodadas Grátis: ${freeSpins}`;
    alert('Você comprou uma rodada grátis!');
  } else {
    alert('Saldo insuficiente para comprar rodadas grátis!');
  }
});

document.getElementById('payout-table-btn').addEventListener('click', () => {
  document.getElementById('payout-table').style.display = 'block';
});

function checkDailyChallenge() {
  dailyChallenge.completed++;
  if (dailyChallenge.completed >= 10) {
    alert(`Desafio concluído! Você ganhou ${dailyChallenge.reward}`);
    balance += 50;
    updateBalance();
  }
}

function closeChallenge() {
  document.getElementById('challenge-modal').style.display = 'none';
}

createGrid();
updateBalance();
updateBet();
