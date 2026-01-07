// components/organisms/SwipeablePhoto.tsx
import React from 'react';
import { View, Text, Image, Animated, Dimensions } from 'react-native';
import { useSwipeLogic } from '@/lib/ui/useSwipeLogic';
import { Photo } from '@/lib/store/GalleryContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SwipeablePhotoProps {
  photo: Photo;
  onSwipeLeft: (photo: Photo) => void;
  onSwipeRight: (photo: Photo) => void;
}

export const SwipeablePhoto: React.FC<SwipeablePhotoProps> = ({
  photo,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const { position, rotate, likeOpacity, nopeOpacity, panResponder } = useSwipeLogic({
    itemId: photo.id,
    onSwipeLeft: () => onSwipeLeft(photo),
    onSwipeRight: () => onSwipeRight(photo),
  });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        position: 'absolute',
        width: SCREEN_WIDTH - 40,
        height: '75%',
        transform: [
          { translateX: position.x },
          { translateY: position.y },
          { rotate },
        ],
      }}
    >
      <View className="flex-1 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Imagen */}
        <Image
          source={{ uri: photo.uri }}
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* Overlay de información */}
        <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <Text className="text-white text-sm">
            {new Date(photo.timestamp).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
          <Text className="text-white/70 text-xs mt-1">
            {new Date(photo.timestamp).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        {/* Indicador GUARDAR (derecha) */}
        <Animated.View
          style={{ opacity: likeOpacity }}
          className="absolute top-12 right-8 border-4 border-green-500 rounded-xl px-6 py-3 rotate-12"
        >
          <Text className="text-green-500 text-4xl font-bold">GUARDAR</Text>
        </Animated.View>

        {/* Indicador ELIMINAR (izquierda) */}
        <Animated.View
          style={{ opacity: nopeOpacity }}
          className="absolute top-12 left-8 border-4 border-red-500 rounded-xl px-6 py-3 -rotate-12"
        >
          <Text className="text-red-500 text-4xl font-bold">ELIMINAR</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
};