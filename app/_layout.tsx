import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Esto oculta el header
      }}
    />
  );
}
