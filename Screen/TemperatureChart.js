import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  PermissionsAndroid,
  TextInput,
  StyleSheet,
  Dimensions,
  Button,
  Platform,
} from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import Chart from "../Component/Chart";
import LocationInfo from "../Component/LocationInfo";

const TemperatureChart = () => {
  const [currentTemperature, setCurrentTemperature] = useState("");
  const [historicalData, setHistoricalData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [locationInput, setLocationInput] = useState("");

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      let granted;
      if (Platform.OS === "android") {
        granted =
          (await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          )) === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        granted = status === "granted";
      }

      if (granted) {
        const { coords } = await Location.getCurrentPositionAsync();
        setLocationInput(`${coords.latitude},${coords.longitude}`);
        fetchLocationBasedData();
      } else {
        setErrorMessage("Location permission denied");
      }
    } catch (error) {
      setErrorMessage("Error fetching location permission");
    }
  };

  const fetchLocationBasedData = async () => {
    try {
      setIsLoading(true);
      let location;

      if (locationInput) {
      
        location = await Location.geocodeAsync(locationInput);
        if (!location.length) {
          setErrorMessage("Invalid location");
          return;
        }
      } else {
      
        const { coords } = await Location.getCurrentPositionAsync();
        location = [{ latitude: coords.latitude, longitude: coords.longitude }];
      }

      const latitude = location[0].latitude;
      const longitude = location[0].longitude;

      const apiKey = "f14f07628f1e13b07ec75e0c98e0df94";

      const currentTemperatureURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
      const historicalDataURL = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=2023-12-03&end_date=2023-12-03&hourly=temperature_2m`;

 
      const currentTemperatureResponse = await axios.get(currentTemperatureURL);
      const currentTemp = currentTemperatureResponse.data.main.temp;
      setCurrentTemperature(currentTemp);

      console.log(currentTemp);

 
      const currentTime = new Date().getTime();
      const periodBeforeCurrentTime = 24 * 60 * 60 * 1000;
      const historicalDataResponse = await axios.get(historicalDataURL);

      const newHistoricalData = historicalDataResponse.data.hourly.time
        .map((time, i) => ({
          date: time,
          temperature: historicalDataResponse.data.hourly.temperature_2m[i],
        }))
        .filter(
          (data) =>
            new Date(data.date).getTime() <
            currentTime - periodBeforeCurrentTime
        );

      setHistoricalData(newHistoricalData);

      setIsLoading(false);
    } catch (error) {
      setErrorMessage("Error fetching temperature data");
    }
  };

  const handleLocationInputChange = (text) => {
    setLocationInput(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.locationText}>
        <LocationInfo locationInput={locationInput} />
      </View>
      <View style={styles.innerContainer}>
        {isLoading && <Text style={styles.loadingText}>Loading...</Text>}
        {!isLoading && historicalData.length > 0 && (
          <View style={styles.currentTemperatureView}>
            <Text style={styles.currentTemperatureText}>
              Current Temperature:
            </Text>
            <Text style={styles.currentTemperatureText}>
              {(currentTemperature - 273.15).toFixed(2)}°C
            </Text>

            <View style={styles.locationInputContainer}>
              <TextInput
                style={styles.locationInput}
                placeholder="Enter Location"
                onChangeText={handleLocationInputChange}
              />
              <Button title="Select Location" onPress={fetchLocationBasedData} />
            </View>
            <View style={{marginTop:'20%'}}>
              <Chart historicalData={historicalData}/>
            </View>

            
          </View>
        )}
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  locationText: {
    marginVertical: '20%',
    marginLeft: '5%'
  },
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  cityStyles: {
    color: "white",
  },
  currentTemperatureView: {
    alignItems: "center",
  },
  loadingText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  currentTemperatureText: {
    fontSize: 18,
    color: "white",
  },
  locationInputContainer: {
  
    alignItems: "center",
    marginVertical: '5%',
    width: '100%'
  },
  locationInput: {
    marginBottom:10,
    width:'90%',
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    color: "white",
  },
  errorText: {
    color: "red",
    marginTop: 10,
    fontSize: 16,
  },
});

export default TemperatureChart;
