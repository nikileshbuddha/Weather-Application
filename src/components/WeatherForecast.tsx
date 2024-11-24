import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import type { ForecastData } from '../types';

interface WeatherForecastProps {
  data: ForecastData[];
}

export function WeatherForecast({ data }: WeatherForecastProps) {
  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-white" />
        <h2 className="text-xl font-semibold text-white">7-Day Forecast</h2>
      </div>
      
      <div className="grid gap-4">
        {data.map((day, index) => (
          <div
            key={day.dt}
            className="group flex items-center justify-between rounded-lg bg-white/5 p-4 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02]"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="group-hover:animate-float">
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                  alt={day.weather[0].description}
                  className="h-12 w-12 transition-all duration-300 group-hover:scale-110"
                />
              </div>
              <div>
                <p className="text-lg font-medium text-white">
                  {format(new Date(day.dt * 1000), 'EEEE')}
                </p>
                <p className="text-sm text-white/70">
                  {format(new Date(day.dt * 1000), 'MMM d')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white transition-all duration-300 group-hover:scale-110">
                {Math.round(day.main.temp)}°C
              </p>
              <p className="text-sm text-white/70 capitalize">
                {day.weather[0].description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}