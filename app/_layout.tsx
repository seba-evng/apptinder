// app/_layout.tsx
import { Stack } from 'expo-router';
import { GalleryProvider } from '@/lib/store/GalleryContext';

export default function RootLayout() {
  return (
    <GalleryProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </GalleryProvider>
  );
}
