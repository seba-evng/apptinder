// lib/ui/usePhotoGestures.ts
import { PhotoTransform } from '@/lib/store/GalleryContext';
import { useRef } from 'react';
import { Animated, PanResponder } from 'react-native';

interface PhotoGesturesOptions {
  initialTransform?: PhotoTransform;
  onGestureStart?: () => void;
}

export const usePhotoGestures = (options?: PhotoGesturesOptions) => {
  const initial = options?.initialTransform || {
    scale: 1,
    translateX: 0,
    translateY: 0,
    rotation: 0,
  };

  // Estados para transformaciones
  const scale = useRef(new Animated.Value(initial.scale)).current;
  const translateX = useRef(new Animated.Value(initial.translateX)).current;
  const translateY = useRef(new Animated.Value(initial.translateY)).current;
  const rotation = useRef(new Animated.Value(initial.rotation)).current;

  // Variables para guardar estado
  const gestureState = useRef({
    scale: initial.scale,
    translateX: initial.translateX,
    translateY: initial.translateY,
    rotation: initial.rotation,
    lastScale: initial.scale,
    lastX: initial.translateX,
    lastY: initial.translateY,
    lastRotation: initial.rotation,
  });

  // PanResponder para gestos básicos
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        options?.onGestureStart?.();
      },
      onPanResponderMove: (_, gesture) => {
        // Arrastrar
        translateX.setValue(gestureState.current.lastX + gesture.dx);
        translateY.setValue(gestureState.current.lastY + gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        gestureState.current.lastX += gesture.dx;
        gestureState.current.lastY += gesture.dy;
        gestureState.current.translateX = gestureState.current.lastX;
        gestureState.current.translateY = gestureState.current.lastY;
      },
    })
  ).current;

  // Función para zoom (llamar desde botones)
  const zoomIn = () => {
    options?.onGestureStart?.();
    const newScale = Math.min(gestureState.current.scale * 1.2, 4);
    gestureState.current.scale = newScale;
    gestureState.current.lastScale = newScale;
    Animated.spring(scale, {
      toValue: newScale,
      useNativeDriver: true,
    }).start();
  };

  const zoomOut = () => {
    options?.onGestureStart?.();
    const newScale = Math.max(gestureState.current.scale * 0.8, 0.5);
    gestureState.current.scale = newScale;
    gestureState.current.lastScale = newScale;
    Animated.spring(scale, {
      toValue: newScale,
      useNativeDriver: true,
    }).start();
  };

  // Función para rotar (llamar desde botones)
  const rotateLeft = () => {
    options?.onGestureStart?.();
    const newRotation = gestureState.current.rotation - Math.PI / 4; // -45 grados
    gestureState.current.rotation = newRotation;
    gestureState.current.lastRotation = newRotation;
    Animated.spring(rotation, {
      toValue: newRotation,
      useNativeDriver: true,
    }).start();
  };

  const rotateRight = () => {
    options?.onGestureStart?.();
    const newRotation = gestureState.current.rotation + Math.PI / 4; // +45 grados
    gestureState.current.rotation = newRotation;
    gestureState.current.lastRotation = newRotation;
    Animated.spring(rotation, {
      toValue: newRotation,
      useNativeDriver: true,
    }).start();
  };

  // Estilo animado
  const animatedStyle = {
    transform: [
      { translateX },
      { translateY },
      { scale },
      { rotate: rotation.interpolate({
        inputRange: [-Math.PI * 2, Math.PI * 2],
        outputRange: ['-360deg', '360deg'],
      })},
    ],
  };

  // Resetear
  const reset = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
      Animated.spring(rotation, { toValue: 0, useNativeDriver: true }),
    ]).start();

    gestureState.current = {
      scale: 1,
      translateX: 0,
      translateY: 0,
      rotation: 0,
      lastScale: 1,
      lastX: 0,
      lastY: 0,
      lastRotation: 0,
    };
  };

  // Obtener valores actuales
  const getCurrentValues = (): PhotoTransform => {
    return {
      scale: gestureState.current.scale,
      translateX: gestureState.current.translateX,
      translateY: gestureState.current.translateY,
      rotation: gestureState.current.rotation,
    };
  };

  return {
    panResponder,
    animatedStyle,
    reset,
    getCurrentValues,
    zoomIn,
    zoomOut,
    rotateLeft,
    rotateRight,
  };
};