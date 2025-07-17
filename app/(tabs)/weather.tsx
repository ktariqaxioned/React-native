import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useWeather } from "@/hooks/useWeather";
import * as Location from "expo-location";
import { Cloudy, RefreshCcw } from "lucide-react-native";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

const getHeaderBackgroundColor = (
  temp: number
): { light: string; dark: string } => {
  if (temp >= 30) return { light: "#FFD1B3", dark: "#803300" }; // Hot
  if (temp >= 20) return { light: "#FFE8B3", dark: "#664d00" }; // Warm
  if (temp >= 10) return { light: "#D0EFFF", dark: "#1a4d80" }; // Cool
  return { light: "#B3D1FF", dark: "#003366" }; // Cold
};

export default function TabTwoScreen() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const { data, isLoading, error, refetch } = useWeather(
    coords?.lat ?? 0,
    coords?.lon ?? 0
  );

  const theme = useColorScheme();

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return alert("Permission denied");
    }
    const loc = await Location.getCurrentPositionAsync({});
    setCoords({ lat: loc.coords.latitude, lon: loc.coords.longitude });
  };

  const backgroundColor =
    data != null
      ? getHeaderBackgroundColor(data.current.temperature_2m)[theme ?? "light"]
      : "#D0D0D0";

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: backgroundColor,
        dark: backgroundColor,
      }}
      headerImage={
        <Cloudy size={310} color="#606060" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.container}>
        <Pressable style={styles.button} onPress={getLocation}>
          <Text style={{ fontSize: 20 }}>📍</Text>
          <Text style={styles.buttonText}>
            Get Weather for Current Location
          </Text>
        </Pressable>

        {isLoading && <ThemedText style={styles.status}>Loading…</ThemedText>}
        {error && (
          <ThemedText style={styles.status}>
            Error: {(error as any).message}
          </ThemedText>
        )}

        {data && (
          <>
            <ThemedText style={styles.tempText}>
              🌡️ Now: {data.current.temperature_2m} °C
            </ThemedText>

            <View style={styles.list}>
              {data.hourly.time.slice(0, 8).map((item, index) => (
                <View key={item} style={styles.card}>
                  <Text style={styles.cardText}>
                    {new Date(item).toLocaleTimeString([], {
                      hour: "numeric",
                      hour12: true,
                    })}
                  </Text>
                  <Text style={styles.cardTemp}>
                    {data.hourly.temperature_2m[index]}°C
                  </Text>
                </View>
              ))}
            </View>

            <Pressable style={styles.button} onPress={() => refetch()}>
              <Text style={styles.buttonText}>
                <RefreshCcw /> Refresh
              </Text>
            </Pressable>
          </>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  headerImage: {
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  button: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#333",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  buttonText: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    color: "#fff",
    fontSize: 16,
  },
  tempText: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 16,
  },
  status: {
    fontSize: 16,
    color: "#555",
    marginVertical: 12,
  },
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#ffffffcc",
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 4,
  },
  cardTemp: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
