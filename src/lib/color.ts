export function getForegroundColor(hexBackground: string): string | null {
  // Convert hex background color to RGB
  const rgbBackground = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    hexBackground,
  )
  if (!rgbBackground) {
    console.error('Invalid hex color:', hexBackground)
    return '#FF00FF'
  }

  const rgb = {
    r: parseInt(rgbBackground[1], 16),
    g: parseInt(rgbBackground[2], 16),
    b: parseInt(rgbBackground[3], 16),
  }

  // Calculate perceived brightness
  const brightness = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255

  // Choose foreground color based on brightness
  return brightness > 0.5 ? '#000000' : '#FFFFFF'
}
