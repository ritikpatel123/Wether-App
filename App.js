import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import TemperatureChart from './Screen/TemperatureChart';

export default function App() {
  return (

    <View style={styles.container}>
      <StatusBar style="light" />
      <TemperatureChart/>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
