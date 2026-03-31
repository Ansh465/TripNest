'use server';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
    temp: number;
    description: string;
    icon: string;
    date: string;
}

export async function getForecast(lat: number, lon: number): Promise<WeatherData[] | { error: string }> {
    if (!API_KEY) {
        return { error: 'Weather API key not configured' };
    }

    try {
        const res = await fetch(
            `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        if (!res.ok) {
            throw new Error('Failed to fetch weather');
        }

        const data = await res.json();
        
        // OpenWeatherMap 5-day forecast returns data every 3 hours. 
        // We'll pick one per day (around noon).
        const dailyForecasts = data.list.filter((f: any) => f.dt_txt.includes('12:00:00')).map((f: any) => ({
            temp: Math.round(f.main.temp),
            description: f.weather[0].description,
            icon: f.weather[0].icon,
            date: f.dt_txt.split(' ')[0]
        }));

        return dailyForecasts;
    } catch (err) {
        console.error('Weather Error:', err);
        return { error: 'Could not load weather forecast' };
    }
}
