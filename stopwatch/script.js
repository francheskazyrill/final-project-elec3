// Modern Stopwatch Logic
const timeDisplay = document.querySelector('[data-time-display]');
const controls = document.querySelector('[data-controls]');
let startTime, timer, running = false, elapsed = 0;

function pad(n, z = 2) {
  return n.toString().padStart(z, '0');
}

function render(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const ms2 = Math.floor((ms % 1000) / 10);
  timeDisplay.querySelector('[data-part="hours"]').textContent = pad(h);
  timeDisplay.querySelector('[data-part="minutes"]').textContent = pad(m);
  timeDisplay.querySelector('[data-part="seconds"]').textContent = pad(s);
  timeDisplay.querySelector('[data-part="milliseconds"]').textContent = pad(ms2);
}

function start() {
  if (running) return;
  running = true;
  startTime = Date.now() - elapsed;
  timer = setInterval(() => {
    elapsed = Date.now() - startTime;
    render(elapsed);
  }, 10);
}

function reset() {
  running = false;
  clearInterval(timer);
  elapsed = 0;
  render(elapsed);
}

controls.addEventListener('click', e => {
  if (!e.target.matches('button')) return;
  if (e.target.dataset.action === 'start') {
    if (running) {
      running = false;
      clearInterval(timer);
      e.target.textContent = 'Start';
    } else {
      start();
      e.target.textContent = 'Pause';
    }
  } else if (e.target.dataset.action === 'reset') {
    reset();
    controls.querySelector('[data-action="start"]').textContent = 'Start';
  }
});

document.addEventListener('keydown', e => {
  if (e.key === ' ' || e.key === 'Enter') {
    controls.querySelector('[data-action="start"]').click();
  } else if (e.key === 'Escape') {
    controls.querySelector('[data-action="reset"]').click();
  }
});

render(0);
