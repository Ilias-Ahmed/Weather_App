const apiKey = "70a546ad786c480fa55121320242509";
const weatherInfo = document.getElementById("weather-info");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const errorMessage = document.getElementById("error-message");

let currentWeatherData = null;

function showLoading() {
  loading.classList.remove("hidden");
  weatherInfo.classList.add("hidden");
  error.classList.add("hidden");
}

function hideLoading() {
  loading.classList.add("hidden");
}

function showError(message) {
  error.classList.remove("hidden");
  weatherInfo.classList.add("hidden");
  errorMessage.textContent = message;
}

document.getElementById("search-btn").addEventListener("click", () => {
  const city = document.getElementById("city-input").value.trim();
  if (city) {
    getWeatherData(city);
  }
});

document.getElementById("city-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = e.target.value.trim();
    if (city) {
      getWeatherData(city);
    }
  }
});

document.getElementById("location-btn").addEventListener("click", () => {
  if (navigator.geolocation) {
    showLoading();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        getWeatherDataByCoords(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (error) => {
        showError(
          "Unable to retrieve your location. Please enter a city manually."
        );
      }
    );
  } else {
    showError(
      "Geolocation is not supported by your browser. Please enter a city manually."
    );
  }
});

document.querySelectorAll(".unit-toggle button").forEach((button) => {
  button.addEventListener("click", (e) => {
    if (currentWeatherData) {
      document
        .querySelectorAll(".unit-toggle button")
        .forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");
      updateTemperatureDisplay();
    }
  });
});

async function getWeatherData(city) {
  showLoading();
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`
    );
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    currentWeatherData = data;
    displayWeatherData(data);
  } catch (error) {
    showError(error.message);
  }
}

async function getWeatherDataByCoords(lat, lon) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=yes`
    );
    if (!response.ok) throw new Error("Unable to fetch weather data");
    const data = await response.json();
    currentWeatherData = data;
    displayWeatherData(data);
  } catch (error) {
    showError(error.message);
  }
}

function updateTemperatureDisplay() {
  const tempElement = document.getElementById("temperature");
  const isCelsius = document
    .getElementById("celsius")
    .classList.contains("active");
  const temp = isCelsius
    ? `${currentWeatherData.current.temp_c}°C`
    : `${currentWeatherData.current.temp_f}°F`;
  tempElement.textContent = temp;
}

function displayWeatherData(data) {
  hideLoading();
  weatherInfo.classList.remove("hidden");

  document.getElementById(
    "location-name"
  ).textContent = `${data.location.name}, ${data.location.country}`;
  document.getElementById("condition").textContent =
    data.current.condition.text;
  document.getElementById("humidity").textContent = `${data.current.humidity}%`;
  document.getElementById("wind").textContent = `${data.current.wind_kph} km/h`;
  document.getElementById(
    "condition-icon"
  ).src = `https:${data.current.condition.icon}`;

  updateTemperatureDisplay();
}
