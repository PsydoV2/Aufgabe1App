import { View, Text, StyleSheet } from "react-native";

interface DailyProps {
  date: string;
  tempMax: string | undefined;
  tempMin: string | undefined;
}

export default function Daily(props: DailyProps) {
  function formatDate(dateString: string): string {
    // Split the input date string
    const [year, month, day] = dateString.split("-");

    // Format the date as "dd,mm.yy"
    const formattedDate = `${day}.${month}.${year.slice(-2)}`;

    return formattedDate;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.time}>
        {props.date != undefined ? formatDate(props.date) : ""}
      </Text>
      <Text style={styles.temp}>{props.tempMax}°C</Text>
      <Text style={styles.feelTemp}>{props.tempMin}°C</Text>
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
