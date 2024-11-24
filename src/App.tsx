import { useEffect, useState } from 'react';
import { Loader2, Cloud } from 'lucide-react';
import { WeatherCard } from './components/WeatherCard';
import { SearchBar } from './components/SearchBar';
import { ErrorMessage } from './components/ErrorMessage';
import { WeatherForecast } from './components/WeatherForecast';
import { WeatherHistory } from './components/WeatherHistory';
import type { WeatherState, Coordinates } from './types';

const API_KEY = 'ENTER_YOUR_API_KEY';
const API_BASE = 'https://api.openweathermap.org/data/2.5';

function App() {
  const [weatherState, setWeatherState] = useState<WeatherState>({
    current: null,
    forecast: [],
    historical: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (endpoint: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Current weather
      const currentResponse = await fetch(`${endpoint}&appid=${API_KEY}&units=metric`);
      if (!currentResponse.ok) {
        throw new Error(currentResponse.status === 404 ? 'City not found.' : 'Unable to fetch weather data.');
      }
      const currentData = await currentResponse.json();

      // Forecast data (next 7 days)
      const forecastResponse = await fetch(
        `${API_BASE}/forecast?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastResponse.json();

      // Historical data (previous 7 days)
      const historicalData = [];
      const now = Math.floor(Date.now() / 1000);
      
      try {
        for (let i = 1; i <= 7; i++) {
          const timestamp = now - (i * 24 * 60 * 60);
          const historicalResponse = await fetch(
            `${API_BASE}/onecall/timemachine?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&dt=${timestamp}&appid=${API_KEY}&units=metric`
          );
          if (historicalResponse.ok) {
            const data = await historicalResponse.json();
            if (data?.current) {
              historicalData.push(data.current);
            }
          }
        }
      } catch (historyError) {
        console.warn('Failed to fetch historical data:', historyError);
      }

      setWeatherState({
        current: currentData,
        forecast: forecastData.list.filter((_: any, index: number) => index % 8 === 0).slice(0, 7),
        historical: historicalData
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (city: string) => {
    if (!city.trim()) {
      setError('Please enter a valid city name.');
      return;
    }
    fetchWeatherData(`${API_BASE}/weather?q=${encodeURIComponent(city)}`);
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: Coordinates = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        fetchWeatherData(`${API_BASE}/weather?lat=${coords.lat}&lon=${coords.lon}`);
      },
      () => {
        setError('Unable to retrieve your location. Defaulting to London.');
        handleSearch('London');
      }
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const getBackgroundImage = () => {
    if (!weatherState.current) return 'weather';
    const condition = weatherState.current.weather[0].main.toLowerCase();
    const timeOfDay = new Date().getHours() >= 6 && new Date().getHours() < 18 ? 'day' : 'night';
    return `${condition},${timeOfDay},sky`;
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 transition-all duration-700"
      style={{
        backgroundImage: `linear-gradient(to bottom right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4)), url(https://source.unsplash.com/1920x1080/?${getBackgroundImage()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-3 text-white">
            <Cloud className="h-10 w-10" />
            <h1 className="text-4xl font-bold">Weather Forecast</h1>
          </div>

          <SearchBar onSearch={handleSearch} />

          {error && <ErrorMessage message={error} />}

          {loading ? (
            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-6 py-4 text-white backdrop-blur-md">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="text-lg">Loading weather data...</p>
            </div>
          ) : weatherState.current ? (
            <div className="grid w-full gap-8">
              <WeatherCard data={weatherState.current} />
              
              <div className="grid gap-8 lg:grid-cols-2">
                <WeatherForecast data={weatherState.forecast} />
                <WeatherHistory data={weatherState.historical} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
