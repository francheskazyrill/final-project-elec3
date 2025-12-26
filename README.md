# Final Project ELEC3

## Project Type
Solo project

## Description
This project is a collection of interactive web applications built by a solo student. It includes a Calculator, Stopwatch, Weather App, and Sunrise–Sunset Tracker. Each app demonstrates modern UI design, API integration, and responsive features for practical use.

## Project Overview
- Calculator: Perform basic arithmetic with a tactile, keyboard-friendly interface.
- Stopwatch: Track time with millisecond precision and smooth controls.
- Weather App: Get live weather and 5-day forecasts using the OpenWeather API.
- Sunrise–Sunset Tracker: Visualize sunrise, sunset, and twilight times for any location.

## Main Features
- Modern, responsive UI for all apps
- Dark mode and light mode toggle
- Weather data and forecasts via API
- Sunrise/sunset visualization
- Keyboard support for calculator and stopwatch

## APIs Used
### OpenWeather API
- **Base URL:** `https://api.openweathermap.org/data/2.5/`
- **Endpoints:**
  - `/weather` (current weather)
  - `/forecast` (5-day forecast)
- **Parameters:**
  - `q` (city name)
  - `appid` (API key)
  - `units` (metric)
- **Authentication:** API key required (used in `script.js`)

### Sunrise-Sunset API
- **Base URL:** `https://api.sunrise-sunset.org/json`
- **Endpoints:**
  - `/json` (sunrise/sunset times)
- **Parameters:**
  - `lat` (latitude)
  - `lng` (longitude)
  - `date` (optional)
- **Authentication:** None required

## Technologies Used
- HTML
- CSS
- JavaScript

## How to Run the Project
### 1. Clone or Download
```
git clone https://github.com/francheskazyrill/final-project-elec3.git
```
Or download the ZIP and extract it.

### 2. Run Locally
- Open the project folder in VS Code or your editor.
- Use a local server (recommended for API features):
  - With VS Code: Install and run **Live Server** extension.
  - Or use Python:
    ```
    python -m http.server
    ```
  - Or use Node.js:
    ```
    npx http-server
    ```
- Open the desired app's `index.html` in your browser.

## Credits & API Attribution
- OpenWeather API: https://openweathermap.org/api
- Sunrise-Sunset API: https://sunrise-sunset.org/api

---
