import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Head from "./components/Head";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";

interface City {
  name: string;
  latitude: number;
  longitude: number;
}

interface WeatherResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    rain: number;
    weather_code: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    precipitation: number[];
    rain: number[];
  };
  daily: {
    time: string[];
    sunrise: string[];
    sunset: string[];
    temperature_2m_max: string[];
    temperature_2m_min: string[];
  };
  current_units: {
    time: string;
    interval: string;
    temperature_2m: string;
    apparent_temperature: string;
    is_day: string;
    precipitation: string;
    rain: string;
    weather_code: string;
  };
  hourly_units: {
    time: string;
    temperature_2m: string;
    apparent_temperature: string;
    precipitation: string;
    rain: string;
  };
}

export default function App() {
  const [currentCity, setCity] = useState<City>({
    name: "Frankfurt am Main",
    latitude: 50.1155,
    longitude: 8.6842,
  });

  const [response, setResponse] = useState<WeatherResponse | null>(null);

  function getCity(name: string, latitude: number, longitude: number) {
    setCity({ name, latitude, longitude });
  }

  useEffect(() => {
    function getWeather() {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const formattedTimeZone = encodeURIComponent(timezone);

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${currentCity.latitude}&longitude=${currentCity.longitude}&current=temperature_2m,apparent_temperature,is_day,precipitation,rain,weather_code&hourly=temperature_2m,apparent_temperature,precipitation,rain&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=${formattedTimeZone}&models=icon_seamless`;

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => setResponse(data))
        .catch((error) => console.error("Error:", error));
    }

    getWeather();
  }, [currentCity]);

  return (
    <View style={styles.body}>
      <StatusBar style="light" />
      <LinearGradient
        // Background Linear Gradient
        colors={["#283644", "#111928"]}
        style={styles.body}
      />
      <Head
        time={response?.current?.time}
        city={currentCity.name}
        temp={response?.current.temperature_2m}
        feeltemp={response?.current.apparent_temperature}
        setCity={getCity}
      ></Head>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    minHeight: "100%",
    backgroundColor: "#283644",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  },
});
