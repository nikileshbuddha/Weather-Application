import { useEffect, useState } from 'react';
import { Cloud, Droplets, Thermometer, Wind, MapPin, Clock } from 'lucide-react';
import type { WeatherData } from '../types';

interface WeatherCardProps {
  data: WeatherData;
}

export function WeatherCard({ data }: WeatherCardProps) {
  // Function to get the current time in IST
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Kolkata', // Ensure the time is in IST
      hour12: true,
    });
  };

  // State to store the current IST time
  const [currentTime, setCurrentTime] = useState(getCurrentTime);

  // Effect to update the time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const getWeatherTheme = (condition: string) => {
    const themes = {
      Clear: {
        gradient: 'from-amber-400/80 via-orange-300/80 to-yellow-300/80',
        animation: 'animate-float',
        icon: '☀️',
      },
      Clouds: {
        gradient: 'from-slate-400/80 via-gray-300/80 to-zinc-400/80',
        animation: 'animate-pulse',
        icon: '☁️',
      },
      Rain: {
        gradient: 'from-blue-600/80 via-indigo-400/80 to-blue-700/80',
        animation: 'animate-pulse',
        icon: '🌧️',
      },
      Snow: {
        gradient: 'from-blue-100/80 via-slate-200/80 to-gray-100/80',
        animation: 'animate-float',
        icon: '❄️',
      },
      Thunderstorm: {
        gradient: 'from-purple-900/80 via-slate-800/80 to-gray-900/80',
        animation: 'animate-pulse',
        icon: '⚡',
      },
      Drizzle: {
        gradient: 'from-blue-400/80 via-cyan-300/80 to-blue-500/80',
        animation: 'animate-pulse',
        icon: '🌦️',
      },
      Mist: {
        gradient: 'from-gray-400/80 via-slate-300/80 to-gray-500/80',
        animation: 'animate-pulse',
        icon: '🌫️',
      },
    };
    return themes[condition as keyof typeof themes] || themes.Clear;
  };

  const theme = getWeatherTheme(data.weather[0].main);

  return (
    <div className={`glass-effect w-full overflow-hidden rounded-xl bg-gradient-to-br ${theme.gradient} p-8 text-muted shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl`}>
      {/* Header Section */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-white/30 p-2 backdrop-blur-sm">
            <MapPin className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">{data.name}</h2>
            <p className="text-lg opacity-85">{data.sys.country}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
          <Clock className="h-6 w-6" />
          <p className="text-lg font-medium">{currentTime}</p>
        </div>
      </div>

      {/* Main Weather Display */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-8">
        <div className="text-center">
          <div className={`${theme.animation} inline-block`}>
            <img 
              src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
              alt={data.weather[0].description}
              className="h-40 w-40 drop-shadow-xl"
            />
          </div>
          <p className="mt-2 text-xl font-medium capitalize">{data.weather[0].description}</p>
        </div>
        <div className="text-right">
          <h1 className="text-8xl font-bold tracking-tighter">{Math.round(data.main.temp)}°</h1>
          <p className="mt-2 text-xl">Feels like {Math.round(data.main.feels_like)}°</p>
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-1 gap-6 rounded-lg bg-white/10 p-6 backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Thermometer, label: 'Temperature', value: `${Math.round(data.main.temp)}°C` },
          { icon: Wind, label: 'Wind Speed', value: `${Math.round(data.wind.speed)} m/s` },
          { icon: Droplets, label: 'Humidity', value: `${data.main.humidity}%` },
          { icon: Cloud, label: 'Pressure', value: `${data.main.pressure} hPa` },
        ].map((item, index) => (
          <div key={index} className="group flex items-center gap-3 transition-all duration-300 hover:scale-105">
            <div className="rounded-full bg-white/20 p-3 transition-all duration-300 group-hover:bg-white/30">
              <item.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm opacity-85">{item.label}</p>
              <p className="text-xl font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
