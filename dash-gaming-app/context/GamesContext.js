"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "./AuthContext"

const GamesContext = createContext()

export const GamesProvider = ({ children }) => {
  const { user } = useAuth()
  const [games, setGames] = useState([])
  const [userGames, setUserGames] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [cartLoading, setCartLoading] = useState(true)
  const [libraryLoading, setLibraryLoading] = useState(true)

  // Cargar todos los juegos
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data, error } = await supabase.from("games").select("*").order("release_date", { ascending: false })

        if (error) throw error

        setGames(data || [])
      } catch (error) {
        console.error("Error fetching games:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

  // Cargar juegos del usuario (biblioteca)
  useEffect(() => {
    const fetchUserGames = async () => {
      if (!user) {
        setUserGames([])
        setLibraryLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from("user_games")
          .select(`
            *,
            games:game_id (*)
          `)
          .eq("user_id", user.id)

        if (error) throw error

        // Transformar los datos para que sean más fáciles de usar
        const transformedData = data.map((item) => ({
          id: item.id,
          ...item.games,
          last_played: item.last_played,
          playtime_minutes: item.playtime_minutes,
        }))

        setUserGames(transformedData || [])
      } catch (error) {
        console.error("Error fetching user games:", error)
      } finally {
        setLibraryLoading(false)
      }
    }

    fetchUserGames()
  }, [user])

  // Cargar elementos del carrito
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) {
        setCartItems([])
        setCartLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from("cart_items")
          .select(`
            *,
            games:game_id (*)
          `)
          .eq("user_id", user.id)

        if (error) throw error

        // Transformar los datos
        const transformedData = data.map((item) => ({
          id: item.id,
          ...item.games,
          added_at: item.added_at,
        }))

        setCartItems(transformedData || [])
      } catch (error) {
        console.error("Error fetching cart items:", error)
      } finally {
        setCartLoading(false)
      }
    }

    fetchCartItems()
  }, [user])

  const getGameById = (id) => {
    return games.find((game) => game.id.toString() === id.toString())
  }

  const addToCart = async (gameId) => {
    if (!user) return { success: false, error: "Usuario no autenticado" }

    try {
      // Verificar si el juego ya está en el carrito
      const existingItem = cartItems.find((item) => item.id.toString() === gameId.toString())
      if (existingItem) {
        return { success: false, error: "El juego ya está en el carrito" }
      }

      // Verificar si el usuario ya tiene el juego
      const ownedGame = userGames.find((game) => game.id.toString() === gameId.toString())
      if (ownedGame) {
        return { success: false, error: "Ya tienes este juego en tu biblioteca" }
      }

      const { error } = await supabase.from("cart_items").insert([{ user_id: user.id, game_id: gameId }])

      if (error) throw error

      // Actualizar el estado local
      const game = getGameById(gameId)
      if (game) {
        setCartItems([...cartItems, { ...game, added_at: new Date().toISOString() }])
      }

      return { success: true }
    } catch (error) {
      console.error("Error adding to cart:", error)
      return { success: false, error: error.message }
    }
  }

  const removeFromCart = async (gameId) => {
    if (!user) return { success: false, error: "Usuario no autenticado" }

    try {
      const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id).eq("game_id", gameId)

      if (error) throw error

      // Actualizar el estado local
      setCartItems(cartItems.filter((item) => item.id.toString() !== gameId.toString()))

      return { success: true }
    } catch (error) {
      console.error("Error removing from cart:", error)
      return { success: false, error: error.message }
    }
  }

  const clearCart = async () => {
    if (!user) return { success: false, error: "Usuario no autenticado" }

    try {
      const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id)

      if (error) throw error

      // Actualizar el estado local
      setCartItems([])

      return { success: true }
    } catch (error) {
      console.error("Error clearing cart:", error)
      return { success: false, error: error.message }
    }
  }

  const purchaseGame = async (gameId) => {
    if (!user) return { success: false, error: "Usuario no autenticado" }

    try {
      // Verificar si el usuario ya tiene el juego
      const ownedGame = userGames.find((game) => game.id.toString() === gameId.toString())
      if (ownedGame) {
        return { success: false, error: "Ya tienes este juego en tu biblioteca" }
      }

      const { error } = await supabase.from("user_games").insert([
        {
          user_id: user.id,
          game_id: gameId,
          purchase_date: new Date().toISOString(),
        },
      ])

      if (error) throw error

      // Eliminar el juego del carrito si está allí
      await removeFromCart(gameId)

      // Actualizar el estado local
      const game = getGameById(gameId)
      if (game) {
        setUserGames([
          ...userGames,
          {
            ...game,
            last_played: null,
            playtime_minutes: 0,
            purchase_date: new Date().toISOString(),
          },
        ])
      }

      return { success: true }
    } catch (error) {
      console.error("Error purchasing game:", error)
      return { success: false, error: error.message }
    }
  }

  const updatePlaytime = async (gameId, minutes) => {
    if (!user) return { success: false, error: "Usuario no autenticado" }

    try {
      // Encontrar el registro de user_games para este juego
      const { data, error: fetchError } = await supabase
        .from("user_games")
        .select("*")
        .eq("user_id", user.id)
        .eq("game_id", gameId)
        .single()

      if (fetchError) throw fetchError

      if (!data) {
        return { success: false, error: "Juego no encontrado en la biblioteca" }
      }

      const { error } = await supabase
        .from("user_games")
        .update({
          last_played: new Date().toISOString(),
          playtime_minutes: (data.playtime_minutes || 0) + minutes,
        })
        .eq("id", data.id)

      if (error) throw error

      // Actualizar el estado local
      setUserGames(
        userGames.map((game) => {
          if (game.id.toString() === gameId.toString()) {
            return {
              ...game,
              last_played: new Date().toISOString(),
              playtime_minutes: (game.playtime_minutes || 0) + minutes,
            }
          }
          return game
        }),
      )

      return { success: true }
    } catch (error) {
      console.error("Error updating playtime:", error)
      return { success: false, error: error.message }
    }
  }

  return (
    <GamesContext.Provider
      value={{
        games,
        userGames,
        cartItems,
        loading,
        cartLoading,
        libraryLoading,
        getGameById,
        addToCart,
        removeFromCart,
        clearCart,
        purchaseGame,
        updatePlaytime,
      }}
    >
      {children}
    </GamesContext.Provider>
  )
}

export const useGames = () => {
  const context = useContext(GamesContext)
  if (!context) {
    throw new Error("useGames debe ser usado dentro de un GamesProvider")
  }
  return context
}

