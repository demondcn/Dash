"use client"

import { useState } from "react"
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Alert } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { Button } from "../components/ui/Button"

export const PrivacyScreen = ({ navigation }) => {
  // Estado para las configuraciones de privacidad
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public", // public, friends, private
    gameLibraryVisibility: "friends", // public, friends, private
    onlineStatus: "online", // online, invisible
    activitySharing: true,
    friendRequests: true,
    dataCollection: true,
    targetedAds: false,
    twoFactorAuth: false,
  })

  // Función para cambiar una configuración de tipo switch
  const toggleSetting = (key) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Función para cambiar la visibilidad del perfil
  const changeProfileVisibility = (value) => {
    setPrivacySettings((prev) => ({
      ...prev,
      profileVisibility: value,
    }))
  }

  // Función para cambiar la visibilidad de la biblioteca
  const changeLibraryVisibility = (value) => {
    setPrivacySettings((prev) => ({
      ...prev,
      gameLibraryVisibility: value,
    }))
  }

  // Función para cambiar el estado en línea
  const changeOnlineStatus = (value) => {
    setPrivacySettings((prev) => ({
      ...prev,
      onlineStatus: value,
    }))
  }

  // Función para eliminar datos de la cuenta
  const handleDeleteData = () => {
    Alert.alert(
      "Eliminar datos",
      "¿Estás seguro de que quieres eliminar todos tus datos? Esta acción no se puede deshacer.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => {
            // Aquí iría la lógica para eliminar datos
            Alert.alert("Datos eliminados", "Todos tus datos han sido eliminados correctamente.")
          },
          style: "destructive",
        },
      ],
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacidad</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración de perfil</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingTitle}>Visibilidad del perfil</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity style={styles.radioOption} onPress={() => changeProfileVisibility("public")}>
                <View
                  style={[
                    styles.radioButton,
                    privacySettings.profileVisibility === "public" && styles.radioButtonSelected,
                  ]}
                />
                <Text style={styles.radioText}>Público</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.radioOption} onPress={() => changeProfileVisibility("friends")}>
                <View
                  style={[
                    styles.radioButton,
                    privacySettings.profileVisibility === "friends" && styles.radioButtonSelected,
                  ]}
                />
                <Text style={styles.radioText}>Amigos</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.radioOption} onPress={() => changeProfileVisibility("private")}>
                <View
                  style={[
                    styles.radioButton,
                    privacySettings.profileVisibility === "private" && styles.radioButtonSelected,
                  ]}
                />
                <Text style={styles.radioText}>Privado</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingTitle}>Visibilidad de biblioteca</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity style={styles.radioOption} onPress={() => changeLibraryVisibility("public")}>
                <View
                  style={[
                    styles.radioButton,
                    privacySettings.gameLibraryVisibility === "public" && styles.radioButtonSelected,
                  ]}
                />
                <Text style={styles.radioText}>Público</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.radioOption} onPress={() => changeLibraryVisibility("friends")}>
                <View
                  style={[
                    styles.radioButton,
                    privacySettings.gameLibraryVisibility === "friends" && styles.radioButtonSelected,
                  ]}
                />
                <Text style={styles.radioText}>Amigos</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.radioOption} onPress={() => changeLibraryVisibility("private")}>
                <View
                  style={[
                    styles.radioButton,
                    privacySettings.gameLibraryVisibility === "private" && styles.radioButtonSelected,
                  ]}
                />
                <Text style={styles.radioText}>Privado</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingTitle}>Estado en línea</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity style={styles.radioOption} onPress={() => changeOnlineStatus("online")}>
                <View
                  style={[styles.radioButton, privacySettings.onlineStatus === "online" && styles.radioButtonSelected]}
                />
                <Text style={styles.radioText}>En línea</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.radioOption} onPress={() => changeOnlineStatus("invisible")}>
                <View
                  style={[
                    styles.radioButton,
                    privacySettings.onlineStatus === "invisible" && styles.radioButtonSelected,
                  ]}
                />
                <Text style={styles.radioText}>Invisible</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.switchItem}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchTitle}>Compartir actividad</Text>
              <Text style={styles.switchDescription}>Permitir que tus amigos vean a qué estás jugando</Text>
            </View>
            <Switch
              value={privacySettings.activitySharing}
              onValueChange={() => toggleSetting("activitySharing")}
              trackColor={{ false: "#333", true: "#8A2BE2" }}
              thumbColor={privacySettings.activitySharing ? "#FFFFFF" : "#f4f3f4"}
            />
          </View>

          <View style={styles.switchItem}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchTitle}>Solicitudes de amistad</Text>
              <Text style={styles.switchDescription}>Permitir que otros usuarios te envíen solicitudes</Text>
            </View>
            <Switch
              value={privacySettings.friendRequests}
              onValueChange={() => toggleSetting("friendRequests")}
              trackColor={{ false: "#333", true: "#8A2BE2" }}
              thumbColor={privacySettings.friendRequests ? "#FFFFFF" : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos y seguridad</Text>

          <View style={styles.switchItem}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchTitle}>Recopilación de datos</Text>
              <Text style={styles.switchDescription}>Permitir la recopilación de datos para mejorar el servicio</Text>
            </View>
            <Switch
              value={privacySettings.dataCollection}
              onValueChange={() => toggleSetting("dataCollection")}
              trackColor={{ false: "#333", true: "#8A2BE2" }}
              thumbColor={privacySettings.dataCollection ? "#FFFFFF" : "#f4f3f4"}
            />
          </View>

          <View style={styles.switchItem}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchTitle}>Publicidad personalizada</Text>
              <Text style={styles.switchDescription}>Recibir anuncios basados en tus intereses</Text>
            </View>
            <Switch
              value={privacySettings.targetedAds}
              onValueChange={() => toggleSetting("targetedAds")}
              trackColor={{ false: "#333", true: "#8A2BE2" }}
              thumbColor={privacySettings.targetedAds ? "#FFFFFF" : "#f4f3f4"}
            />
          </View>

          <View style={styles.switchItem}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchTitle}>Autenticación de dos factores</Text>
              <Text style={styles.switchDescription}>Añade una capa extra de seguridad a tu cuenta</Text>
            </View>
            <Switch
              value={privacySettings.twoFactorAuth}
              onValueChange={() => toggleSetting("twoFactorAuth")}
              trackColor={{ false: "#333", true: "#8A2BE2" }}
              thumbColor={privacySettings.twoFactorAuth ? "#FFFFFF" : "#f4f3f4"}
            />
          </View>

          <TouchableOpacity
            style={styles.dataButton}
            onPress={() => Alert.alert("Datos", "Aquí podrías descargar tus datos personales.")}
          >
            <Text style={styles.dataButtonText}>Descargar mis datos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.dataButton, styles.deleteButton]} onPress={handleDeleteData}>
            <Text style={styles.deleteButtonText}>Eliminar mis datos</Text>
          </TouchableOpacity>
        </View>

        <Button title="Guardar configuración" style={styles.saveButton} />
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
    marginBottom: 16,
  },
  settingItem: {
    marginBottom: 20,
  },
  settingTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#8A2BE2",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    backgroundColor: "#8A2BE2",
  },
  radioText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  switchItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  switchTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  switchTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  switchDescription: {
    color: "#999999",
    fontSize: 12,
  },
  dataButton: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 12,
  },
  dataButtonText: {
    color: "#8A2BE2",
    fontSize: 16,
    fontWeight: "500",
  },
  deleteButton: {
    backgroundColor: "rgba(255, 77, 79, 0.1)",
    borderWidth: 1,
    borderColor: "#FF4D4F",
  },
  deleteButtonText: {
    color: "#FF4D4F",
    fontSize: 16,
    fontWeight: "500",
  },
  saveButton: {
    marginBottom: 30,
  },
})
