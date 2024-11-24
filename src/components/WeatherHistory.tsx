import React from 'react';
import { format } from 'date-fns';
import { History } from 'lucide-react';
import type { ForecastData } from '../types';

interface WeatherHistoryProps {
  data: ForecastData[];
}

export function WeatherHistory({ data }: WeatherHistoryProps) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl bg-white/10 p-6 backdrop-blur-md">
        <div className="mb-4 flex items-center gap-2">
          <History className="h-5 w-5 text-white" />
          <h2 className="text-xl font-semibold text-white">Historical Weather</h2>
        </div>
        <p className="text-white/70">No historical data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white/10 p-6 backdrop-blur-md">
      <div className="mb-4 flex items-center gap-2">
        <History className="h-5 w-5 text-white" />
        <h2 className="text-xl font-semibold text-white">Historical Weather</h2>
      </div>

      <div className="grid gap-4">
        {data.map((day) => {
          if (!day || !day.weather?.[0]) return null;
          
          return (
            <div
              key={day.dt}
              className="flex items-center justify-between rounded-lg bg-white/5 p-4 transition-all hover:bg-white/10"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                  alt={day.weather[0].description || 'Weather icon'}
                  className="h-12 w-12"
                />
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
                <p className="text-2xl font-bold text-white">
                  {Math.round(day.main.temp)}°C
                </p>
                <p className="text-sm text-white/70 capitalize">
                  {day.weather[0].description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}