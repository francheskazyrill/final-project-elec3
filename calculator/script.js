// Modern Calculator Logic
const display = document.querySelector('[data-display]');
const keypad = document.querySelector('[data-keypad]');
let expression = '';

function updateDisplay() {
  display.textContent = expression || '0';
}

function append(char) {
  expression += char;
  updateDisplay();
}

function clear() {
  expression = '';
  updateDisplay();
}

function del() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function calculate() {
  try {
    // Evaluate safely
    const result = Function('return ' + expression.replace(/[^-+*/.\d()]/g, ''))();
    expression = String(result);
    updateDisplay();
  } catch {
    display.textContent = 'Error';
    setTimeout(clear, 1200);
  }
}

keypad.addEventListener('click', e => {
  if (!e.target.matches('button')) return;
  const btn = e.target;
  if (btn.dataset.digit) append(btn.dataset.digit);
  else if (btn.dataset.operator) append(btn.dataset.operator);
  else if (btn.dataset.action === 'clear') clear();
  else if (btn.dataset.action === 'delete') del();
  else if (btn.dataset.action === 'decimal') append('.');
  else if (btn.dataset.action === 'equals') calculate();
});

document.addEventListener('keydown', e => {
  if (/[0-9]/.test(e.key)) append(e.key);
  else if ('+-*/'.includes(e.key)) append(e.key);
  else if (e.key === 'Enter') calculate();
  else if (e.key === 'Escape') clear();
  else if (e.key === 'Backspace') del();
  else if (e.key === '.') append('.');
});

updateDisplay();
