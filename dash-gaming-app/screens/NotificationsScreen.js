"use client"

import { useState } from "react"
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, FlatList } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { Button } from "../components/ui/Button"

export const NotificationsScreen = ({ navigation }) => {
  // Estado para las preferencias de notificaciones
  const [notificationPreferences, setNotificationPreferences] = useState({
    offers: true,
    newGames: true,
    friendRequests: true,
    gameUpdates: false,
    systemUpdates: true,
    wishlistDiscounts: true,
    achievements: false,
    newsletters: false,
  })

  // Datos de ejemplo para el historial de notificaciones
  const [notificationHistory] = useState([
    {
      id: "1",
      title: "¡Oferta especial!",
      message: "Cyberpunk 2077 está con un 50% de descuento por tiempo limitado.",
      date: "2023-11-15T14:30:00",
      read: true,
      type: "offer",
    },
    {
      id: "2",
      title: "Actualización disponible",
      message: "Una nueva actualización de la aplicación DASH está disponible.",
      date: "2023-11-10T09:15:00",
      read: false,
      type: "system",
    },
    {
      id: "3",
      title: "Nuevo juego en tu lista de deseos",
      message: "Elden Ring está ahora disponible. ¡Está en tu lista de deseos!",
      date: "2023-11-05T18:45:00",
      read: true,
      type: "wishlist",
    },
    {
      id: "4",
      title: "Invitación de amistad",
      message: "GamerPro123 te ha enviado una solicitud de amistad.",
      date: "2023-11-01T12:20:00",
      read: false,
      type: "friend",
    },
  ])

  // Función para cambiar una preferencia de notificación
  const toggleNotificationPreference = (key) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Renderizar un elemento de notificación
  const renderNotificationItem = ({ item }) => {
    const getIconName = () => {
      switch (item.type) {
        case "offer":
          return "pricetag"
        case "system":
          return "settings"
        case "wishlist":
          return "heart"
        case "friend":
          return "person-add"
        default:
          return "notifications"
      }
    }

    return (
      <View style={[styles.notificationItem, !item.read && styles.unreadNotification]}>
        <View style={[styles.notificationIcon, { backgroundColor: getNotificationColor(item.type) }]}>
          <Ionicons name={getIconName()} size={20} color="#FFFFFF" />
        </View>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationDate}>{formatDate(item.date)}</Text>
        </View>
        {!item.read && <View style={styles.unreadIndicator} />}
      </View>
    )
  }

  // Obtener color según el tipo de notificación
  const getNotificationColor = (type) => {
    switch (type) {
      case "offer":
        return "#8A2BE2" // Púrpura (principal)
      case "system":
        return "#4B0082" // Índigo
      case "wishlist":
        return "#FF4D4F" // Rojo
      case "friend":
        return "#4CAF50" // Verde
      default:
        return "#666666" // Gris
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferencias de notificaciones</Text>
          <Text style={styles.sectionDescription}>
            Configura qué tipo de notificaciones quieres recibir en tu dispositivo.
          </Text>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceTitle}>Ofertas y promociones</Text>
              <Text style={styles.preferenceDescription}>Recibe alertas sobre descuentos y ofertas especiales</Text>
            </View>
            <Switch
              value={notificationPreferences.offers}
              onValueChange={() => toggleNotificationPreference("offers")}
              trackColor={{ false: "#333", true: "#8A2BE2" }}
              thumbColor={notificationPreferences.offers ? "#FFFFFF" : "#f4f3f4"}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceTitle}>Nuevos lanzamientos</Text>
              <Text style={styles.preferenceDescription}>Notificaciones sobre nuevos juegos disponibles</Text>
            </View>
            <Switch
              value={notificationPreferences.newGames}
              onValueChange={() => toggleNotificationPreference("newGames")}
              trackColor={{ false: "#333", true: "#8A2BE2" }}
              thumbColor={notificationPreferences.newGames ? "#FFFFFF" : "#f4f3f4"}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceTitle}>Solicitudes de amistad</Text>
              <Text style={styles.preferenceDescription}>Notificaciones cuando alguien te envía una solicitud</Text>
            </View>
            <Switch
              value={notificationPreferences.friendRequests}
              onValueChange={() => toggleNotificationPreference("friendRequests")}
              trackColor={{ false: "#333", true: "#8A2BE2" }}
              thumbColor={notificationPreferences.friendRequests ? "#FFFFFF" : "#f4f3f4"}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceTitle}>Actualizaciones de juegos</Text>
              <Text style={styles.preferenceDescription}>Notificaciones sobre parches y actualizaciones</Text>
            </View>
            <Switch
              value={notificationPreferences.gameUpdates}
              onValueChange={() => toggleNotificationPreference("gameUpdates")}
              trackColor={{ false: "#333", true: "#8A2BE2" }}
              thumbColor={notificationPreferences.gameUpdates ? "#FFFFFF" : "#f4f3f4"}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceTitle}>Actualizaciones del sistema</Text>
              <Text style={styles.preferenceDescription}>Notificaciones sobre actualizaciones de la aplicación</Text>
            </View>
            <Switch
              value={notificationPreferences.systemUpdates}
              onValueChange={() => toggleNotificationPreference("systemUpdates")}
              trackColor={{ false: "#333", true: "#8A2BE2" }}
              thumbColor={notificationPreferences.systemUpdates ? "#FFFFFF" : "#f4f3f4"}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceTitle}>Descuentos en lista de deseos</Text>
              <Text style={styles.preferenceDescription}>
                Notificaciones cuando un juego de tu lista de deseos está en oferta
              </Text>
            </View>
            <Switch
              value={notificationPreferences.wishlistDiscounts}
              onValueChange={() => toggleNotificationPreference("wishlistDiscounts")}
              trackColor={{ false: "#333", true: "#8A2BE2" }}
              thumbColor={notificationPreferences.wishlistDiscounts ? "#FFFFFF" : "#f4f3f4"}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceTitle}>Logros</Text>
              <Text style={styles.preferenceDescription}>Notificaciones sobre logros desbloqueados</Text>
            </View>
            <Switch
              value={notificationPreferences.achievements}
              onValueChange={() => toggleNotificationPreference("achievements")}
              trackColor={{ false: "#333", true: "#8A2BE2" }}
              thumbColor={notificationPreferences.achievements ? "#FFFFFF" : "#f4f3f4"}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceTitle}>Boletines y noticias</Text>
              <Text style={styles.preferenceDescription}>Recibe noticias y actualizaciones por correo</Text>
            </View>
            <Switch
              value={notificationPreferences.newsletters}
              onValueChange={() => toggleNotificationPreference("newsletters")}
              trackColor={{ false: "#333", true: "#8A2BE2" }}
              thumbColor={notificationPreferences.newsletters ? "#FFFFFF" : "#f4f3f4"}
            />
          </View>

          <Button title="Guardar preferencias" style={styles.saveButton} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historial de notificaciones</Text>

          <FlatList
            data={notificationHistory}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />

          <TouchableOpacity style={styles.clearHistoryButton}>
            <Text style={styles.clearHistoryText}>Borrar historial</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#1A1A1A",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  sectionDescription: {
    color: "#CCCCCC",
    fontSize: 14,
    marginBottom: 16,
  },
  preferenceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  preferenceTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  preferenceTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  preferenceDescription: {
    color: "#999999",
    fontSize: 12,
  },
  saveButton: {
    marginTop: 20,
  },
  notificationItem: {
    flexDirection: "row",
    backgroundColor: "#222222",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  unreadNotification: {
    backgroundColor: "#2A2A2A",
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  notificationMessage: {
    color: "#CCCCCC",
    fontSize: 14,
    marginBottom: 4,
  },
  notificationDate: {
    color: "#999999",
    fontSize: 12,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#8A2BE2",
    marginLeft: 8,
  },
  clearHistoryButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  clearHistoryText: {
    color: "#8A2BE2",
    fontSize: 16,
  },
})
