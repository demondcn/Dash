"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { Button } from "../components/ui/Button"

export const PaymentMethodsScreen = ({ navigation }) => {
  // Estado para los métodos de pago guardados
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([
    {
      id: "1",
      type: "visa",
      cardNumber: "•••• •••• •••• 4242",
      expiryDate: "12/25",
      cardholderName: "Juan Pérez",
      isDefault: true,
    },
    {
      id: "2",
      type: "mastercard",
      cardNumber: "•••• •••• •••• 5555",
      expiryDate: "09/24",
      cardholderName: "Juan Pérez",
      isDefault: false,
    },
  ])

  // Estado para el formulario de nueva tarjeta
  const [showAddCardForm, setShowAddCardForm] = useState(false)
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })
  const [errors, setErrors] = useState({})

  // Función para establecer un método de pago como predeterminado
  const setDefaultPaymentMethod = (id) => {
    setSavedPaymentMethods(
      savedPaymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )
  }

  // Función para eliminar un método de pago
  const deletePaymentMethod = (id) => {
    Alert.alert("Eliminar método de pago", "¿Estás seguro de que quieres eliminar este método de pago?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Eliminar",
        onPress: () => {
          setSavedPaymentMethods(savedPaymentMethods.filter((method) => method.id !== id))
        },
        style: "destructive",
      },
    ])
  }

  // Función para validar y añadir una nueva tarjeta
  const handleAddCard = () => {
    // Validación básica
    const newErrors = {}
    if (!newCard.cardNumber.trim()) newErrors.cardNumber = "El número de tarjeta es obligatorio"
    if (!newCard.expiryDate.trim()) newErrors.expiryDate = "La fecha de caducidad es obligatoria"
    if (!newCard.cvv.trim()) newErrors.cvv = "El CVV es obligatorio"
    if (!newCard.cardholderName.trim()) newErrors.cardholderName = "El nombre del titular es obligatorio"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Determinar el tipo de tarjeta (simplificado)
    let cardType = "visa"
    if (newCard.cardNumber.startsWith("5")) {
      cardType = "mastercard"
    } else if (newCard.cardNumber.startsWith("3")) {
      cardType = "amex"
    }

    // Añadir la nueva tarjeta
    const newPaymentMethod = {
      id: Date.now().toString(),
      type: cardType,
      cardNumber: "•••• •••• •••• " + newCard.cardNumber.slice(-4),
      expiryDate: newCard.expiryDate,
      cardholderName: newCard.cardholderName,
      isDefault: savedPaymentMethods.length === 0, // Si es la primera tarjeta, establecerla como predeterminada
    }

    setSavedPaymentMethods([...savedPaymentMethods, newPaymentMethod])
    setShowAddCardForm(false)
    setNewCard({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
    })
    setErrors({})

    Alert.alert("Tarjeta añadida", "Tu tarjeta ha sido añadida correctamente.")
  }

  // Función para obtener el icono de la tarjeta
  const getCardIcon = (type) => {
    switch (type) {
      case "visa":
        return require("../assets/visa.png")
      case "mastercard":
        return require("../assets/mastercard.png")
      case "amex":
        return require("../assets/amex.png")
      default:
        return require("../assets/generic-card.png")
    }
  }

  // Renderizar un método de pago guardado
  const renderPaymentMethod = (method) => (
    <View key={method.id} style={styles.paymentMethodItem}>
      <View style={styles.cardIconContainer}>
        <Image source={getCardIcon(method.type)} style={styles.cardIcon} resizeMode="contain" />
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.cardNumber}>{method.cardNumber}</Text>
        <Text style={styles.cardInfo}>
          {method.cardholderName} | Caduca: {method.expiryDate}
        </Text>
        {method.isDefault && <Text style={styles.defaultBadge}>Predeterminada</Text>}
      </View>
      <View style={styles.cardActions}>
        {!method.isDefault && (
          <TouchableOpacity onPress={() => setDefaultPaymentMethod(method.id)} style={styles.cardAction}>
            <Ionicons name="checkmark-circle-outline" size={22} color="#8A2BE2" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => deletePaymentMethod(method.id)} style={styles.cardAction}>
          <Ionicons name="trash-outline" size={22} color="#FF4D4F" />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Métodos de pago</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tarjetas guardadas</Text>
          {savedPaymentMethods.length > 0 ? (
            savedPaymentMethods.map(renderPaymentMethod)
          ) : (
            <Text style={styles.emptyText}>No tienes tarjetas guardadas</Text>
          )}

          {!showAddCardForm && (
            <TouchableOpacity style={styles.addCardButton} onPress={() => setShowAddCardForm(true)}>
              <Ionicons name="add-circle-outline" size={20} color="#8A2BE2" />
              <Text style={styles.addCardText}>Añadir nueva tarjeta</Text>
            </TouchableOpacity>
          )}
        </View>

        {showAddCardForm && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Añadir nueva tarjeta</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Número de tarjeta</Text>
              <TextInput
                style={[styles.input, errors.cardNumber && styles.inputError]}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#666"
                value={newCard.cardNumber}
                onChangeText={(text) => setNewCard({ ...newCard, cardNumber: text })}
                keyboardType="numeric"
                maxLength={19}
              />
              {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Fecha de caducidad</Text>
                <TextInput
                  style={[styles.input, errors.expiryDate && styles.inputError]}
                  placeholder="MM/AA"
                  placeholderTextColor="#666"
                  value={newCard.expiryDate}
                  onChangeText={(text) => setNewCard({ ...newCard, expiryDate: text })}
                  maxLength={5}
                />
                {errors.expiryDate && <Text style={styles.errorText}>{errors.expiryDate}</Text>}
              </View>

              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>CVV</Text>
                <TextInput
                  style={[styles.input, errors.cvv && styles.inputError]}
                  placeholder="123"
                  placeholderTextColor="#666"
                  value={newCard.cvv}
                  onChangeText={(text) => setNewCard({ ...newCard, cvv: text })}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
                {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nombre del titular</Text>
              <TextInput
                style={[styles.input, errors.cardholderName && styles.inputError]}
                placeholder="Nombre como aparece en la tarjeta"
                placeholderTextColor="#666"
                value={newCard.cardholderName}
                onChangeText={(text) => setNewCard({ ...newCard, cardholderName: text })}
              />
              {errors.cardholderName && <Text style={styles.errorText}>{errors.cardholderName}</Text>}
            </View>

            <View style={styles.formActions}>
              <Button
                title="Cancelar"
                variant="outline"
                onPress={() => {
                  setShowAddCardForm(false)
                  setErrors({})
                }}
                style={{ flex: 1, marginRight: 10 }}
              />
              <Button title="Guardar tarjeta" onPress={handleAddCard} style={{ flex: 2 }} />
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Otros métodos de pago</Text>

          <TouchableOpacity style={styles.paymentOption}>
            <View style={styles.paymentOptionIcon}>
              <Ionicons name="logo-paypal" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.paymentOptionText}>PayPal</Text>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentOption}>
            <View style={styles.paymentOptionIcon}>
              <Ionicons name="wallet-outline" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.paymentOptionText}>Monedero DASH</Text>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentOption}>
            <View style={styles.paymentOptionIcon}>
              <Ionicons name="gift-outline" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.paymentOptionText}>Tarjetas de regalo</Text>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
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
    marginBottom: 16,
  },
  emptyText: {
    color: "#999999",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
  paymentMethodItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  cardIconContainer: {
    width: 40,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardIcon: {
    width: 40,
    height: 25,
  },
  cardDetails: {
    flex: 1,
  },
  cardNumber: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  cardInfo: {
    color: "#CCCCCC",
    fontSize: 12,
  },
  defaultBadge: {
    color: "#8A2BE2",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  cardActions: {
    flexDirection: "row",
  },
  cardAction: {
    padding: 8,
  },
  addCardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    marginTop: 8,
  },
  addCardText: {
    color: "#8A2BE2",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: "row",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#2A2A2A",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 16,
  },
  inputError: {
    borderColor: "#FF4D4F",
  },
  errorText: {
    color: "#FF4D4F",
    fontSize: 12,
    marginTop: 4,
  },
  formActions: {
    flexDirection: "row",
    marginTop: 16,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  paymentOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  paymentOptionText: {
    color: "#FFFFFF",
    fontSize: 16,
    flex: 1,
  },
})
