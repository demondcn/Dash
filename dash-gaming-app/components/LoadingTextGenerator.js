"use client"
import { CanvasTexture } from "three"

// Esta función crea una textura con el texto "CARGANDO..."
export const createLoadingTextTexture = async () => {
  // Crear un canvas
  const canvas = document.createElement("canvas")
  canvas.width = 512
  canvas.height = 128

  // Obtener el contexto 2D
  const context = canvas.getContext("2d")

  // Rellenar el fondo con transparente
  context.fillStyle = "rgba(0, 0, 0, 0)"
  context.fillRect(0, 0, canvas.width, canvas.height)

  // Configurar el texto
  context.font = "bold 72px Arial"
  context.fillStyle = "#8A2BE2" // Color púrpura para coincidir con el tema
  context.textAlign = "center"
  context.textBaseline = "middle"

  // Dibujar el texto con sombra
  context.shadowColor = "rgba(0, 0, 0, 0.5)"
  context.shadowBlur = 10
  context.shadowOffsetX = 5
  context.shadowOffsetY = 5
  context.fillText("CARGANDO...", canvas.width / 2, canvas.height / 2)

  // Crear una textura a partir del canvas
  const texture = new CanvasTexture(canvas)
  texture.needsUpdate = true

  return texture
}
