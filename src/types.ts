export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  sys: {
    country: string;
  };
}

export interface ForecastData {
  dt: number;
  main: {
    temp: number;
  };
  weather: {
    icon: string;
    description: string;
  }[];
}


export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WeatherState {
  current: WeatherData | null;
  forecast: ForecastData[];
  historical: ForecastData[];
}