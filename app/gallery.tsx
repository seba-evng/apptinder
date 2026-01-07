// app/gallery.tsx
import { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useGallery } from '@/lib/store/GalleryContext';
import { ArrowLeft, ImageOff, Heart, X, RotateCcw } from 'lucide-react-native';
import { SwipeablePhoto } from '@/components/organisms/SwipeablePhoto';
import { Photo } from '@/lib/store/GalleryContext';
import "@/global.css";

export default function GalleryScreen() {
  const router = useRouter();
  const { pendingPhotos, savePhoto, deletePhoto } = useGallery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [deletedCount, setDeletedCount] = useState(0);

  const handleSwipeLeft = (photo: Photo) => {
    setDeletedCount(deletedCount + 1);
    deletePhoto(photo.id);
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
    }, 300);
  };

  const handleSwipeRight = (photo: Photo) => {
    setSavedCount(savedCount + 1);
    savePhoto(photo.id);
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
    }, 300);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSavedCount(0);
    setDeletedCount(0);
  };

  const currentPhoto = pendingPhotos[currentIndex];
  const remainingPhotos = pendingPhotos.length - currentIndex;

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="pt-12 pb-4 px-6 bg-white shadow-sm">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-800">
              Revisar Fotos
            </Text>
          </View>
        </View>

        {/* Stats */}
        {pendingPhotos.length > 0 && (
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-gray-500 text-xs mb-1">Guardadas</Text>
              <Text className="text-green-600 font-bold text-lg">{savedCount}</Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-500 text-xs mb-1">Restantes</Text>
              <Text className="text-purple-600 font-bold text-lg">{remainingPhotos}</Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-500 text-xs mb-1">Eliminadas</Text>
              <Text className="text-red-600 font-bold text-lg">{deletedCount}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Contenido */}
      {pendingPhotos.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <ImageOff size={80} color="#9ca3af" strokeWidth={1.5} />
          <Text className="text-xl font-bold text-gray-700 mt-6 mb-2">
            No hay fotos pendientes
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Ve a la cámara y captura nuevos momentos
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/camera')}
            className="bg-purple-600 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-bold">
              Abrir Cámara
            </Text>
          </TouchableOpacity>
        </View>
      ) : currentIndex >= pendingPhotos.length ? (
        <View className="flex-1 justify-center items-center px-6">
          <View className="bg-purple-100 rounded-full p-6 mb-6">
            <Heart size={60} color="#7c3aed" fill="#7c3aed" />
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-3">
            Has revisado todas las fotos
          </Text>
          <Text className="text-gray-600 text-center mb-8">
            Guardaste {savedCount} y eliminaste {deletedCount} fotos
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={handleReset}
              className="bg-purple-600 px-6 py-3 rounded-xl flex-row items-center"
            >
              <RotateCcw size={20} color="white" strokeWidth={2} />
              <Text className="text-white font-bold ml-2">
                Reiniciar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-gray-600 px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-bold">
                Volver
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          {/* Cards Container */}
          <View className="flex-1 items-center justify-center">
            {currentPhoto && (
              <SwipeablePhoto
                key={currentPhoto.id}
                photo={currentPhoto}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
              />
            )}
          </View>

          {/* Action Buttons */}
          <View className="pb-8 px-6">
            <View className="flex-row justify-center items-center gap-8">
              <TouchableOpacity
                onPress={() => handleSwipeLeft(currentPhoto)}
                className="bg-white rounded-full p-5 shadow-lg active:scale-95"
              >
                <X size={32} color="#ef4444" strokeWidth={3} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSwipeRight(currentPhoto)}
                className="bg-white rounded-full p-5 shadow-lg active:scale-95"
              >
                <Heart size={32} color="#10b981" strokeWidth={3} />
              </TouchableOpacity>
            </View>
            <Text className="text-center text-gray-500 text-xs mt-4">
              Desliza o usa los botones para decidir
            </Text>
          </View>
        </>
      )}
    </View>
  );
}