import { useEffect, useState } from 'react'
import './App.css'
import clearIcon from './assets/clear.png'
import cloudIcon from './assets/cloud.png'
import drizzleIcon from './assets/drizzle.jpg'
import humidityIcon from './assets/humidity.png'
import rainIcon from './assets/rain.png'
import searchIcon from './assets/search.png'
import snowIcon from './assets/snow.jpg'
import windIcon from './assets/wind.png' 

const WeatherDetails=({icon, temp, city, country, lat, log, humidity, wind}) =>
  {
    return(
      <>
      <div className='image'>
          <img src={icon} alt="image" />
      </div>
      <div className='temp' >{temp}°C</div>
      <div className='location'>{city}</div>
      <div className='country'>{country}</div>
      <div className='cords'>
          <div>
            <span className='lat'>Latitude</span>
            <span>{lat}</span>
          </div>
          <div>
            <span className='log'>Longitude</span>
            <span>{log}</span>
          </div> 
      </div>
      <div className='data-container'>
        <div className='element'>
          <img src={humidityIcon} alt="humidity" className='humidity'/>
          <div className='data'>
            <div className='humidity-percentage'>{humidity}%</div>
            <div className='text'>Humidity</div>
          </div>
        </div>
        <div className='element'>
          <img src={windIcon} alt="wind" className='wind'/>
          <div className='data'>
            <div className='wind-speed'>{wind} km/h</div>
            <div className='text'>Wind Speed</div>
          </div>
        </div>
      </div>
      </>
    )
  } 
function App() {
  const api_key = "55399ed04b894ec4b43460fbc4dba802";
  const [text,setText] = useState("Madurai");

  const [icon,setIcon] = useState(snowIcon);
  const [temp,setTemp] = useState(0);
  const [city,setCity] = useState("");
  const [country,setCountry] = useState("");
  const [lat,setLat] = useState(0);
  const [log,setLog] = useState(0);
  const [wind,setWind] = useState(0);
  const [humid,setHumid] = useState(0);
  const [error,setError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [cityNotFound, setCityNotFound] = useState(false);


  const weatherIconMap =
  {
    "01d" : clearIcon,
    "01n" : clearIcon,
    "02d" : cloudIcon,
    "02n" : cloudIcon,
    "03d" : drizzleIcon,
    "03n" : drizzleIcon,
    "04d" : drizzleIcon,
    "04n" : drizzleIcon,
    "09d" : rainIcon,
    "09n" : rainIcon,
    "10d" : rainIcon,
    "10n" : rainIcon,
    "13d" : snowIcon,
    "13n" : snowIcon,
  };

  const search = async() => 
  {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try
    {
      let res = await fetch(url);
      let data = await res.json();
      // console.log(data)
      if(data.cod === "404")
      {
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setCityNotFound(false);
      setTemp(Math.floor(data.main.temp));
      setHumid(data.main.humidity);
      setWind(data.wind.speed);
      setCity(data.name);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      setCountry(data.sys.country);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode]|| clearIcon);
    }catch(error)
    {
      console.log("An error occured" + error.message);
      setError(true);
    }
    finally
    {
      setLoading(false);
    }
  }

  const handleCity = (e) =>
  {
    setText(e.target.value);
  }

  const onKeyDown = (e) =>
  {
    if(e.key === 'Enter')
    {
      search();
    }
  }
  useEffect(function()
  {
    search();
  },[])
  return (
    <>
      <div className='container'>
          <div className='input-container'>
            <input type="text" className='cityInput' placeholder='Enter Search City' value = {text} onChange={handleCity} onKeyDown={onKeyDown}/>
            <img src={searchIcon} alt="search" className='search' onClick={() => search()}/>
          </div>
          {loading && <div className='loading'>Loading...</div>}
          {error && <div className='error'>{error}</div>}
          {cityNotFound && <div className='city-not-found'>City not found</div>}
          {!loading && !cityNotFound &&   <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humid} wind={wind}/>}
      </div>
      <p className='my'>Designed By <a href='https://creative-hummingbird-952260.netlify.app/' target='_blank'> G S Shunmugha krishnan</a></p>
    </>
  )
}

export default App
