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
  TextureLoader,
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  Color,
  DoubleSide,
  Group,
  Clock,
} from "three"

export const GengarLoader = ({ onFinish }) => {
  const timeout = useRef(null)
  const finishTimeout = useRef(null)
  const clock = useRef(new Clock())

  useEffect(() => {
    // Configurar el temporizador para finalizar la animación después de 3 segundos
    finishTimeout.current = setTimeout(() => {
      if (onFinish) onFinish()
    }, 3000)

    // Limpieza al desmontar
    return () => {
      if (timeout.current) {
        cancelAnimationFrame(timeout.current)
      }
      if (finishTimeout.current) {
        clearTimeout(finishTimeout.current)
      }
    }
  }, [onFinish])

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
    const ambientLight = new AmbientLight(0x404040, 2)
    scene.add(ambientLight)

    const directionalLight = new DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // Crear un grupo para Gengar
    const gengarGroup = new Group()
    scene.add(gengarGroup)

    // Cargar la textura de Gengar
    const textureLoader = new TextureLoader()
    const gengarTexture = await textureLoader.loadAsync(require("../assets/gengar.png"))

    // Crear un plano con la textura de Gengar
    const gengarGeometry = new PlaneGeometry(3, 3)
    const gengarMaterial = new MeshBasicMaterial({
      map: gengarTexture,
      transparent: true,
      side: DoubleSide,
    })
    const gengar = new Mesh(gengarGeometry, gengarMaterial)
    gengarGroup.add(gengar)

    // Crear un texto "CARGANDO..." debajo de Gengar
    const loadingGeometry = new PlaneGeometry(4, 0.8)
    const loadingMaterial = new MeshBasicMaterial({
      map: await textureLoader.loadAsync(require("../assets/loading-text.png")),
      transparent: true,
      side: DoubleSide,
    })
    const loadingText = new Mesh(loadingGeometry, loadingMaterial)
    loadingText.position.y = -2.2
    gengarGroup.add(loadingText)

    // Crear un efecto de sombra/aura para Gengar
    const shadowGeometry = new PlaneGeometry(2, 0.5)
    const shadowMaterial = new MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.3,
      side: DoubleSide,
    })
    const shadow = new Mesh(shadowGeometry, shadowMaterial)
    shadow.position.y = -1.5
    shadow.rotation.x = -Math.PI / 2
    gengarGroup.add(shadow)

    // Iniciar el reloj para la animación
    clock.current.start()

    // Función de renderizado
    const render = () => {
      timeout.current = requestAnimationFrame(render)

      const time = clock.current.getElapsedTime()

      // Animar a Gengar flotando arriba y abajo
      gengar.position.y = Math.sin(time * 2) * 0.2

      // Animar la escala de Gengar (respiración)
      const scale = 1 + Math.sin(time * 3) * 0.05
      gengar.scale.set(scale, scale, scale)

      // Animar la rotación de Gengar
      gengarGroup.rotation.y = Math.sin(time * 0.5) * 0.2

      // Animar la sombra
      shadow.scale.x = scale * 1.1
      shadow.scale.y = scale * 1.1
      shadow.opacity = 0.3 + Math.sin(time * 2) * 0.1

      // Animar el texto de carga
      loadingText.position.y = -2.2 + Math.sin(time * 2 + 1) * 0.1

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
    flex: 1,
    backgroundColor: "#121212",
  },
  glView: {
    flex: 1,
  },
})
