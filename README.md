# 📸 Snap & Swipe

Una aplicación móvil moderna para capturar, gestionar y editar fotos con gestos intuitivos. Desarrollada con React Native, Expo y NativeWind.

## 🎬 Demo

![Image](https://github.com/user-attachments/assets/4dbccb96-659b-4cce-88c9-d53f037b6bbe)

---

## ✨ Características

### 📷 Captura de Fotos
- Cámara integrada con permisos nativos
- Cambio entre cámara frontal y trasera
- Vista previa en tiempo real

### 🔄 Sistema de Swipe
- Desliza derecha para **guardar** fotos
- Desliza izquierda para **eliminar** fotos
- Animaciones suaves estilo Tinder
- Indicadores visuales durante el gesto

### 🗂️ Gestión de Galería
- **Fotos Pendientes**: Por revisar y clasificar
- **Fotos Guardadas**: Tus favoritas con edición
- **Papelera**: Fotos eliminadas recuperables

### 🎨 Editor de Fotos
- **Arrastrar**: Mueve la imagen con un dedo
- **Zoom**: Botones de acercar/alejar (0.5x - 4x)
- **Rotación**: Gira en incrementos de 45°
- **Reset**: Vuelve a valores originales
- Modo recorte visual

### 🎯 Funcionalidades Extra
- Restaurar fotos desde guardadas/eliminadas
- Contador de fotos por categoría
- Timestamps de captura
- Persistencia de ediciones
- Alertas de confirmación

---

## 🛠️ Stack Tecnológico

- **Framework**: [React Native](https://reactnative.dev/)
- **Plataforma**: [Expo](https://expo.dev/) (SDK 52+)
- **Navegación**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Estilos**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
- **Cámara**: [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- **Gestos**: React Native Animated + PanResponder
- **Iconos**: [Lucide React Native](https://lucide.dev/)
- **Estado**: Context API

---

## 📁 Estructura del Proyecto

```
snap-swipe-app/
├── app/                      # Pantallas (Expo Router)
│   ├── _layout.tsx          # Layout principal
│   ├── index.tsx            # Menú principal
│   ├── camera.tsx           # Pantalla de cámara
│   ├── gallery.tsx          # Revisión con swipe
│   ├── saved.tsx            # Fotos guardadas
│   ├── deleted.tsx          # Papelera
│   └── edit/
│       └── [id].tsx         # Editor de fotos
├── components/
│   └── organisms/
│       └── SwipeablePhoto.tsx  # Tarjeta con gesto
├── lib/
│   ├── store/
│   │   └── GalleryContext.tsx  # Estado global
│   └── ui/
│       ├── useSwipeLogic.ts    # Hook de swipe
│       └── usePhotoGestures.ts # Hook de edición
└── assets/                  # Recursos estáticos
```

---

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Expo CLI
- Expo Go (para testing en dispositivo)

### Pasos

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd snap-swipe-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar NativeWind**

Ya está configurado en `babel.config.js` y `tailwind.config.js`.

4. **Iniciar el proyecto**
```bash
npx expo start
```

5. **Escanear QR** con Expo Go (iOS/Android)

---

## 📦 Dependencias Principales

```json
{
  "expo": "~52.0.0",
  "expo-camera": "~16.0.0",
  "expo-router": "~4.0.0",
  "react-native": "0.76.0",
  "nativewind": "^4.0.0",
  "lucide-react-native": "latest"
}
```

---

## ⚙️ Configuración Importante

### Permisos de Cámara (`app.json`)

```json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Permite acceso para tomar fotos.",
          "microphonePermission": "Permite acceso para grabar video."
        }
      ]
    ]
  }
}
```

### Babel Config

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

---

## 🎮 Uso de la App

### 1. Capturar Fotos
- Abre la app y presiona **"Abrir Cámara"**
- Toma fotos con el botón central
- Cambia entre cámara frontal/trasera

### 2. Revisar Fotos
- Presiona **"Revisar Fotos"**
- Desliza **→** para guardar
- Desliza **←** para eliminar
- O usa los botones inferiores

### 3. Editar Fotos Guardadas
- Ve a **"Guardadas"**
- Toca el icono de **lápiz**
- Arrastra para mover
- Usa botones de zoom/rotación
- Presiona **"Guardar"**

### 4. Gestionar Eliminadas
- Ve a **"Eliminadas"**
- Restaura fotos o elimínalas permanentemente
- Usa **"Vaciar papelera"** para limpiar todo

---

## 🏗️ Arquitectura

### Context API para Estado Global

```typescript
interface GalleryContextType {
  pendingPhotos: Photo[];      // Por revisar
  savedPhotos: Photo[];         // Guardadas
  deletedPhotos: Photo[];       // Eliminadas
  addPhoto: (uri: string) => void;
  savePhoto: (id: string) => void;
  deletePhoto: (id: string) => void;
  updatePhotoTransform: (id: string, transform: PhotoTransform) => void;
}
```

### Tipo de Foto

```typescript
interface Photo {
  id: string;
  uri: string;
  timestamp: number;
  transform?: PhotoTransform;   // Ediciones aplicadas
}
```

**⭐ Si te gustó este proyecto, dale una estrella en GitHub!**
