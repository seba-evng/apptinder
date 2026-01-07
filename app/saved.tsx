// app/saved.tsx
import "@/global.css";
import { useGallery } from '@/lib/store/GalleryContext';
import { useRouter } from 'expo-router';
import { Archive, ArrowLeft, Edit3, RotateCcw, Trash2 } from 'lucide-react-native';
import { Alert, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

export default function SavedScreen() {
  const router = useRouter();
  const { savedPhotos, removePhoto, restorePhoto } = useGallery();

  const handleDelete = (id: string) => {
    Alert.alert(
      'Eliminar foto',
      '¿Estás seguro de eliminar esta foto permanentemente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => removePhoto(id),
        },
      ]
    );
  };

  const handleRestore = (id: string) => {
    Alert.alert(
      'Restaurar foto',
      '¿Quieres mover esta foto de vuelta a pendientes?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restaurar',
          onPress: () => restorePhoto(id, false),
        },
      ]
    );
  };

  const handleEdit = (id: string) => {
    router.push(`/edit/${id}`);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="pt-12 pb-4 px-6 bg-white shadow-sm">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
            <Archive size={24} color="#10b981" strokeWidth={2} className="mr-2" />
            <Text className="text-2xl font-bold text-gray-800">
              Fotos Guardadas
            </Text>
          </View>
          <View className="bg-green-100 px-3 py-1 rounded-full">
            <Text className="text-green-700 font-bold">
              {savedPhotos.length}
            </Text>
          </View>
        </View>
      </View>

      {/* Contenido */}
      {savedPhotos.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Archive size={80} color="#9ca3af" strokeWidth={1.5} />
          <Text className="text-xl font-bold text-gray-700 mt-6 mb-2">
            No hay fotos guardadas
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Las fotos que marques como favoritas aparecerán aquí
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/gallery')}
            className="bg-green-600 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-bold">
              Revisar Fotos
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView className="flex-1 p-4">
          <Text className="text-gray-600 text-sm mb-4 px-2">
            Toca el ícono de lápiz para editar una foto
          </Text>
          
          {savedPhotos.map((photo) => {
            // Aplicar transformaciones guardadas
            const animatedStyle = useAnimatedStyle(() => {
              if (!photo.transform) return {};
              return {
                transform: [
                  { translateX: photo.transform.translateX },
                  { translateY: photo.transform.translateY },
                  { scale: photo.transform.scale },
                  { rotateZ: `${photo.transform.rotation}rad` },
                ],
              };
            });

            return (
              <View key={photo.id} className="mb-4 bg-white rounded-xl overflow-hidden shadow-md">
                <View className="overflow-hidden h-80 bg-gray-900">
                  <Animated.Image
                    source={{ uri: photo.uri }}
                    className="w-full h-full"
                    style={[{ resizeMode: 'contain' }, animatedStyle]}
                  />
                </View>
                
                <View className="p-3">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-gray-600 text-xs">
                      {new Date(photo.timestamp).toLocaleString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                    {photo.transform && (
                      <View className="bg-purple-100 px-2 py-1 rounded">
                        <Text className="text-purple-700 text-xs font-semibold">
                          Editada
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  {photo.transform && (
                    <Text className="text-gray-500 text-xs mb-3">
                      Zoom: {photo.transform.scale.toFixed(2)}x • 
                      Rotación: {(photo.transform.rotation * 180 / Math.PI).toFixed(0)}°
                    </Text>
                  )}
                  
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => handleEdit(photo.id)}
                      className="flex-1 bg-purple-50 py-3 rounded-lg flex-row items-center justify-center"
                    >
                      <Edit3 size={16} color="#7c3aed" strokeWidth={2} />
                      <Text className="text-purple-600 font-semibold text-sm ml-2">
                        Editar
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleRestore(photo.id)}
                      className="flex-1 bg-blue-50 py-3 rounded-lg flex-row items-center justify-center"
                    >
                      <RotateCcw size={16} color="#3b82f6" strokeWidth={2} />
                      <Text className="text-blue-600 font-semibold text-sm ml-2">
                        Restaurar
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDelete(photo.id)}
                      className="bg-red-50 py-3 px-4 rounded-lg flex-row items-center justify-center"
                    >
                      <Trash2 size={16} color="#ef4444" strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}