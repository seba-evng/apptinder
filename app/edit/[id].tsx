// app/edit/[id].tsx
import { Photo, useGallery } from '@/lib/store/GalleryContext';
import { usePhotoGestures } from '@/lib/ui/usePhotoGestures';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ArrowLeft,
    Check,
    Crop,
    Info,
    RotateCcw,
    RotateCw,
    RotateCcw as RotateLeft,
    Save,
    X as XIcon,
    ZoomIn,
    ZoomOut
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Animated, Dimensions, StatusBar, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function EditPhotoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { savedPhotos, updatePhotoTransform } = useGallery();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [cropMode, setCropMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const { panResponder, animatedStyle, reset, getCurrentValues, zoomIn, zoomOut, rotateLeft, rotateRight } = usePhotoGestures({
    initialTransform: photo?.transform,
    onGestureStart: () => setHasChanges(true),
  });

  useEffect(() => {
    const foundPhoto = savedPhotos.find((p) => p.id === id);
    if (foundPhoto) {
      setPhoto(foundPhoto);
    } else {
      Alert.alert('Error', 'Foto no encontrada');
      router.back();
    }
  }, [id, savedPhotos]);

  const handleSave = () => {
    if (!photo) return;
    
    const values = getCurrentValues();
    updatePhotoTransform(photo.id, values);
    setHasChanges(false);
    
    Alert.alert(
      'Guardado',
      'Los cambios se han guardado correctamente',
      [
        {
          text: 'Ver galería',
          onPress: () => router.push('/saved'),
        },
        {
          text: 'Seguir editando',
          style: 'cancel',
        },
      ]
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Resetear cambios',
      '¿Quieres deshacer todas las transformaciones?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetear',
          onPress: () => {
            reset();
            setHasChanges(true);
          },
        },
      ]
    );
  };

  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        'Cambios sin guardar',
        '¿Quieres salir sin guardar los cambios?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Salir',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  const handleCrop = () => {
    if (cropMode) {
      Alert.alert(
        'Recorte',
        'Función de recorte en desarrollo. Por ahora solo se guardan las transformaciones.',
        [{ text: 'OK' }]
      );
      setCropMode(false);
    } else {
      setCropMode(true);
    }
  };

  if (!photo) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center">
        <Text className="text-white text-lg">Cargando...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="pt-12 pb-4 px-6 flex-row items-center justify-between">
        <TouchableOpacity onPress={handleBack}>
          <ArrowLeft size={28} color="white" strokeWidth={2} />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <Text className="text-white text-xl font-bold">Editor</Text>
          {hasChanges && (
            <View className="ml-2 bg-yellow-500 w-2 h-2 rounded-full" />
          )}
        </View>
        <TouchableOpacity onPress={() => setShowInfo(!showInfo)}>
          <Info size={28} color="white" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Info Panel */}
      {showInfo && (
        <View className="mx-6 mb-4 bg-purple-900/80 rounded-xl p-4">
          <Text className="text-white font-bold mb-2">Controles disponibles:</Text>
          <View className="space-y-2">
            <Text className="text-white text-sm">• Arrastra con un dedo para mover</Text>
            <Text className="text-white text-sm">• Usa los botones para zoom y rotación</Text>
            <Text className="text-white text-sm">• Guarda los cambios antes de salir</Text>
          </View>
        </View>
      )}

      {/* Canvas de edición */}
      <View className="flex-1 items-center justify-center">
        {cropMode && (
          <View className="absolute inset-0 z-10 items-center justify-center">
            <View 
              className="border-2 border-white"
              style={{
                width: SCREEN_WIDTH - 80,
                height: SCREEN_HEIGHT * 0.5,
                borderRadius: 16,
              }}
            />
            <View 
              className="absolute inset-0 bg-black/50"
              pointerEvents="none"
            />
          </View>
        )}
        
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            {
              width: SCREEN_WIDTH - 40,
              height: SCREEN_HEIGHT * 0.6,
            },
            animatedStyle,
          ]}
        >
          <Animated.Image
            source={{ uri: photo.uri }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 16,
            }}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      {/* Información de la foto */}
      <View className="px-6 py-3 bg-gray-800/50">
        <Text className="text-white text-xs text-center">
          {new Date(photo.timestamp).toLocaleString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        {photo.transform && (
          <Text className="text-gray-400 text-xs text-center mt-1">
            Editada • Zoom: {photo.transform.scale.toFixed(2)}x
          </Text>
        )}
      </View>

      {/* Controles */}
      <View className="pb-8 px-6">
        {cropMode ? (
          <View className="flex-row justify-center gap-4 mb-4">
            <TouchableOpacity
              onPress={() => setCropMode(false)}
              className="bg-gray-700 px-6 py-4 rounded-2xl flex-row items-center flex-1"
            >
              <XIcon size={20} color="white" strokeWidth={2} />
              <Text className="text-white font-bold ml-2">Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCrop}
              className="bg-green-600 px-6 py-4 rounded-2xl flex-row items-center flex-1"
            >
              <Check size={20} color="white" strokeWidth={2} />
              <Text className="text-white font-bold ml-2">Aplicar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Botones de transformación */}
            <View className="flex-row justify-center gap-3 mb-3">
              <TouchableOpacity
                onPress={zoomOut}
                className="bg-gray-700 p-4 rounded-xl"
              >
                <ZoomOut size={24} color="white" strokeWidth={2} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={zoomIn}
                className="bg-gray-700 p-4 rounded-xl"
              >
                <ZoomIn size={24} color="white" strokeWidth={2} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={rotateLeft}
                className="bg-gray-700 p-4 rounded-xl"
              >
                <RotateLeft size={24} color="white" strokeWidth={2} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={rotateRight}
                className="bg-gray-700 p-4 rounded-xl"
              >
                <RotateCw size={24} color="white" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* Botones principales */}
            <View className="flex-row justify-center gap-3 mb-4">
              <TouchableOpacity
                onPress={handleReset}
                className="bg-gray-700 px-4 py-3 rounded-xl flex-row items-center"
              >
                <RotateCcw size={18} color="white" strokeWidth={2} />
                <Text className="text-white font-semibold text-sm ml-2">Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCrop}
                className="bg-blue-600 px-4 py-3 rounded-xl flex-row items-center"
              >
                <Crop size={18} color="white" strokeWidth={2} />
                <Text className="text-white font-semibold text-sm ml-2">Recortar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                className="bg-purple-600 px-6 py-3 rounded-xl flex-row items-center flex-1"
              >
                <Save size={18} color="white" strokeWidth={2} />
                <Text className="text-white font-bold text-sm ml-2">Guardar</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <Text className="text-gray-400 text-xs text-center">
          {cropMode 
            ? 'Ajusta la imagen dentro del marco'
            : 'Arrastra para mover • Usa botones para zoom/rotar'
          }
        </Text>
      </View>
    </View>
  );
}