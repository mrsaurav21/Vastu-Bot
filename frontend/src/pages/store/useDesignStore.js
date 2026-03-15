import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Global state management for User Session and 3D Design Data.
 * Uses 'persist' to prevent data loss on page refresh.
 */
const useDesignStore = create(
  persist(
    (set) => ({
      // --- USER STATE ---
      user: null, 
      isAuthenticated: false,

      // --- 3D DESIGN STATE ---
      walls: [],
      furniture: [],
      activeItem: null, // Stores the 'id' of the selected furniture

      // --- USER ACTIONS ---
      login: (userData) => set({ 
        user: userData, 
        isAuthenticated: !!userData 
      }),
      
      logout: () => {
        // Clear everything on logout
        localStorage.removeItem('vastu-design-storage');
        set({ 
          user: null, 
          isAuthenticated: false,
          walls: [],
          furniture: [],
          activeItem: null
        });
      },

      // --- 3D ACTIONS ---
      
      // Set walls from AI Backend conversion
      setWalls: (newWalls) => set({ walls: newWalls }),

      // Add furniture with safe default coordinates
      addFurniture: (item) => set((state) => ({ 
        furniture: [
          ...state.furniture, 
          { 
            ...item, 
            id: Date.now().toString(), // Unique timestamp ID
            position: [0, 0, 0],       // Initial spawn position
            rotation: [0, 0, 0]        // Initial rotation
          }
        ] 
      })),

      // Update position (x, y, z)
      updateFurniturePosition: (id, newPosition) => set((state) => ({
        furniture: state.furniture.map((item) => 
          item.id === id ? { ...item, position: newPosition } : item
        )
      })),

      // Update rotation
      updateFurnitureRotation: (id, newRotation) => set((state) => ({
        furniture: state.furniture.map((item) => 
          item.id === id ? { ...item, rotation: newRotation } : item
        )
      })),

      // Remove specific item and clear selection if active
      removeFurniture: (id) => set((state) => ({
        furniture: state.furniture.filter((item) => item.id !== id),
        activeItem: state.activeItem === id ? null : state.activeItem
      })),
// Add these to your state in useDesignStore.js
editMode: 'move', // 'move' or 'rotate'
setEditMode: (mode) => set({ editMode: mode }),

// Add this action to delete everything
clearFurniture: () => set({ furniture: [], activeItem: null }),
      // Selection management
      setActiveItem: (id) => set({ activeItem: id }),

      // Reset Actions
      clearFurniture: () => set({ furniture: [], activeItem: null }),
      clearDesign: () => set({ walls: [], furniture: [], activeItem: null })
    }),
    
    {
      name: 'vastu-design-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        walls: state.walls,
        furniture: state.furniture 
      }), 
    }
  )
);

export default useDesignStore;