// app/camera.tsx
import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useGallery } from '@/lib/store/GalleryContext';
import { X, Camera, SwitchCamera, CheckCircle } from 'lucide-react-native';
import "@/global.css";

export default function CameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);

  // Usar el Context
  const { addPhoto } = useGallery();

  // Verificar permisos
  if (!permission) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <Text className="text-white text-lg">Cargando...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900 px-6">
        <Camera size={64} color="white" strokeWidth={1.5} className="mb-6" />
        <Text className="text-white text-center text-xl font-bold mb-3">
          Permiso de Cámara
        </Text>
        <Text className="text-gray-400 text-center text-base mb-8">
          Necesitamos acceso a tu cámara para tomar fotos
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-purple-600 px-8 py-4 rounded-xl flex-row items-center"
        >
          <CheckCircle size={24} color="white" className="mr-2" />
          <Text className="text-white font-bold text-lg">
            Permitir Acceso
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Función para tomar foto
  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      try {
        setIsCapturing(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        
        if (photo) {
          addPhoto(photo.uri);
          Alert.alert(
            'Foto Guardada',
            'La foto se guardó en tu galería',
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('Error al tomar foto:', error);
        Alert.alert('Error', 'No se pudo tomar la foto');
      } finally {
        setIsCapturing(false);
      }
    }
  };

  // Cambiar cámara frontal/trasera
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View className="flex-1 bg-black">
      {/* Botón cerrar */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-12 left-6 z-10 bg-black/50 p-3 rounded-full"
      >
        <X size={28} color="white" />
      </TouchableOpacity>

      {/* Info de cámara */}
      <View className="absolute top-12 right-6 z-10 bg-black/50 px-4 py-2 rounded-full">
        <Text className="text-white text-sm font-semibold">
          {facing === 'back' ? 'Trasera' : 'Frontal'}
        </Text>
      </View>

      {/* Vista de la cámara */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
      />

      {/* Controles */}
      <View className="absolute bottom-0 w-full pb-10 items-center">
        <View className="flex-row items-center justify-around w-full px-12">
          
          {/* Botón cambiar cámara */}
          <TouchableOpacity
            onPress={toggleCameraFacing}
            className="bg-white/30 p-4 rounded-full active:scale-95"
          >
            <SwitchCamera size={28} color="white" strokeWidth={2} />
          </TouchableOpacity>

          {/* Botón capturar */}
          <TouchableOpacity
            onPress={takePicture}
            disabled={isCapturing}
            className="bg-white w-20 h-20 rounded-full border-4 border-white shadow-xl active:scale-95"
            style={{ opacity: isCapturing ? 0.5 : 1 }}
          >
            <View className="flex-1 m-2 bg-white rounded-full" />
          </TouchableOpacity>

          {/* Espaciador para balance visual */}
          <View className="w-14" />
        </View>
      </View>
    </View>
  );
}