#!/usr/bin/env python3
"""
Generador de iconos para el ERP Constructora
"""
import os
from PIL import Image, ImageDraw, ImageFont

# Crear carpeta de iconos si no existe
icons_dir = os.path.join(os.path.dirname(__file__), 'assets', 'icons')
os.makedirs(icons_dir, exist_ok=True)

def create_icon(size):
    """Crear un icono PNG con el logo G&H"""
    # Crear imagen con fondo azul
    img = Image.new('RGB', (size, size), color='#2563eb')
    draw = ImageDraw.Draw(img)
    
    # Intentar usar una fuente, si no está disponible usar la fuente por defecto
    try:
        font_size = int(size * 0.5)
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    # Dibujar texto "G&H"
    text = "G&H"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (size - text_width) // 2
    y = (size - text_height) // 2
    
    draw.text((x, y), text, fill='white', font=font)
    
    # Guardar imagen
    filename = f'icon-{size}x{size}.png'
    filepath = os.path.join(icons_dir, filename)
    img.save(filepath)
    print(f"✓ Icono creado: {filepath}")
    return filepath

# Crear iconos de diferentes tamaños
sizes = [32, 144, 152, 192]
for size in sizes:
    try:
        create_icon(size)
    except Exception as e:
        print(f"✗ Error al crear icono {size}x{size}: {e}")

print("\n✓ Todos los iconos han sido creados exitosamente")
