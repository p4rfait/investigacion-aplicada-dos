import {
  Viro3DObject,
  ViroARScene,
  ViroARSceneNavigator,
  ViroAmbientLight,
  ViroDirectionalLight,
  ViroMaterials,
  ViroText,
} from "@reactvision/react-viro";
import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";

const InitialScene = () => {
  const [rotation, setRotation] = useState([0, 0, 0]);
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => [prev[0], prev[1] + 1, prev[2]]);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=San%20Salvador,SV&units=metric&appid=API_KEY_AQUI`
        );
        const data = await response.json();
        setTemperature(data.main.temp);
        setHumidity(data.main.humidity);
        console.log(data.main)
      } catch (error) {
        console.error("Error al obtener datos del clima:", error);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ViroARScene>
      <ViroDirectionalLight
        color="#ffffff"
        direction={[0, -1, -0.5]}
        castsShadow={true}
        shadowMapSize={2048}
        shadowNearZ={2}
        shadowFarZ={5}
        shadowOpacity={0.7}
      />

      <ViroAmbientLight color="#777777" />

      <Viro3DObject
        source={require('./res/antenna_b.obj')}
        position={[0, -2, -2]}
        scale={[0.8, 0.8, 0.8]}
        type="OBJ"
        materials={["antenna"]}
      />
      <Viro3DObject
        source={require('./res/antenna_a.obj')}
        position={[0, -2, -2]}
        scale={[0.8, 0.8, 0.8]}
        rotation={rotation}
        type="OBJ"
        materials={["antenna"]}
      />

      {/* Texto para temperatura */}
      <ViroText
        text={`Temperatura: ${temperature !== null ? temperature + "°C" : "Cargando..."}`}
        position={[0, 0.6, -2]}
        width={20}
        style={styles.textStyle}
      />
      {/* Texto para humedad */}
      <ViroText
        text={`Humedad: ${humidity !== null ? humidity + "%" : "Cargando..."}`}
        position={[0, 0.3, -2]}
        width={20}
        style={styles.textStyle}
      />
    </ViroARScene>
  );
};

ViroMaterials.createMaterials({
  antenna: {
    lightingModel: "Blinn",
  },
});

export default () => (
  <ViroARSceneNavigator
    initialScene={{
      scene: InitialScene
    }}
    style={{ flex: 1 }}
  />
);

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: "Arial",
    fontSize: 15,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
});
