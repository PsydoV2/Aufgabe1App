import { View, Text, StyleSheet } from "react-native";

interface HourlyProps {
  hour: string;
  temperature: number | undefined;
  feelTemp: number | undefined;
}

export default function Hourly(props: HourlyProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.time}>
        {props.hour != undefined ? props.hour.split("T")[1] : ""}
      </Text>
      <Text style={styles.temp}>{props.temperature}°C</Text>
      <Text style={styles.feelTemp}>{props.feelTemp}°C</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "90%",
    width: 100,
    backgroundColor: "#111928",
    borderRadius: 20,

    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginRight: 10,
  },
  time: {
    color: "#efb643",
    fontSize: 18,
  },
  temp: {
    color: "white",
    fontSize: 25,
  },
  feelTemp: {
    color: "gray",
    fontSize: 15,
    marginTop: -20,
  },
});
