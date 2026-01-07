import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipo de dato para cada foto
export interface Photo {
  id: string;
  uri: string;
  timestamp: number;
}

// Tipo del contexto
interface GalleryContextType {
  photos: Photo[];
  addPhoto: (uri: string) => void;
  removePhoto: (id: string) => void;
  clearGallery: () => void;
}

// Crear el contexto
const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

// Provider (Envoltorio que da acceso al store)
export function GalleryProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState<Photo[]>([]);

  const addPhoto = (uri: string) => {
    const newPhoto: Photo = {
      id: Date.now().toString(),
      uri,
      timestamp: Date.now(),
    };
    setPhotos((prev) => [newPhoto, ...prev]);
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  const clearGallery = () => {
    setPhotos([]);
  };

  return (
    <GalleryContext.Provider value={{ photos, addPhoto, removePhoto, clearGallery }}>
      {children}
    </GalleryContext.Provider>
  );
}

// 🪝 Hook personalizado para usar el store
export function useGallery() {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery debe usarse dentro de GalleryProvider');
  }
  return context;
}