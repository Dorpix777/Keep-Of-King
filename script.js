/* script.js */
const symbols = ['🔵', '🟢', '🟡', '🟣', '🔴', '💎', '🍷', '⏳', '👑', '⚡'];
const gridSize = 6;
let balance = 100.00;
let freeSpins = 0;

const winSound = document.getElementById('win-sound');
const spinSound = document.getElementById('spin-sound');

function createGrid() {
  const grid = document.getElementById('slot-grid');
  grid.innerHTML = '';
  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('slot-cell');
    grid.appendChild(cell);
  }
}

function playSound(sound) {
  sound.currentTime = 0; // Rewind to start
  sound.play();
}

function spin() {
  const cells = document.querySelectorAll('.slot-cell');
  const results = [];
  playSound(spinSound);
  
  // Animação de rotação
  cells.forEach(cell => cell.classList.add('animate'));

  setTimeout(() => {
    cells.forEach(cell => cell.classList.remove('animate'));

    for (let i = 0; i < gridSize * gridSize; i++) {
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      results.push(randomSymbol);
      cells[i].textContent = randomSymbol;
    }
    checkWin(results);
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
    playSound(winSound);
    alert(`Você ganhou R$${winAmount.toFixed(2)} com multiplicador ${multiplier}x!`);
  } else if (freeSpins === 0) {
    balance -= 10; // Custo por rodada
  }

  document.getElementById('balance').textContent = `Saldo: R$${balance.toFixed(2)}`;
}

document.getElementById('spin-btn').addEventListener('click', () => {
  if (balance >= 10 || freeSpins > 0) {
    if (freeSpins > 0) {
      freeSpins -= 1;
      document.getElementById('free-spins').textContent = `Rodadas Grátis: ${freeSpins}`;
    }
    spin();
  } else {
    alert('Saldo insuficiente para jogar!');
  }
});

createGrid();
