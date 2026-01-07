// lib/store/GalleryContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';

// 📸 Tipo de dato para transformaciones de edición
export interface PhotoTransform {
  scale: number;
  translateX: number;
  translateY: number;
  rotation: number;
  cropData?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// 📸 Tipo de dato para cada foto
export interface Photo {
  id: string;
  uri: string;
  timestamp: number;
  transform?: PhotoTransform; // Transformaciones aplicadas
}

// 🎯 Tipo del contexto
interface GalleryContextType {
  pendingPhotos: Photo[];
  savedPhotos: Photo[];
  deletedPhotos: Photo[];
  addPhoto: (uri: string) => void;
  savePhoto: (id: string) => void;
  deletePhoto: (id: string) => void;
  removePhoto: (id: string) => void;
  restorePhoto: (id: string, fromDeleted: boolean) => void;
  updatePhotoTransform: (id: string, transform: PhotoTransform) => void; // Nueva función
  clearAll: () => void;
}

// Crear el contexto
const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

// 🏪 Provider (Envoltorio que da acceso al store)
export function GalleryProvider({ children }: { children: ReactNode }) {
  const [pendingPhotos, setPendingPhotos] = useState<Photo[]>([]);
  const [savedPhotos, setSavedPhotos] = useState<Photo[]>([]);
  const [deletedPhotos, setDeletedPhotos] = useState<Photo[]>([]);

  // Agregar foto nueva (va a pendientes)
  const addPhoto = (uri: string) => {
    const newPhoto: Photo = {
      id: Date.now().toString(),
      uri,
      timestamp: Date.now(),
    };
    setPendingPhotos((prev) => [newPhoto, ...prev]);
  };

  // Guardar foto (mover de pendientes a guardadas)
  const savePhoto = (id: string) => {
    const photo = pendingPhotos.find((p) => p.id === id);
    if (photo) {
      setSavedPhotos((prev) => [photo, ...prev]);
      setPendingPhotos((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Eliminar foto (mover de pendientes a eliminadas)
  const deletePhoto = (id: string) => {
    const photo = pendingPhotos.find((p) => p.id === id);
    if (photo) {
      setDeletedPhotos((prev) => [photo, ...prev]);
      setPendingPhotos((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Eliminar permanentemente de cualquier lista
  const removePhoto = (id: string) => {
    setPendingPhotos((prev) => prev.filter((p) => p.id !== id));
    setSavedPhotos((prev) => prev.filter((p) => p.id !== id));
    setDeletedPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  // Restaurar foto a pendientes
  const restorePhoto = (id: string, fromDeleted: boolean) => {
    if (fromDeleted) {
      const photo = deletedPhotos.find((p) => p.id === id);
      if (photo) {
        setPendingPhotos((prev) => [photo, ...prev]);
        setDeletedPhotos((prev) => prev.filter((p) => p.id !== id));
      }
    } else {
      const photo = savedPhotos.find((p) => p.id === id);
      if (photo) {
        setPendingPhotos((prev) => [photo, ...prev]);
        setSavedPhotos((prev) => prev.filter((p) => p.id !== id));
      }
    }
  };

  // Actualizar transformaciones de una foto
  const updatePhotoTransform = (id: string, transform: PhotoTransform) => {
    setSavedPhotos((prev) =>
      prev.map((photo) =>
        photo.id === id ? { ...photo, transform } : photo
      )
    );
  };

  // Limpiar todas las categorías
  const clearAll = () => {
    setPendingPhotos([]);
    setSavedPhotos([]);
    setDeletedPhotos([]);
  };

  return (
    <GalleryContext.Provider
      value={{
        pendingPhotos,
        savedPhotos,
        deletedPhotos,
        addPhoto,
        savePhoto,
        deletePhoto,
        removePhoto,
        restorePhoto,
        updatePhotoTransform,
        clearAll,
      }}
    >
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