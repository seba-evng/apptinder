// lib/ui/useSwipeLogic.ts
import { useRef, useEffect } from 'react';
import { Animated, PanResponder, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface UseSwipeLogicProps {
  itemId: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export const useSwipeLogic = ({ itemId, onSwipeLeft, onSwipeRight }: UseSwipeLogicProps) => {
  const position = useRef(new Animated.ValueXY()).current;

  // Reiniciar posición cuando cambia el item
  useEffect(() => {
    position.setValue({ x: 0, y: 0 });
  }, [itemId]);

  // Interpolaciones para animaciones
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Gestos del PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          // Swipe derecha - Guardar
          Animated.spring(position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gesture.dy },
            useNativeDriver: false,
          }).start(() => {
            onSwipeRight();
          });
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          // Swipe izquierda - Eliminar
          Animated.spring(position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gesture.dy },
            useNativeDriver: false,
          }).start(() => {
            onSwipeLeft();
          });
        } else {
          // Regresar a posición inicial
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return {
    position,
    rotate,
    likeOpacity,
    nopeOpacity,
    panResponder,
  };
};