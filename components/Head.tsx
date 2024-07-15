import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";

interface HeadProps {
  city: string;
  time: string | undefined;
  temp: number | undefined;
  feeltemp: number | undefined;
  setCity: (city: string, lat: number, long: number) => void;
}

interface City {
  id: number;
  name: string;
  admin1: string;
  country: string;
  latitude: number;
  longitude: number;
}

export default function Head(props: HeadProps) {
  const [pageVisible, togglePageVisible] = useState(false);
  const [citys, setCitys] = useState<City[]>([]);

  function getCitys(cityName: string) {
    fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=10&language=de&format=json`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setCitys(data.results || []))
      .catch((error) => console.error("Error:", error));
  }

  function setCity(city: string, lat: number, long: number) {
    props.setCity(city, lat, long);
    togglePageVisible(false);
  }

  return (
    <>
      <View>
        <View style={styles.headTopBar}>
          <Text
            style={styles.cityName}
            onPress={() => togglePageVisible(!pageVisible)}
          >
            {props.city}
          </Text>
          <Text style={styles.time}>
            {props.time != undefined ? props.time.split("T")[1] : ""}
          </Text>
        </View>
        <View style={styles.headMain}>
          <Text style={styles.realTemp}>{props.temp}°C</Text>
          <Text style={styles.feelTemp}>{props.feeltemp}°C</Text>
        </View>
      </View>

      {pageVisible && (
        <View style={styles.changeCityPage}>
          <Text
            style={styles.changePageCloseButton}
            onPress={() => togglePageVisible(false)}
          >
            X
          </Text>
          <TextInput
            style={styles.cityInput}
            placeholder="Enter City"
            onChangeText={(e) => getCitys(e)}
          />
          <ScrollView style={styles.cityList}>
            {citys.map((city) => (
              <TouchableOpacity
                key={city.id}
                style={styles.cityOption}
                onPress={() =>
                  setCity(city.name, city.latitude, city.longitude)
                }
              >
                <Text style={styles.cityNameOption}>{city.name}</Text>
                <Text style={styles.cityDetails}>
                  {city.admin1}, {city.country}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  headTopBar: {
    marginTop: 30,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    color: "white",
  },
  cityName: {
    fontSize: 20,
    fontWeight: "900",
    color: "white",
  },
  time: {
    color: "white",
    marginTop: 6,
  },
  headMain: {
    height: 300,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  realTemp: {
    fontSize: 50,
    fontWeight: "900",
  },
  feelTemp: {
    fontSize: 30,
    marginTop: -10,
  },
  changeCityPage: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#111928",
    paddingTop: 50,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  changePageCloseButton: {
    color: "#efb643",
    fontSize: 20,
    fontWeight: "900",
    position: "absolute",
    right: 25,
    top: 55,
  },
  cityInput: {
    backgroundColor: "#efb643",
    height: 40,
    width: 300,
    borderRadius: 10,
    padding: 5,
    color: "black",
    marginBottom: 10,
  },
  cityList: {
    width: "100%",
  },
  cityOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#efb643",
  },
  cityNameOption: {
    color: "white",
    fontSize: 18,
  },
  cityDetails: {
    color: "white",
    fontSize: 14,
  },
});
