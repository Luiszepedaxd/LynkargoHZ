# Instrucciones para Crear Favicon de Lynkargo

## Archivos Necesarios

Para completar la configuración del favicon, necesitas crear los siguientes archivos en la carpeta `public/` con tu logotipo de Lynkargo:

### Archivos Requeridos:
1. **favicon.ico** - 48x48px o 32x32px (formato ICO)
2. **favicon-16x16.png** - 16x16px (formato PNG)
3. **favicon-32x32.png** - 32x32px (formato PNG)
4. **apple-touch-icon.png** - 180x180px (formato PNG)
5. **android-chrome-192x192.png** - 192x192px (formato PNG)
6. **android-chrome-512x512.png** - 512x512px (formato PNG)
7. **og-image.jpg** - 1200x630px (formato JPG para redes sociales)

## Herramientas Recomendadas

### Opción 1: Generadores Online
- **RealFaviconGenerator**: https://realfavicongenerator.net/
- **Favicon.io**: https://favicon.io/
- **Canva**: https://www.canva.com/create/favicons/

### Opción 2: Herramientas Locales
- **ImageMagick** (línea de comandos)
- **GIMP** (gratuito)
- **Adobe Photoshop**

## Pasos para Crear

1. **Diseña tu favicon base** (mínimo 512x512px para mejor calidad)
2. **Usa un generador online** subiendo tu logotipo
3. **Descarga todos los archivos generados**
4. **Coloca los archivos en la carpeta `public/`**
5. **Reemplaza el `favicon.svg` temporal** que creé con tu versión final

## Configuración Completada

✅ **Metadata API de Next.js 15** - Configurada con todos los metadatos necesarios
✅ **Open Graph y Twitter Cards** - Para redes sociales
✅ **Structured Data (JSON-LD)** - Para mejor SEO
✅ **Web App Manifest** - Para instalación como PWA
✅ **Componente StructuredData** - Siguiendo principios SOLID

## Verificación

Después de crear los archivos:
1. Ejecuta `npm run dev`
2. Verifica que el favicon aparezca en la pestaña del navegador
3. Usa herramientas como Google's Rich Results Test para verificar el SEO
4. Despliega en Vercel para que Google pueda indexar el nuevo favicon

## Notas Importantes

- Los cambios en Google pueden tardar días o semanas en aparecer
- Asegúrate de que todos los archivos tengan el fondo transparente o el color correcto
- El favicon debe ser simple y legible en tamaños pequeños
- Considera usar el azul corporativo (#2563eb) como color principal
