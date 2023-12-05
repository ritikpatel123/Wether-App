import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LocationInfo = ({ locationInput }) => {
  const [placeName, setPlaceName] = useState(null);
  const { latitude, longitude } = locationInput;

  const getPlaceName = async () => {
    try {
        console.log(locationInput)
      const query = locationInput || `${latitude},${longitude}`; 
      const apiKey = 'c6bce7704cdc46e690a94bb10e9e7097';
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${apiKey}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error data:', errorData);
        throw new Error('Failed to retrieve place information');
      }
      const data = await response.json();
  
      if (data.results && data.results.length > 0) {
        setPlaceName(data.results[0].formatted);
      } else {
        throw new Error('No results found');
      }
    } catch (error) {
      console.error('Error:', error.message);
      setPlaceName(null);
    }

    console.log(placeName,"dd",locationInput);
  };

  useEffect(() => {
    getPlaceName();

  }, [ longitude,latitude,locationInput]);

  const locationComponents = (placeName || "").split(",");
  const [city="", state="", country=""] = locationComponents.map(component => component.trim());

  return (
    <View>
      <Text style={styles.text}>{city}</Text>
      <Text style={styles.text}>{state}</Text>
      <Text style={styles.text}>{country}</Text>
    </View>
  );
};

export default LocationInfo;

const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    opacity: 0.5,
  },
});
