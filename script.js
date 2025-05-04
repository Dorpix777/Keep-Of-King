/* script.js */
const symbols = ['🔵', '🟢', '🟡', '🟣', '🔴', '💎', '⚡'];
const gridSize = 6;
let balance = 100.00;
let freeSpins = 0;
let betAmount = 10; // Valor inicial da aposta
const freeSpinCost = 25; // Custo por rodada grátis

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

document.getElementById('bet-amount').addEventListener('input', (e) => {
  betAmount = parseInt(e.target.value);
  updateBet();
});

function spin() {
  const cells = document.querySelectorAll('.slot-cell');
  const results = [];
  const grid = [];

  // Animação de "tumble"
  cells.forEach(cell => {
    cell.classList.add('fall');
    setTimeout(() => {
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      grid.push(randomSymbol);
      cell.textContent = randomSymbol;
      cell.classList.remove('fall');
    }, 500); // Animação de queda de símbolos
  });

  setTimeout(() => {
    checkWin(grid);
  }, 1000);
}

function getRandomMultiplier() {
  return Math.floor(Math.random() * 500) + 2;
}

function checkWin(results) {
  const symbolCount = {};
  results.forEach(symbol => {
    symbolCount[symbol] = (symbolCount[symbol] || 0) + 1;
  });

  let winAmount = 0;
  let multiplier = 1;

  // Verificando se há multiplicadores ou rodadas grátis
  for (const [symbol, count] of Object.entries(symbolCount)) {
    if (count >= 8) {
      if (symbol === '⚡') {
        freeSpins += 1; // Adiciona rodadas grátis
        document.getElementById('free-spins').textContent = `Rodadas Grátis: ${freeSpins}`;
        alert('Rodadas Grátis Ativadas!');
      } else {
        multiplier = getRandomMultiplier();
        winAmount += count * 10 * multiplier; // Exemplo de cálculo de ganho com multiplicador
      }
    }
  }

  if (winAmount > 0) {
    balance += winAmount;
    alert(`Você ganhou R$${winAmount.toFixed(2)} com multiplicador ${multiplier}x!`);
  } else if (freeSpins === 0) {
    balance -= betAmount; // Deduz o valor da aposta
  }

  updateBalance();
}

document.getElementById('spin-btn').addEventListener('click', () => {
  if (balance >= betAmount || freeSpins > 0) {
    if (freeSpins > 0) {
      freeSpins -= 1;
      document.getElementById('free-spins').textContent = `Rodadas Grátis: ${freeSpins}`;
    }
    spin();
  } else {
    alert('Saldo insuficiente para jogar!');
  }
});

// Comprar rodadas grátis
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

// Mostrar tabela de pagamento
document.getElementById('payout-table-btn').addEventListener('click', () => {
  document.getElementById('payout-table').style.display = 'block';
});

createGrid();
updateBalance();
updateBet();
