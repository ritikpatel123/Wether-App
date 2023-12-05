import React from 'react'
import { LineChart } from 'react-native-chart-kit'
import { View, Text, Dimensions } from 'react-native'

const extractLabels = (historicalData) => {
  return historicalData.slice(-10).map((data) => {
    const dateObject = new Date(data.date);
    const hour = dateObject.getHours();
    return hour;
  });
}

const extractData = (historicalData) => {
  return historicalData.slice(-10).map((data) => data.temperature);
}

const Chart = ({historicalData}) => {
  const labels = extractLabels(historicalData);
  const data = extractData(historicalData);

  return (
    <LineChart
      data={{
        labels: labels,
        datasets: [
          {
            data: data,
            strokeWidth: 2,
            fill: true,
          },
        ],
      }}
      width={Dimensions.get("window").width}
      height={220}
      yAxisLabel=""
      yAxisSuffix=" C"
      yAxisInterval={1}
      chartConfig={{
        backgroundColor: "transparent",
        backgroundGradientFrom: "",
        backgroundGradientTo: "",
        decimalPlaces: 2, 
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: "6",
          strokeWidth: "2",
          stroke: "white",
        },
      }}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 16,
      }}
    />
  )
}

export default Chart