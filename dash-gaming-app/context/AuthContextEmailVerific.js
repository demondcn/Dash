"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { supabase } from "../lib/supabase"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Verificar si hay una sesión activa
        const checkSession = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession()

                if (session) {
                    setUser(session.user)

                    // Obtener el perfil del usuario
                    const { data: profileData, error } = await supabase
                        .from("users")
                        .select("*")
                        .eq("id", session.user.id)
                        .single()

                    if (!error && profileData) {
                        setProfile(profileData)
                    }
                }
            } catch (error) {
                console.error("Error checking session:", error)
            } finally {
                setLoading(false)
            }
        }

        checkSession()

        // Suscribirse a cambios en la autenticación
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                setUser(session.user)

                // Obtener el perfil del usuario
                const { data: profileData, error } = await supabase.from("users").select("*").eq("id", session.user.id).single()

                if (!error && profileData) {
                    setProfile(profileData)
                }
            } else {
                setUser(null)
                setProfile(null)
            }
        })

        return () => {
            if (authListener && authListener.subscription) {
                authListener.subscription.unsubscribe()
            }
        }
    }, [])

    const signIn = async (email, password) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const signUp = async (email, password, username) => {
        try {
            const { error, data } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username || email.split("@")[0],
                    },
                    // codigo agregado para solucionar error: verificacionEmail
                    emailRedirectTo: undefined,
                    // Deshabilitamos la confirmación de correo
                    shouldCreateUser: true,
                    //
                },
            })

            if (error) throw error
            // Iniciar sesión automáticamente después del registro codigo agregado para solucionar error con verificacion
            if (data.user) {
                await signIn(email, password)
            }
            //
            return { success: true, data }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const updateProfile = async (updates) => {
        try {
            if (!user) throw new Error("No user logged in")

            const { error } = await supabase.from("users").update(updates).eq("id", user.id)

            if (error) throw error

            // Actualizar el estado local
            setProfile({ ...profile, ...updates })

            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                loading,
                signIn,
                signUp,
                signOut,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider")
    }
    return context
}
