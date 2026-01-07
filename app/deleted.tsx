// app/deleted.tsx
import { View, Text, TouchableOpacity, Image, ScrollView, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useGallery } from '@/lib/store/GalleryContext';
import { ArrowLeft, Trash2, RotateCcw, X } from 'lucide-react-native';

export default function DeletedScreen() {
  const router = useRouter();
  const { deletedPhotos, removePhoto, restorePhoto, clearAll } = useGallery();

  const handlePermanentDelete = (id: string) => {
    Alert.alert(
      'Eliminar permanentemente',
      'Esta acción no se puede deshacer',
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
          onPress: () => restorePhoto(id, true),
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (deletedPhotos.length === 0) return;
    
    Alert.alert(
      'Vaciar papelera',
      `¿Eliminar permanentemente todas las ${deletedPhotos.length} fotos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Vaciar',
          style: 'destructive',
          onPress: () => {
            deletedPhotos.forEach(photo => removePhoto(photo.id));
          },
        },
      ]
    );
  };

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
            <Trash2 size={24} color="#ef4444" strokeWidth={2} className="mr-2" />
            <Text className="text-2xl font-bold text-gray-800">
              Papelera
            </Text>
          </View>
          <View className="bg-red-100 px-3 py-1 rounded-full">
            <Text className="text-red-700 font-bold">
              {deletedPhotos.length}
            </Text>
          </View>
        </View>

        {deletedPhotos.length > 0 && (
          <TouchableOpacity
            onPress={handleClearAll}
            className="bg-red-50 py-2 px-4 rounded-lg flex-row items-center justify-center"
          >
            <X size={16} color="#ef4444" strokeWidth={2} />
            <Text className="text-red-600 font-semibold text-sm ml-2">
              Vaciar papelera ({deletedPhotos.length})
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Contenido */}
      {deletedPhotos.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Trash2 size={80} color="#9ca3af" strokeWidth={1.5} />
          <Text className="text-xl font-bold text-gray-700 mt-6 mb-2">
            La papelera está vacía
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Las fotos que elimines aparecerán aquí temporalmente
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/gallery')}
            className="bg-red-600 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-bold">
              Revisar Fotos
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView className="flex-1 p-4">
          <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 flex-row items-start">
            <Text className="text-yellow-800 text-sm flex-1">
              Las fotos en la papelera pueden ser restauradas o eliminadas permanentemente
            </Text>
          </View>
          
          {deletedPhotos.map((photo) => (
            <View key={photo.id} className="mb-4 bg-white rounded-xl overflow-hidden shadow-md">
              <View className="relative">
                <Image
                  source={{ uri: photo.uri }}
                  className="w-full h-80"
                  resizeMode="cover"
                  style={{ opacity: 0.7 }}
                />
                <View className="absolute inset-0 bg-black/20 items-center justify-center">
                  <View className="bg-red-500/90 px-4 py-2 rounded-lg">
                    <Text className="text-white font-bold">ELIMINADA</Text>
                  </View>
                </View>
              </View>
              
              <View className="p-3">
                <Text className="text-gray-600 text-xs mb-3">
                  {new Date(photo.timestamp).toLocaleString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                
                <View className="flex-row gap-2">
                  {/* Botón Restaurar */}
                  <TouchableOpacity
                    onPress={() => handleRestore(photo.id)}
                    className="flex-1 bg-blue-50 py-3 rounded-lg flex-row items-center justify-center"
                  >
                    <RotateCcw size={16} color="#3b82f6" strokeWidth={2} />
                    <Text className="text-blue-600 font-semibold text-sm ml-2">
                      Restaurar
                    </Text>
                  </TouchableOpacity>

                  {/* Botón Eliminar Permanente */}
                  <TouchableOpacity
                    onPress={() => handlePermanentDelete(photo.id)}
                    className="flex-1 bg-red-50 py-3 rounded-lg flex-row items-center justify-center"
                  >
                    <X size={16} color="#ef4444" strokeWidth={2} />
                    <Text className="text-red-600 font-semibold text-sm ml-2">
                      Eliminar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}