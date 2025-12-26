// Modern Weather App Logic
const API_KEY = '908a8ce779112f82b5a252abb4ba675e';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city');
const status = document.getElementById('status');
const card = document.getElementById('card');
const locationEl = document.getElementById('location');
const timestamp = document.getElementById('timestamp');
const icon = document.getElementById('icon');
const temp = document.getElementById('temp');
const summary = document.getElementById('summary');
const feels = document.getElementById('feels');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const forecastGrid = document.getElementById('forecast-grid');
const themeToggle = document.getElementById('theme-toggle');

function setStatus(msg) {
  status.textContent = msg;
}

function setCard(data) {
  locationEl.textContent = `${data.name}, ${data.sys.country}`;
  timestamp.textContent = new Date(data.dt * 1000).toLocaleString();
  icon.textContent = getWeatherIcon(data.weather[0].icon);
  temp.textContent = `${Math.round(data.main.temp)}°`;
  summary.textContent = data.weather[0].description;
  feels.textContent = `${Math.round(data.main.feels_like)}°`;
  humidity.textContent = `${data.main.humidity}%`;
  wind.textContent = `${data.wind.speed} m/s`;
}

function getWeatherIcon(iconCode) {
  // Simple icon mapping
  const map = {
    '01d': '☀️', '01n': '🌙', '02d': '🌤️', '02n': '☁️',
    '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
  };
  return map[iconCode] || '☁️';
}

function setForecast(list) {
  forecastGrid.innerHTML = '';
  if (!list.length) {
    forecastGrid.innerHTML = '<p class="muted">No forecast found.</p>';
    return;
  }
  list.forEach(day => {
    const d = new Date(day.dt * 1000);
    const html = `<div class="card">
      <div class="card__header">
        <div><p class="eyebrow">${d.toLocaleDateString()}</p></div>
        <div class="icon">${getWeatherIcon(day.weather[0].icon)}</div>
      </div>
      <div class="card__body">
        <div class="temp">${Math.round(day.main.temp)}°</div>
        <div class="summary">${day.weather[0].description}</div>
      </div>
    </div>`;
    forecastGrid.innerHTML += html;
  });
}

async function fetchWeather(city) {
  setStatus('Loading...');
  try {
    const res = await fetch(`${BASE_URL}weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
    if (!res.ok) throw new Error('City not found');
    const data = await res.json();
    setCard(data);
    setStatus('Weather loaded!');
    localStorage.setItem('lastCity', city);
    fetchForecast(city);
  } catch (e) {
    setStatus('City not found.');
  }
}

async function fetchForecast(city) {
  try {
    const res = await fetch(`${BASE_URL}forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
    if (!res.ok) throw new Error('No forecast');
    const data = await res.json();
    // Get midday (12:00:00) for next 5 days
    const days = {};
    data.list.forEach(item => {
      if (item.dt_txt.includes('12:00:00')) {
        const date = item.dt_txt.split(' ')[0];
        days[date] = item;
      }
    });
    setForecast(Object.values(days));
  } catch {
    forecastGrid.innerHTML = '<p class="muted">No forecast found.</p>';
  }
}

function setTheme(mode) {
  document.body.classList.toggle('dark', mode === 'dark');
  themeToggle.innerHTML = mode === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', mode);
}

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark');
  setTheme(isDark ? 'light' : 'dark');
});

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

document.querySelectorAll('[data-city]').forEach(btn => {
  btn.addEventListener('click', () => {
    cityInput.value = btn.dataset.city;
    fetchWeather(btn.dataset.city);
  });
});

window.addEventListener('DOMContentLoaded', () => {
  const last = localStorage.getItem('lastCity');
  if (last) {
    cityInput.value = last;
    fetchWeather(last);
  }
  // Theme preference
  const savedTheme = localStorage.getItem('theme');
  setTheme(savedTheme === 'dark' ? 'dark' : 'light');
});
