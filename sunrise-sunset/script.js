const latInput = document.getElementById("latInput");
const lngInput = document.getElementById("lngInput");
const fetchBtn = document.getElementById("fetchBtn");

const locationInfo = document.getElementById("locationInfo");
const sunriseEl = document.getElementById("sunrise");
const sunsetEl = document.getElementById("sunset");
const solarNoonEl = document.getElementById("solarNoon");
const dayLengthEl = document.getElementById("dayLength");

const civilBeginEl = document.getElementById("civilBegin");
const civilEndEl = document.getElementById("civilEnd");
const nauticalBeginEl = document.getElementById("nauticalBegin");
const nauticalEndEl = document.getElementById("nauticalEnd");

const cycleFill = document.getElementById("cycleFill");
const sunIcon = document.getElementById("sunIcon");
const currentStatus = document.getElementById("currentStatus");
const labelSunrise = document.getElementById("labelSunrise");
const labelSunset = document.getElementById("labelSunset");

const themeToggle = document.getElementById('themeToggle');

const BASE_URL = "https://api.sunrise-sunset.org/json";

// Convert time from API (UTC) to local time string
function formatTime(utcString) {
  const date = new Date(utcString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Convert "HH:MM:SS" to seconds
function timeToSeconds(hms) {
  const [h, m, s] = hms.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

// Update visualization bar
function updateCycle(sunriseUTC, sunsetUTC) {
  const now = new Date();

  const sunrise = new Date(sunriseUTC);
  const sunset = new Date(sunsetUTC);

  labelSunrise.textContent = `Sunrise: ${sunrise.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  labelSunset.textContent = `Sunset: ${sunset.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

  if (now < sunrise) {
    cycleFill.style.width = "0%";
    sunIcon.style.left = "0%";
    currentStatus.textContent = "🌙 It is currently NIGHT (before sunrise).";
    return;
  }

  if (now > sunset) {
    cycleFill.style.width = "100%";
    sunIcon.style.left = "100%";
    currentStatus.textContent = "🌙 It is currently NIGHT (after sunset).";
    return;
  }

  const total = sunset - sunrise;
  const passed = now - sunrise;
  const percent = Math.min(100, Math.max(0, (passed / total) * 100));

  cycleFill.style.width = percent + "%";
  sunIcon.style.left = percent + "%";
  currentStatus.textContent = "☀️ It is currently DAYTIME.";
}

// Fetch API data
async function fetchSunTimes(lat, lng) {
  const url = `${BASE_URL}?lat=${lat}&lng=${lng}&formatted=0`;

  try {
    locationInfo.textContent = "Loading data...";

    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP Error " + res.status);

    const data = await res.json();
    if (data.status !== "OK") throw new Error("API returned error");

    const r = data.results;

    // Display times
    sunriseEl.textContent = formatTime(r.sunrise);
    sunsetEl.textContent = formatTime(r.sunset);
    solarNoonEl.textContent = formatTime(r.solar_noon);
    dayLengthEl.textContent = r.day_length;

    civilBeginEl.textContent = formatTime(r.civil_twilight_begin);
    civilEndEl.textContent = formatTime(r.civil_twilight_end);
    nauticalBeginEl.textContent = formatTime(r.nautical_twilight_begin);
    nauticalEndEl.textContent = formatTime(r.nautical_twilight_end);

    // Visualization
    updateCycle(r.sunrise, r.sunset);

    locationInfo.textContent = `Showing times for Latitude ${lat}, Longitude ${lng}`;

  } catch (err) {
    console.error(err);
    locationInfo.textContent = "❌ Failed to load sunrise/sunset data.";
  }
}

// Dark mode logic
function setDarkMode(isDark) {
  document.body.classList.toggle('dark', isDark);
  document.querySelectorAll('header, .card, .controls, .result-box, .cycle-bar, .cycle-fill, .cycle-labels, .status').forEach(el => {
    if (el) el.classList.toggle('dark', isDark);
  });
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('sunriseTheme', isDark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => {
  setDarkMode(!document.body.classList.contains('dark'));
});

window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('sunriseTheme');
  setDarkMode(saved === 'dark');
});

// Button event
fetchBtn.addEventListener("click", () => {
  const lat = latInput.value;
  const lng = lngInput.value;

  if (!lat || !lng) {
    alert("Please enter valid latitude and longitude.");
    return;
  }

  fetchSunTimes(lat, lng);
});

// Auto load default location
fetchSunTimes(latInput.value, lngInput.value);

// Update cycle every minute
setInterval(() => {
  fetchSunTimes(latInput.value, lngInput.value);
}, 60000);
