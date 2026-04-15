import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Global state management for Vastu-Bot.
 * Handles User Sessions, 3D Architecture (Walls), and Assets (Furniture).
 */
const useDesignStore = create(
  persist(
    (set) => ({
      // --- 1. USER SESSION STATE ---
      user: null, 
      isAuthenticated: false,

      // --- 2. 3D DESIGN STATE ---
      walls: [],
      furniture: [],
      activeItem: null, // ID of selected furniture
      editMode: 'move', // 'move' or 'rotate'

      // --- 3. AUTHENTICATION ACTIONS ---
      // Renamed to setUser to match your Navbar.jsx call
      setUser: (userData) => set({ 
        user: userData, 
        isAuthenticated: !!userData 
      }),
      
      logout: () => {
        // Clear local storage and reset state
        localStorage.removeItem('vastu-design-storage');
        set({ 
          user: null, 
          isAuthenticated: false,
          walls: [],
          furniture: [],
          activeItem: null,
          editMode: 'move'
        });
      },

      // --- 4. WALL & ARCHITECTURE ACTIONS ---
      setWalls: (newWalls) => set({ walls: newWalls }),

      // --- 5. FURNITURE & ASSET ACTIONS ---
      
      // Add furniture with unique ID and default transform
      addFurniture: (item) => set((state) => ({ 
        furniture: [
          ...state.furniture, 
          { 
            ...item, 
            id: `item-${Date.now()}`, // Unique string ID
            position: [0, 0, 0],
            rotation: [0, 0, 0]
          }
        ],
        activeItem: `item-${Date.now()}` // Auto-select newly added item
      })),

      // Update transform data (Persisted after DragEnd in 3D)
      updateFurniturePosition: (id, newPosition) => set((state) => ({
        furniture: state.furniture.map((item) => 
          item.id === id ? { ...item, position: newPosition } : item
        )
      })),

      updateFurnitureRotation: (id, newRotation) => set((state) => ({
        furniture: state.furniture.map((item) => 
          item.id === id ? { ...item, rotation: newRotation } : item
        )
      })),

      // Remove specific item
      removeFurniture: (id) => set((state) => ({
        furniture: state.furniture.filter((item) => item.id !== id),
        activeItem: state.activeItem === id ? null : state.activeItem
      })),

      // --- 6. EDITOR UI ACTIONS ---
      
      // Selection management
      setActiveItem: (id) => set({ activeItem: id }),

      // Toggle between Move arrows and Rotate rings
      setEditMode: (mode) => set({ editMode: mode }),

      // Global Clears
      clearFurniture: () => set({ furniture: [], activeItem: null }),
      
      clearDesign: () => set({ 
        walls: [], 
        furniture: [], 
        activeItem: null 
      }),
    }),
    
    {
      name: 'vastu-design-storage', // Key name in LocalStorage
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        walls: state.walls,
        furniture: state.furniture,
        editMode: state.editMode // Keep 'move'/'rotate' state on refresh
      }), 
    }
  )
);

export default useDesignStore;