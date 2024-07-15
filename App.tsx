import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import Head from "./components/Head";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import Hourly from "./components/Hourly";
import Daily from "./components/Daily";
import { Feather } from "@expo/vector-icons";

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
    console.log(response);
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

  const now = new Date();
  const currentHour = now.getHours();

  return (
    <ScrollView style={styles.body}>
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
        maxTemp={response?.daily.temperature_2m_max[0]}
        minTemp={response?.daily.temperature_2m_min[0]}
      />

      <ScrollView horizontal style={styles.hourlyCon}>
        {response?.hourly.time.map((_, index) =>
          index <= 24 ? (
            <Hourly
              key={index}
              hour={response.hourly.time[index + currentHour]}
              temperature={response.hourly.temperature_2m[index + currentHour]}
              feelTemp={
                response.hourly.apparent_temperature[index + currentHour]
              }
            ></Hourly>
          ) : null
        )}
      </ScrollView>

      <ScrollView horizontal style={styles.dailyCon}>
        {response?.daily.time.map((_, index) => (
          <Daily
            key={index}
            date={response.daily.time[index + 1]}
            tempMax={response.daily.temperature_2m_max[index + 1]}
            tempMin={response.daily.temperature_2m_min[index + 1]}
          ></Daily>
        ))}
      </ScrollView>

      <View style={styles.sunTimes}>
        <View style={styles.sunCon}>
          <Feather name="sunrise" size={84} color="#efb643" />
          <Text style={styles.sunTime}>
            {response?.daily.sunrise[0] != undefined
              ? response?.daily.sunrise[0].split("T")[1]
              : ""}
          </Text>
        </View>

        <View style={styles.sunCon}>
          <Feather name="sunset" size={84} color="#efb643" />
          <Text style={styles.sunTime}>
            {response?.daily.sunset[0] != undefined
              ? response?.daily.sunset[0].split("T")[1]
              : ""}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    minHeight: "100%",
    height: "100%",
    backgroundColor: "#283644",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  },
  hourlyCon: {
    height: 200,
    width: "95%",
    backgroundColor: "#2b3b4a",
    margin: "auto",
    borderRadius: 20,
    display: "flex",
    flexDirection: "row",
    // alignItems: "center",
    paddingLeft: 10,
    marginBottom: 10,
    paddingTop: "5%",
  },
  dailyCon: {
    height: 200,
    width: "95%",
    backgroundColor: "#2b3b4a",
    margin: "auto",
    borderRadius: 20,
    display: "flex",
    flexDirection: "row",
    // alignItems: "center",
    paddingLeft: 10,
    marginBottom: 10,
    paddingTop: "5%",
  },
  sunTimes: {
    height: 200,
    width: "95%",
    backgroundColor: "#2b3b4a",
    margin: "auto",
    borderRadius: 20,
    marginBottom: 10,

    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  sunCon: {
    height: "90%",
    width: "45%",
    // backgroundColor: "red",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  sunTime: {
    color: "white",
    fontSize: 30,
    marginTop: 10,
  },
});
