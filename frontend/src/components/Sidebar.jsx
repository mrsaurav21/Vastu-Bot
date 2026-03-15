import React from 'react';
import { Layers, Save, MousePointer2 } from 'lucide-react';
import useDesignStore from '../store/useDesignStore';

const Sidebar = () => {
  // We bring in the store actions for future use (Phase 2)
  const addFurniture = useDesignStore((state) => state.addFurniture);

  // Placeholder catalog for Phase 2
  const catalogItems = [
    { id: 'sofa_1', name: 'Modern Sofa', type: 'seating', icon: '🛋️' },
    { id: 'table_1', name: 'Coffee Table', type: 'table', icon: '🪑' },
    { id: 'plant_1', name: 'Potted Plant', type: 'decor', icon: '🪴' },
    { id: 'bed_1', name: 'Queen Bed', type: 'bed', icon: '🛏️' },
  ];

  const handleAddItem = (item) => {
    // In Phase 2, this will place the 3D model in the center of the room
    addFurniture({
      modelId: item.id,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
    });
    console.log(`Added ${item.name} to the scene.`);
  };

  return (
    <div className="w-80 bg-[#121212] border-l border-gray-800 flex flex-col h-full z-10 shadow-xl">
      
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-2 mb-1">
          <Layers className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-bold tracking-widest text-gray-400">CATALOGUE</h2>
        </div>
        <p className="text-xs text-gray-500 flex items-center mt-2">
          <MousePointer2 className="w-3 h-3 mr-1" />
          Click items to add to room (Phase 2)
        </p>
      </div>
      
      {/* Furniture List */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {catalogItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleAddItem(item)}
            className="w-full flex items-center justify-between p-4 border border-gray-800 bg-gray-900/50 rounded-xl hover:border-blue-500 hover:bg-gray-800 transition-all group"
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl opacity-80 group-hover:opacity-100 transition-opacity">
                {item.icon}
              </span>
              <span className="font-semibold text-gray-300 group-hover:text-white transition-colors">
                {item.name}
              </span>
            </div>
            <span className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded-md">
              {item.type}
            </span>
          </button>
        ))}
      </div>
      
      {/* Footer / Save Action */}
      <div className="p-6 border-t border-gray-800 bg-[#0a0a0a]">
        <button 
          className="w-full flex items-center justify-center space-x-2 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold tracking-widest transition-all shadow-lg shadow-blue-900/20"
        >
          <Save className="w-5 h-5" />
          <span>SAVE DESIGN</span>
        </button>
      </div>

    </div>
  );
};

export default Sidebar;