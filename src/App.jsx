import { useEffect, useState } from 'react'
import './App.css'
import searchIcon from "./assets/search.png";
import snowIcon from "./assets/snow.png";
import humidityIcon from "./assets/humidity.png";
import windIcon from "./assets/wind.png";
import cloudIcon from "./assets/cloud.png";
import drizzleIcon from "./assets/drizzle.png";
import rainIcon from "./assets/rain.png";
import clearIcon from "./assets/clear.png";

const WeatherDetails = ({ icon, temp, city, country, lat, log, humidity, wind }) => {
  return (
    <>
      <div className='image'>
        <img src={icon} alt='Weather icon'/>
      </div>
      <div className='temp'>{temp}°C</div>
      <div className='location'>{city}</div>
      <div className='country'>{country}</div>
      <div className='cord'>
        <div>
          <span className="lat">latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="log">longitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className='element'>
          <img src={humidityIcon} alt="humidity" />
          <div className='data'>
            <div className='humidity-percent'>{humidity}</div>
            <div className='text'>humidity</div>
          </div>
        </div>
        <div className='element'>
          <img src={windIcon} alt="wind" />
          <div className='data'>
            <div className='wind-percent'>{wind} km/hr</div>
            <div className='text'>wind speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  const api_key = "7c1c0b7dd9f402e48fec1f43cb4b8bde";
  const [text, setText] = useState("tirunelveli");
  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("tirunelveli");
  const [country, setCountry] = useState("india");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,setError] = useState(null);

  const weatherIconmap = {
    "01d":clearIcon,
    "01n":clearIcon,
    "02d":cloudIcon,
    "02n":cloudIcon,
    "03d":drizzleIcon,
    "03n":drizzleIcon,
    "04d":drizzleIcon,
    "04n":drizzleIcon,
    "09d":rainIcon,
    "09n":rainIcon,
    "10d":rainIcon,
    "10n":rainIcon,
    "13d":snowIcon,
    "13n":snowIcon,
    
  };

  const search = async () => {
    setLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;
    
    try {
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.cod === "404") {
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIconcode = data.weather[0].icon;
      setIcon(weatherIconmap[weatherIconcode] || clearIcon);
      setCityNotFound(false);
    } catch (error) {
      console.error("An error occurred:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  useEffect(function(){
    search();
  },[]);

  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input type='text' className='city-input' placeholder='Search city' onChange={handleCity} value={text} onKeyDown={handleKeyDown}/>
        </div>
        <div className='search-icon' onClick={search}>
          <img src={searchIcon} alt='Search'/>
        </div>
       
        {loading && <div className='loading-message'>loading...</div>}
        {error && <div className='error-message'>{error}</div>}
        {cityNotFound && <div className='citynotfound'>city not found</div>}

        {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind}/>}



       
       
        <p className='copyright'>
          Designed by <span>Prabu Kannan</span>
        </p>
      </div>
    </>
  )
}

export default App;