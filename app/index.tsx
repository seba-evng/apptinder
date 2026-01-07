// app/index.tsx
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Image as ImageIcon, Archive, Trash2 } from 'lucide-react-native';
import { useGallery } from '@/lib/store/GalleryContext';
import "@/global.css";

export default function HomeScreen() {
  const router = useRouter();
  const { pendingPhotos, savedPhotos, deletedPhotos } = useGallery();

  return (
    <View className="flex-1 bg-gradient-to-br from-purple-50 to-pink-50">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="pt-16 px-6">
        <View className="flex-row items-center mb-2">
          <Camera size={40} color="#7c3aed" strokeWidth={2} />
          <Text className="text-5xl font-extrabold text-gray-800 ml-3">
            Snap & Swipe
          </Text>
        </View>
        <Text className="text-gray-600 text-lg">
          Captura momentos y desliza para decidir
        </Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 justify-center items-center px-6">
        
        {/* Stats Cards */}
        <View className="w-full mb-8 space-y-3">
          {/* Pendientes */}
          <View className="bg-white rounded-2xl p-4 shadow-lg flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="bg-purple-100 p-3 rounded-full">
                <ImageIcon size={24} color="#7c3aed" strokeWidth={2} />
              </View>
              <View className="ml-3">
                <Text className="text-gray-600 text-sm">Por revisar</Text>
                <Text className="text-2xl font-bold text-purple-600">
                  {pendingPhotos.length}
                </Text>
              </View>
            </View>
          </View>

          {/* Guardadas */}
          <View className="bg-white rounded-2xl p-4 shadow-lg flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="bg-green-100 p-3 rounded-full">
                <Archive size={24} color="#10b981" strokeWidth={2} />
              </View>
              <View className="ml-3">
                <Text className="text-gray-600 text-sm">Guardadas</Text>
                <Text className="text-2xl font-bold text-green-600">
                  {savedPhotos.length}
                </Text>
              </View>
            </View>
          </View>

          {/* Eliminadas */}
          <View className="bg-white rounded-2xl p-4 shadow-lg flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="bg-red-100 p-3 rounded-full">
                <Trash2 size={24} color="#ef4444" strokeWidth={2} />
              </View>
              <View className="ml-3">
                <Text className="text-gray-600 text-sm">Eliminadas</Text>
                <Text className="text-2xl font-bold text-red-600">
                  {deletedPhotos.length}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Botón Cámara */}
        <TouchableOpacity
          onPress={() => router.push('/camera')}
          className="bg-purple-600 w-full py-6 rounded-2xl mb-4 flex-row items-center justify-center shadow-xl active:scale-95"
          style={{ elevation: 5 }}
        >
          <Camera size={28} color="white" strokeWidth={2.5} />
          <Text className="text-white text-xl font-bold ml-3">
            Abrir Cámara
          </Text>
        </TouchableOpacity>

        {/* Botón Revisar Fotos */}
        <TouchableOpacity
          onPress={() => router.push('/gallery')}
          className="bg-pink-500 w-full py-6 rounded-2xl mb-3 flex-row items-center justify-center shadow-xl active:scale-95"
          style={{ elevation: 5 }}
        >
          <ImageIcon size={28} color="white" strokeWidth={2.5} />
          <Text className="text-white text-xl font-bold ml-3">
            Revisar Fotos ({pendingPhotos.length})
          </Text>
        </TouchableOpacity>

        {/* Botones Guardadas y Eliminadas */}
        <View className="w-full flex-row gap-3">
          <TouchableOpacity
            onPress={() => router.push('/saved')}
            className="flex-1 bg-green-500 py-4 rounded-2xl flex-row items-center justify-center shadow-lg active:scale-95"
            style={{ elevation: 3 }}
          >
            <Archive size={22} color="white" strokeWidth={2.5} />
            <Text className="text-white text-base font-bold ml-2">
              Guardadas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/deleted')}
            className="flex-1 bg-red-500 py-4 rounded-2xl flex-row items-center justify-center shadow-lg active:scale-95"
            style={{ elevation: 3 }}
          >
            <Trash2 size={22} color="white" strokeWidth={2.5} />
            <Text className="text-white text-base font-bold ml-2">
              Eliminadas
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View className="pb-8 px-6">
        <Text className="text-center text-gray-500 text-xs">
          Desliza derecha para guardar | Desliza izquierda para eliminar
        </Text>
      </View>
    </View>
  );
}