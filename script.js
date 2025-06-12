const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const cityNameElement = document.getElementById('city-name');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');
const weatherIconElement = document.getElementById('weather-icon');
const forecastButton = document.getElementById('forecast-button');
const mapElement = document.getElementById('map');

const OPENWEATHER_API_KEY = 'ccc78c4153700bbb0f3b386d1ca646e4'; 
const GOOGLE_MAPS_API_KEY = 'AIzaSyDFRRnEzI-BUzqJLUI-VE4BqK-khihcEp8'; 

let map;
let marker;

const debounce = (func, delay) => {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

async function fetchWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        displayWeatherData(data);
        initMap(data.coord.lat, data.coord.lon);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert(error.message);
    }
}

function displayWeatherData(data) {
    cityNameElement.textContent = data.name;
    temperatureElement.textContent = `Temperature: ${data.main.temp}°C`;
    descriptionElement.textContent = `Description: ${data.weather[0].description}`;
    humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeedElement.textContent = `Wind Speed: ${data.wind.speed} m/s`;
    weatherIconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    weatherIconElement.alt = data.weather[0].description;
}

function initMap(lat, lng) {
    if (map) {
        map.setCenter({ lat, lng });
        marker.setPosition({ lat, lng });
    } else {
        map = new google.maps.Map(mapElement, {
            center: { lat, lng },
            zoom: 10,
        });
        marker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: 'City Location',
        });
    }
}

function loadGoogleMapsScript() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMapCallback`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

window.initMapCallback = () => {
    console.log('Google Maps API loaded.');
    fetchWeatherData('kolkata'); 
};

searchButton.addEventListener('click', throttle(() => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    }
}, 1000)); 

cityInput.addEventListener('input', debounce(() => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    }
}, 500)); 

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherData(city);
        }
    }
});

forecastButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        window.location.href = `forecast.html?city=${city}`;
    } else {
        alert('Please enter a city name first.');
    }
});

loadGoogleMapsScript();