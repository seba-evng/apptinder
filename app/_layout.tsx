// app/_layout.tsx
import { GalleryProvider } from '@/lib/store/GalleryContext';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GalleryProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </GalleryProvider>
    </GestureHandlerRootView>
  );
}