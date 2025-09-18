# 🔥 CRIFORGE

Portfolio 100% estático construido con Next.js (App Router, TypeScript) para mostrar trabajos de restauración fotográfica, edición y producción de video. El sitio se auto-genera desde una estructura de carpetas y se despliega en Vercel o GitHub Pages.

## ✨ Características

- **Tema Oscuro Moderno**: Estética roja/negra con fuentes Cinzel e Inter
- **Auto-Generación**: El contenido se escanea automáticamente desde la carpeta `/content`
- **Tres Tipos de Proyectos**:
  - **Restauraciones**: Slider Before/After para trabajos de restauración
  - **Ediciones**: Comparación Sources → Final con flecha animada
  - **Videos**: Reproductor de video + timeline de proceso
- **Timeline Interactivo**: Visualización paso a paso del proceso de cualquier proyecto
- **Hosting Estático**: Sin backend, se despliega en Vercel o GitHub Pages
- **Assets Remotos**: Soporte para archivos `.url` apuntando a Cloudinary/YouTube

## 📁 Estructura del Proyecto

```
/content
  /restores/NOMBRE-PROYECTO/
    before.jpg              # Imagen dañada/original
    after.jpg               # Imagen restaurada
    timeline/               # Pasos del proceso (opcional)
      01_Daño.jpg
      02_Reparacion.jpg
      03_Color.jpg
    info.yml               # Información del proyecto (opcional)
  
  /edits/NOMBRE-PROYECTO/
    sources/               # Imágenes fuente
      src1.jpg
      src2.jpg
    final/                 # Resultado final
      final.jpg
    timeline/              # Pasos del proceso (opcional)
      01_Base.jpg
      02_Composicion.jpg
    info.yml
  
  /videos/NOMBRE-PROYECTO/
    final.url              # URL de YouTube o archivo de video
    timeline/              # Pasos del proceso (opcional)
      01_CorteRough.url
      02_ColorGrading.url
    info.yml
```

## 🎯 Cómo Añadir Tus Proyectos

### 📸 Para Proyectos de Restauración

1. **Crea una carpeta** en `/content/restores/` con el nombre de tu proyecto:
   ```
   /content/restores/MI-RESTAURACION/
   ```

2. **Añade las imágenes requeridas**:
   - `before.jpg` - La imagen dañada/original
   - `after.jpg` - La imagen restaurada
   
   **Formatos soportados**: `.jpg`, `.jpeg`, `.png`, `.webp`
   **Nombres exactos**: Deben empezar con "before" y "after"

3. **Opcional - Añade proceso paso a paso**:
   ```
   timeline/
     01_Analisis.jpg     # Paso 1: Análisis del daño
     02_Limpieza.jpg     # Paso 2: Limpieza inicial
     03_Reparacion.jpg   # Paso 3: Reparación de grietas
     04_Color.jpg        # Paso 4: Corrección de color
   ```

### ✨ Para Proyectos de Edición

1. **Crea una carpeta** en `/content/edits/` con el nombre de tu proyecto:
   ```
   /content/edits/MI-EDICION/
   ```

2. **Añade las imágenes fuente** en la carpeta `sources/`:
   ```
   sources/
     imagen1.jpg
     imagen2.jpg
     imagen3.jpg
   ```

3. **Añade el resultado final** en la carpeta `final/`:
   ```
   final/
     resultado.jpg
   ```
   **Importante**: Solo una imagen en la carpeta final

### 🎬 Para Proyectos de Video

1. **Crea una carpeta** en `/content/videos/` con el nombre de tu proyecto:
   ```
   /content/videos/MI-VIDEO/
   ```

2. **Añade el video final** (dos opciones):
   
   **Opción A - Video en YouTube**:
   ```
   final.url
   ```
   Contenido del archivo: `https://youtu.be/TU_VIDEO_ID`
   
   **Opción B - Video local**:
   ```
   final.mp4
   ```

### 📋 Archivo de Información (Opcional)

Puedes añadir un archivo `info.yml` en cualquier proyecto para personalizar la información:

```yaml
title: "Restauración de Retrato Vintage"
subtitle: "Fotografía familiar de los años 1940"
steps:
  - n: 1
    title: "Análisis del Daño"
    note: "Evaluación de grietas, manchas y decoloración."
  - n: 2
    title: "Reparación Estructural"
    note: "Reconstrucción de áreas faltantes."
  - n: 3
    title: "Corrección de Color"
    note: "Restauración de tonos originales."
tags: [restauracion, vintage, retrato]
```

