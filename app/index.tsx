import "@/global.css";
import { Heart, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, PanResponder, StatusBar, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

const profiles = [
  {
    id: 1,
    name: 'María',
    age: 28,
    bio: 'Amante del café y los viajes ✈️',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop'
  },
  {
    id: 2,
    name: 'Carlos',
    age: 32,
    bio: 'Fotógrafo y montañista 📸🏔️',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop'
  },
  {
    id: 3,
    name: 'Ana',
    age: 26,
    bio: 'Chef y foodie apasionada 🍕',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop'
  },
  {
    id: 4,
    name: 'Diego',
    age: 30,
    bio: 'Músico y guitarrista 🎸',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop'
  },
  {
    id: 5,
    name: 'Sofía',
    age: 27,
    bio: 'Yoga instructor & wellness lover 🧘‍♀️',
    image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop'
  }
];

const SwipeCard = ({ profile, onSwipeLeft, onSwipeRight }) => {
  const position = useRef(new Animated.ValueXY()).current;
  
  useEffect(() => {
    // Reiniciar la posición cuando cambia el perfil
    position.setValue({ x: 0, y: 0 });
  }, [profile.id]);

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp'
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          Animated.spring(position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gesture.dy },
            useNativeDriver: false
          }).start(() => {
            onSwipeRight(profile);
          });
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          Animated.spring(position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gesture.dy },
            useNativeDriver: false
          }).start(() => {
            onSwipeLeft(profile);
          });
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false
          }).start();
        }
      }
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        position: 'absolute',
        width: SCREEN_WIDTH - 40,
        height: '70%',
        transform: [
          { translateX: position.x },
          { translateY: position.y },
          { rotate }
        ]
      }}
    >
      <View className="flex-1 bg-white rounded-3xl shadow-2xl overflow-hidden">
        <Image
          source={{ uri: profile.image }}
          className="w-full h-full"
          resizeMode="cover"
        />
        
        {/* Overlay de información */}
        <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <Text className="text-white text-3xl font-bold">{profile.name}, {profile.age}</Text>
          <Text className="text-white text-base mt-2">{profile.bio}</Text>
        </View>

        {/* Indicador LIKE */}
        <Animated.View
          style={{ opacity: likeOpacity }}
          className="absolute top-12 right-8 border-4 border-green-500 rounded-xl px-6 py-3 rotate-12"
        >
          <Text className="text-green-500 text-4xl font-bold">LIKE</Text>
        </Animated.View>

        {/* Indicador NOPE */}
        <Animated.View
          style={{ opacity: nopeOpacity }}
          className="absolute top-12 left-8 border-4 border-red-500 rounded-xl px-6 py-3 -rotate-12"
        >
          <Text className="text-red-500 text-4xl font-bold">NOPE</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export default function DatingApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState([]);
  const [rejected, setRejected] = useState([]);
  const swipeCardRef = useRef(null);

  const handleSwipeLeft = (profile) => {
    setRejected([...rejected, profile.id]);
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
    }, 300);
  };

  const handleSwipeRight = (profile) => {
    setMatches([...matches, profile.id]);
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
    }, 300);
  };

  const handleRejectButton = () => {
    if (currentProfile) {
      handleSwipeLeft(currentProfile);
    }
  };

  const handleLikeButton = () => {
    if (currentProfile) {
      handleSwipeRight(currentProfile);
    }
  };

  const currentProfile = profiles[currentIndex];

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View className="pt-12 pb-4 px-6 bg-white shadow-sm">
        <Text className="text-3xl font-bold text-pink-500 text-center">💕 Dating App</Text>
      </View>

      {/* Cards Container */}
      <View className="flex-1 items-center justify-center">
        {currentProfile ? (
          <SwipeCard
            key={currentProfile.id}
            profile={currentProfile}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
          />
        ) : (
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-700 mb-4">¡No hay más perfiles!</Text>
            <Text className="text-lg text-gray-500">Matches: {matches.length}</Text>
            <Text className="text-lg text-gray-500">Rechazados: {rejected.length}</Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-center items-center pb-8 gap-8">
        <TouchableOpacity 
          onPress={handleRejectButton}
          className="bg-white rounded-full p-5 shadow-lg active:scale-95"
          disabled={!currentProfile}
        >
          <X size={32} color="#ef4444" strokeWidth={3} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleLikeButton}
          className="bg-white rounded-full p-5 shadow-lg active:scale-95"
          disabled={!currentProfile}
        >
          <Heart size={32} color="#10b981" strokeWidth={3} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View className="pb-4 px-6">
        <Text className="text-center text-gray-600">
          {profiles.length - currentIndex} perfiles restantes
        </Text>
      </View>
    </View>
  );
}