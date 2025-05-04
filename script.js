/* script.js */
const symbols = ['🔵', '🟢', '🟡', '🟣', '🔴', '💎', '🍷', '⏳', '👑'];
const gridSize = 6;
let balance = 100.00;

function createGrid() {
  const grid = document.getElementById('slot-grid');
  grid.innerHTML = '';
  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('slot-cell');
    grid.appendChild(cell);
  }
}

function spin() {
  const cells = document.querySelectorAll('.slot-cell');
  const results = [];
  for (let i = 0; i < gridSize * gridSize; i++) {
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    results.push(randomSymbol);
    cells[i].textContent = randomSymbol;
  }
  checkWin(results);
}

function checkWin(results) {
  const symbolCount = {};
  results.forEach(symbol => {
    symbolCount[symbol] = (symbolCount[symbol] || 0) + 1;
  });

  let winAmount = 0;
  for (const [symbol, count] of Object.entries(symbolCount)) {
    if (count >= 8) {
      winAmount += count * 10; // Exemplo de cálculo de ganho
    }
  }

  if (winAmount > 0) {
    balance += winAmount;
    alert(`Você ganhou R$${winAmount.toFixed(2)}!`);
  } else {
    balance -= 10; // Exemplo de custo por rodada
  }

  document.getElementById('balance').textContent = `Saldo: R$${balance.toFixed(2)}`;
}

document.getElementById('spin-btn').addEventListener('click', () => {
  if (balance >= 10) {
    spin();
  } else {
    alert('Saldo insuficiente para jogar!');
  }
});

createGrid();
