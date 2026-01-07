// app/gallery.tsx
import { useGallery } from '@/lib/store/GalleryContext';
import { useRouter } from 'expo-router';
import "@/global.css";
import { ArrowLeft, ImageOff, Trash2 } from 'lucide-react-native';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function GalleryScreen() {
  const router = useRouter();
  const { photos, removePhoto } = useGallery();

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="pt-12 pb-4 px-6 bg-white shadow-sm flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-800">
            Galería
          </Text>
        </View>
        <View className="bg-purple-100 px-3 py-1 rounded-full">
          <Text className="text-purple-700 font-bold">
            {photos.length}
          </Text>
        </View>
      </View>

      {/* Contenido */}
      {photos.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <ImageOff size={80} color="#9ca3af" strokeWidth={1.5} />
          <Text className="text-xl font-bold text-gray-700 mt-6 mb-2">
            No hay fotos aún
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Ve a la cámara y captura tus primeros momentos
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
      ) : (
        <ScrollView className="flex-1 p-4">
          <Text className="text-gray-600 text-sm mb-4 px-2">
            Próximamente: Desliza las fotos para decidir si las guardas o las eliminas
          </Text>
          
          {photos.map((photo) => (
            <View key={photo.id} className="mb-4 bg-white rounded-xl overflow-hidden shadow-md">
              <Image
                source={{ uri: photo.uri }}
                className="w-full h-80"
                resizeMode="cover"
              />
              <View className="p-3 flex-row justify-between items-center">
                <Text className="text-gray-600 text-xs">
                  {new Date(photo.timestamp).toLocaleString()}
                </Text>
                <TouchableOpacity
                  onPress={() => removePhoto(photo.id)}
                  className="bg-red-50 p-2 rounded-lg flex-row items-center"
                >
                  <Trash2 size={16} color="#ef4444" strokeWidth={2} />
                  <Text className="text-red-500 font-semibold text-xs ml-1">
                    Eliminar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}