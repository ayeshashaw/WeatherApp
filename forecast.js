const forecastCityNameElement = document.getElementById('forecast-city-name');
const forecastContainer = document.getElementById('forecast-container');
const backButton = document.getElementById('back-button');

const OPENWEATHER_API_KEY = 'ccc78c4153700bbb0f3b386d1ca646e4';

function getCityFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('city');
}

async function fetchForecastData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error('City not found or forecast data unavailable');
        }
        const data = await response.json();
        displayForecastData(data);
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        alert(error.message);
    }
}

function displayForecastData(data) {
    forecastCityNameElement.textContent = data.city.name;
    forecastContainer.innerHTML = '';

    const dailyForecasts = {};
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        if (!dailyForecasts[day]) {
            dailyForecasts[day] = [];
        }
        dailyForecasts[day].push(item);
    });

    for (const day in dailyForecasts) {
        const middayForecast = dailyForecasts[day].find(item => {
            const date = new Date(item.dt * 1000);
            return date.getHours() >= 11 && date.getHours() <= 14;
        }) || dailyForecasts[day][0];

        const forecastCard = document.createElement('div');
        forecastCard.classList.add('forecast-card');
        forecastCard.innerHTML = `
            <h3>${day}</h3>
            <img src="https://openweathermap.org/img/wn/${middayForecast.weather[0].icon}.png" alt="${middayForecast.weather[0].description}">
            <p>Temp: ${middayForecast.main.temp}°C</p>
            <p>${middayForecast.weather[0].description}</p>
        `;
        forecastContainer.appendChild(forecastCard);
    }
}

backButton.addEventListener('click', () => {
    window.location.href = 'index.html';
});

document.addEventListener('DOMContentLoaded', () => {
    const city = getCityFromUrl();
    if (city) {
        fetchForecastData(city);
    } else {
        alert('No city specified for forecast.');
        window.location.href = 'index.html';
    }
});