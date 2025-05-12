"use client"

import { View, StyleSheet } from "react-native"
import { StatusBar } from "expo-status-bar"
import { GengarLoader } from "../components/GengarLoader"

export const SplashScreen = ({ onFinish }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <GengarLoader onFinish={onFinish} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
})
