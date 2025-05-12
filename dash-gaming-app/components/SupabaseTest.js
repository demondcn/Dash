"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"
import { supabase } from "../lib/supabase"

export const SupabaseTest = () => {
  const [status, setStatus] = useState("Comprobando conexión...")
  const [error, setError] = useState(null)

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Intentar hacer una consulta simple
        const { data, error } = await supabase.from("games").select("count").limit(1).single()

        if (error) throw error

        setStatus(`Conexión exitosa. Número de juegos: ${data.count}`)
      } catch (error) {
        console.error("Error testing connection:", error)
        setError(error.message)
        setStatus("Error de conexión")
      }
    }

    testConnection()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>{status}</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    marginBottom: 16,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  errorText: {
    color: "#FF4D4F",
    fontSize: 14,
    marginTop: 8,
  },
})
