"use client"

import { useRef, useEffect } from "react"
import { View, StyleSheet } from "react-native"
import { GLView } from "expo-gl"
import { Renderer } from "expo-three"
import {
  Scene,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  BoxGeometry,
  MeshStandardMaterial,
  Mesh,
  Color,
  Group,
  SphereGeometry,
} from "three"

export const ThreeBackground = () => {
  const timeout = useRef(null)

  useEffect(() => {
    // Limpieza al desmontar
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
    }
  }, [])

  // Función para crear la escena 3D
  const onContextCreate = async (gl) => {
    // Crear un nuevo renderizador
    const renderer = new Renderer({ gl })
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight)
    renderer.setClearColor(new Color("#121212"))

    // Crear una escena
    const scene = new Scene()
    scene.background = new Color("#121212")

    // Crear una cámara
    const camera = new PerspectiveCamera(70, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000)
    camera.position.z = 5

    // Añadir luces
    const ambientLight = new AmbientLight(0x404040)
    scene.add(ambientLight)

    const directionalLight = new DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // Crear grupo para los objetos flotantes
    const floatingObjects = new Group()
    scene.add(floatingObjects)

    // Crear cubos y esferas flotantes con colores de videojuegos
    const colors = [
      "#8A2BE2", // Púrpura (color principal)
      "#FF5555", // Rojo
      "#55FF55", // Verde
      "#5555FF", // Azul
      "#FFFF55", // Amarillo
      "#FF55FF", // Rosa
    ]

    // Crear 20 objetos aleatorios
    for (let i = 0; i < 20; i++) {
      let geometry
      const random = Math.random()

      // Alternar entre cubos y esferas
      if (random > 0.7) {
        geometry = new BoxGeometry(0.3, 0.3, 0.3)
      } else if (random > 0.4) {
        geometry = new SphereGeometry(0.2, 16, 16)
      } else {
        geometry = new BoxGeometry(0.2, 0.2, 0.2)
      }

      // Material con color aleatorio
      const material = new MeshStandardMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        roughness: 0.7,
        metalness: 0.3,
      })

      const mesh = new Mesh(geometry, material)

      // Posición aleatoria
      mesh.position.x = (Math.random() - 0.5) * 10
      mesh.position.y = (Math.random() - 0.5) * 10
      mesh.position.z = (Math.random() - 0.5) * 5 - 2

      // Rotación aleatoria
      mesh.rotation.x = Math.random() * Math.PI
      mesh.rotation.y = Math.random() * Math.PI

      // Propiedades para animación
      mesh.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01,
        },
        floatSpeed: {
          x: (Math.random() - 0.5) * 0.005,
          y: (Math.random() - 0.5) * 0.005,
        },
      }

      floatingObjects.add(mesh)
    }

    // Función de renderizado
    const render = () => {
      timeout.current = requestAnimationFrame(render)

      // Animar los objetos flotantes
      floatingObjects.children.forEach((mesh) => {
        // Rotación
        mesh.rotation.x += mesh.userData.rotationSpeed.x
        mesh.rotation.y += mesh.userData.rotationSpeed.y
        mesh.rotation.z += mesh.userData.rotationSpeed.z

        // Movimiento flotante
        mesh.position.x += mesh.userData.floatSpeed.x
        mesh.position.y += mesh.userData.floatSpeed.y

        // Mantener los objetos dentro de los límites
        if (Math.abs(mesh.position.x) > 5) {
          mesh.userData.floatSpeed.x *= -1
        }
        if (Math.abs(mesh.position.y) > 5) {
          mesh.userData.floatSpeed.y *= -1
        }
      })

      // Rotar suavemente todo el grupo
      floatingObjects.rotation.y += 0.001

      renderer.render(scene, camera)
      gl.endFrameEXP()
    }

    render()
  }

  return (
    <View style={styles.container}>
      <GLView style={styles.glView} onContextCreate={onContextCreate} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  glView: {
    width: "100%",
    height: "100%",
  },
})
