import React, { useState, useEffect } from 'react';
import rainy from './assets/rainy.jpg';
import sunny from './assets/sunny.jpg';
import cloudy from './assets/cloudy.jpg';
import snowy from './assets/snowy.jpg';
import thunder from './assets/thunder.jpg';
import clearsky from './assets/clearsky.jpg';
import misty from './assets/misty.jpg';
import smokey from './assets/smokey.jpg';
import './App.css';

const api = {
  base: 'http://api.openweathermap.org/data/2.5/',
  key: 'API_KEY', // Replace with your OpenWeatherMap API key
};

const WeatherDisplay = ({ weather, currentDateTime }) => (
  <div className="weather">
    <h2>{weather.name}</h2>
    <p>{currentDateTime}</p>
    <img
      src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
      alt={weather.weather[0].description}
    />
    <p>{weather.weather[0].description}</p>
    <p>Temperature: {weather.main.temp}°C</p>
    <p>Humidity: {weather.main.humidity}%</p>
    <p>Wind Speed: {weather.wind.speed} m/s</p>
  </div>
);

function App() {
  const [search, setSearch] = useState('');
  const [weather, setWeather] = useState({});
  const [error, setError] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    if (Object.keys(weather).length > 0) {
      getCurrentDateTime(weather.timezone);
    }
  }, [weather]);

  // Using async fetch instead of axios for API call
  const fetchWeather = async () => {
    const url = `${api.base}weather?q=${search}&units=metric&appid=${api.key}`;
    const response = await fetch(url);
    const result = await response.json();
    if (result.cod === 200) {
      setWeather(result);
      setError(false);
    } else {
      setWeather({});
      setError(true);
      setCurrentDateTime('');
    }
  };

  const getCurrentDateTime = (timezoneOffset) => {
    const date = new Date();
    const localTime = new Date(date.getTime() + timezoneOffset * 1000);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    setCurrentDateTime(localTime.toLocaleString('en-US', options));
  };

  const getBackgroundImage = () => {
    if (!weather.weather) return '';
    const weatherType = weather.weather[0].main.toLowerCase();

    switch (weatherType) {
      case 'rain':
        return `url(${rainy})`;
      case 'sun':
        return `url(${sunny})`;
      case 'clouds':
        return `url(${cloudy})`;
      case 'snow':
        return `url(${snowy})`;
      case 'thunderstorm':
        return `url(${thunder})`;
      case 'mist':
        return `url(${misty})`;
      case 'smoke':
        return `url(${smokey})`;
      default:
        return `url(${clearsky})`;
    }
  };

  return (
    <div
      className="App"
      style={{
        backgroundImage: getBackgroundImage(),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="Enter city name"
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={fetchWeather}>Search</button>
      {error && <div className="error">City not found</div>}
      {Object.keys(weather).length > 0 && (
        <WeatherDisplay weather={weather} currentDateTime={currentDateTime} />
      )}
    </div>
  );
}

export default App;

