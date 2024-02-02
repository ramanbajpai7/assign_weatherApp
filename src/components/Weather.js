import React, { useState } from "react";
import DisplayWeather from "./DisplayWeather";
import "./weather.css";

function Weather() {
  const [weather, setWeather] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [form, setForm] = useState({
    city: "",
    country: "",
  });
  const [unit, setUnit] = useState("metric"); // Default unit is Celsius

  const APIKEY = "dc093b4cf13626abfe46ae8fe413b36c";

  async function weatherData(e) {
    e.preventDefault();
    if (form.city === "") {
      alert("Add values");
    } else {
      const [currentData, forecastData] = await Promise.all([
        fetchWeatherData(form.city, form.country),
        fetchForecastData(form.city, form.country),
      ]);

      setWeather({ data: currentData });
      setForecast(forecastData);
    }
  }

  const fetchWeatherData = async (city, country) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=${unit}&APPID=${APIKEY}`
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to fetch current weather data");
      return null;
    }
  };

  const fetchForecastData = async (city, country) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&units=${unit}&APPID=${APIKEY}`
    );

    if (response.ok) {
      const data = await response.json();
      
      // Filter forecast data for unique dates
      const uniqueDates = new Set();
      const filteredForecast = data.list.filter((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!uniqueDates.has(date)) {
          uniqueDates.add(date);
          return true;
        }
        return false;
      });

      return filteredForecast;
    } else {
      console.error("Failed to fetch forecast data");
      return [];
    }
  };

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "city") {
      setForm({ ...form, city: value });
    }
    if (name === "country") {
      setForm({ ...form, country: value });
    }
  };

  const handleUnitToggle = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
  };

  return (
    <div className="weather">
      <span className="title">Weather App</span>
      <br />
      <form>
        <input
          type="text"
          placeholder="City"
          name="city"
          onChange={(e) => handleChange(e)}
        />
        &nbsp; &nbsp; &nbsp;&nbsp;
      
        <button className="getweather" onClick={(e) => weatherData(e)}>
          Submit
        </button>
      </form>

      <div className="unit-toggle">
        <p>Temperature Unit:</p>
        <button type="button"  className="getweather" onClick={handleUnitToggle}>
          {unit === "metric" ? "Switch to Fahrenheit" : "Switch to Celsius"}
        </button>
      </div>

      {weather.data !== undefined ? (
        <div>
          <DisplayWeather data={weather.data} unit={unit} />
        </div>
      ) : null}

      {forecast.length > 0 && (
        <div>
          <h2>5-Day Forecast</h2>
          {forecast.map((item) => (
            <div key={item.dt}>
              <p>Date: {new Date(item.dt * 1000).toLocaleDateString()}</p>
              <p>Avg Temperature: {item.main.temp}&deg;{unit === "metric" ? "C" : "F"}</p>
              <p>Description: {item.weather[0].description}</p>
              <img
                src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                alt="Weather Icon"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Weather;
