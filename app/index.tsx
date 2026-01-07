// app/index.tsx
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import "@/global.css";
import { Camera, Image as ImageIcon, Sparkles } from 'lucide-react-native';
import { useGallery } from '@/lib/store/GalleryContext';

export default function HomeScreen() {
  const router = useRouter();
  const { photos } = useGallery();

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
        
        {/* Stats Card */}
        <View className="bg-white rounded-2xl p-6 mb-8 w-full shadow-lg">
          <Text className="text-center text-gray-600 text-base mb-2">
            Fotos en galería
          </Text>
          <Text className="text-center text-5xl font-bold text-purple-600">
            {photos.length}
          </Text>
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

        {/* Botón Galería */}
        <TouchableOpacity
          onPress={() => router.push('/gallery')}
          className="bg-pink-500 w-full py-6 rounded-2xl flex-row items-center justify-center shadow-xl active:scale-95"
          style={{ elevation: 5 }}
        >
          <ImageIcon size={28} color="white" strokeWidth={2.5} />
          <Text className="text-white text-xl font-bold ml-3">
            Ver Galería
          </Text>
        </TouchableOpacity>

        {/* Info adicional */}
        {photos.length === 0 && (
          <View className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex-row items-center">
            <Sparkles size={20} color="#92400e" className="mr-2" />
            <Text className="text-yellow-800 text-sm flex-1">
              Toma tu primera foto para comenzar
            </Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View className="pb-8 px-6">
        <Text className="text-center text-gray-500 text-xs">
          Desliza derecha para guardar | Desliza izquierda para descartar
        </Text>
      </View>
    </View>
  );
}