## 🚀 Instalación y Desarrollo

### Instalación Inicial
```bash
npm install
```

### Ejecutar en Desarrollo
```bash
npm run dev
```
El sitio estará disponible en `http://localhost:3000`

### Generar Sitio para Producción
```bash
npm run build    # Ejecuta scan.mjs y luego construye el sitio
npm run start    # Sirve la versión de producción
npm run export   # Exporta para GitHub Pages
```

## 📝 Flujo de Trabajo Recomendado

1. **Añade tus proyectos** siguiendo la estructura de carpetas
2. **Ejecuta el desarrollo**: `npm run dev`
3. **Verifica que todo se ve bien** en el navegador
4. **Construye para producción**: `npm run build`
5. **Despliega a Vercel** (recomendado) o GitHub Pages

## 🌐 Opciones de Despliegue

### Vercel (Recomendado) 🏆
1. **Conecta tu repositorio** de GitHub a Vercel
2. **No necesitas variables de entorno**
3. **Despliegues automáticos** en cada push
4. **Dominio gratuito** incluido

### GitHub Pages
1. Ejecuta `npm run export`
2. Despliega la carpeta `/out` a GitHub Pages
3. Configura GitHub Actions para builds automáticos

### 📤 Cloudinary para Imágenes Pesadas (Opcional)

Si tienes imágenes muy grandes:

1. **Regístrate gratis** en [Cloudinary](https://cloudinary.com)
2. **Sube tus archivos** multimedia
3. **Usa las URLs de Cloudinary** en archivos `.url`:
   ```
   https://res.cloudinary.com/tu-nombre-cloud/image/upload/v123456/tu-imagen.jpg
   ```

## 🔧 Personalización Avanzada

### Cambiar Colores del Tema
Edita `tailwind.config.js` en la sección `colors.inferno`:
```javascript
'inferno': {
  bg: '#000000',           // Fondo principal
  accent: '#ff0000',       // Color de acento (rojo)
  'accent-dark': '#cc0000' // Rojo más oscuro
}
```

### Modificar Fuentes
Cambia las fuentes en `app/layout.tsx`:
```javascript
import { TuFuente, OtraFuente } from 'next/font/google'
```

## 🔍 Proceso de Auto-Generación

El script `scripts/scan.mjs` hace lo siguiente automáticamente:
1. **Escanea** la carpeta `/content` buscando proyectos
2. **Detecta el tipo** de proyecto según la estructura de archivos
3. **Lee archivos `info.yml`** para obtener metadatos
4. **Procesa archivos timeline** en orden numérico
5. **Genera `app/_data/manifest.json`** con toda la información
6. **Ordena proyectos** por fecha de modificación (más recientes primero)

## 🎨 Componentes del Portfolio

- `components/BeforeAfter.tsx` - Slider antes/después con animación
- `components/ArrowCompare.tsx` - Comparación con flecha flotante animada
- `components/Timeline.tsx` - Timeline interactivo del proceso
- `components/Lightbox.tsx` - Lightbox para ver imágenes en grande

## 📱 Características de Rendimiento

- **Generación Estática**: Todas las páginas se construyen en build time
- **Optimización de Imágenes**: Componente Image de Next.js optimizado
- **Prefetching**: Carga automática de links para navegación instantánea
- **Componentes Cliente**: Solo elementos interactivos usan JavaScript
- **Responsive**: Diseño adaptado para móviles y tablets
- **Accesibilidad**: Navegación por teclado incluida

## 🆘 Solución de Problemas

### El proyecto no aparece en la web
- ✅ Verifica que tienes los archivos requeridos (`before.jpg` + `after.jpg` para restauraciones)
- ✅ Ejecuta `npm run dev` para regenerar el manifest
- ✅ Revisa la consola por errores

### Las imágenes no se ven
- ✅ Verifica que los nombres de archivo son correctos
- ✅ Asegúrate de que las imágenes están en las carpetas correctas
- ✅ Comprueba que los formatos son soportados (jpg, png, webp)

### La flecha animada no se ve
- ✅ Verifica que tienes tanto `sources/` como `final/` en proyectos de edición
- ✅ Recarga la página completamente

## 📄 Licencia

Este proyecto es open source y está disponible bajo la Licencia MIT.
