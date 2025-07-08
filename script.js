const API_KEY = 'd659a430e8836bc831b5abbd80b4a5d1'; // Your OpenWeather API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('cityInput');
const searchbtn = document.getElementById('searchbtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');

const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weatherDescription');
const feelslike = document.getElementById('feelslike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');

searchbtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

document.getElementById('testDataBtn').addEventListener('click', () => {
    hideAllSection();
    testWithSampleData();
});

function handleSearch() {
    const city = cityInput.value.trim();
    if (!city) {
        showError('Please enter a City Name');
        return;
    }
    hideAllSection();
    showLoading();
    fetchWeatherData(city);
    clearInput();
}

async function fetchWeatherData(city) {
    try {
        const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) throw new Error('City not found!!! Please check spelling...');
            if (response.status === 401) throw new Error('Invalid API key');
            throw new Error('Failed to fetch data...');
        }

        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        hideLoading();
        if (city.toLowerCase() === 'london') {
            testWithSampleData(); // fallback for demo
        } else {
            showError(error.message);
        }
    }
}

function displayWeatherData(data) {
    hideLoading();
    const cityNameText = `${data.name}, ${data.sys.country}`;
    const temp = `${Math.round(data.main.temp)}°C`;
    const description = data.weather[0].description;
    const feelsLikeTemp = `${Math.round(data.main.feels_like)}°C`;
    const humidityValue = `${data.main.humidity}%`;
    const windSpeedValue = `${Math.round(data.wind.speed * 3.6)} km/h`; // m/s to km/h

    cityName.textContent = cityNameText;
    temperature.textContent = temp;
    weatherDescription.textContent = description;
    feelslike.textContent = feelsLikeTemp;
    humidity.textContent = humidityValue;
    windSpeed.textContent = windSpeedValue;

    showWeatherData();
}

function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    error.classList.remove('hidden');
}

function hideError() {
    error.classList.add('hidden');
}

function showWeatherData() {
    weatherDisplay.classList.remove('hidden');
}

function hideAllSection() {
    hideLoading();
    hideError();
    weatherDisplay.classList.add('hidden');
}

function clearInput() {
    cityInput.value = '';
}

function testWithSampleData() {
    const sampleData = {
        name: 'London',
        sys: { country: 'GB' },
        main: {
            temp: 15.5,
            feels_like: 13.2,
            humidity: 78,
        },
        weather: [{ description: 'Partially cloudy' }],
        wind: {
            speed: 3.5, // m/s
        },
    };
    displayWeatherData(sampleData);
}
