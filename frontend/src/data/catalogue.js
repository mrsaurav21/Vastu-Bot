import { Armchair, Monitor, Flower2 } from 'lucide-react';

export const ASSET_CATALOGUE = [
  {
    id: 'furniture',
    name: 'Furniture',
    icon: Armchair,
    items: [
      // SOFAS
      { id: 'sofa_1', name: 'Modern 3-Seater Sofa', type: 'sofa', url: '/models/sofa1.glb' },
      { id: 'sofa_2', name: 'L-Shape Sectional Sofa', type: 'sofa', url: '/models/sofa2.glb' },
      { id: 'sofa_3', name: 'Classic Leather Sofa', type: 'sofa', url: '/models/sofa3.glb' },
      // CHAIRS
      { id: 'chair_1', name: 'Lounge Armchair', type: 'chair', url: '/models/chair1.glb' },
      { id: 'chair_2', name: 'Wooden Dining Chair', type: 'chair', url: '/models/chair2.glb' },
      { id: 'chair_3', name: 'Ergonomic Office Chair', type: 'chair', url: '/models/chair3.glb' },
      // BEDS
      { id: 'bed_1', name: 'King Size Double Bed', type: 'bed', url: '/models/bed1.glb' },
      { id: 'bed_2', name: 'Queen Size Platform Bed', type: 'bed', url: '/models/bed2.glb' },
      { id: 'bed_3', name: 'Single Storage Bed', type: 'bed', url: '/models/bed3.glb' },
      // TABLES
      { id: 'table_1', name: 'Glass Coffee Table', type: 'table', url: '/models/table1.glb' },
      { id: 'table_2', name: 'Wooden Dining Table', type: 'table', url: '/models/table2.glb' },
      { id: 'table_3', name: 'Minimalist Study Table', type: 'table', url: '/models/table3.glb' },
    ]
  },
  {
    id: 'appliances',
    name: 'Appliances',
    icon: Monitor,
    items: [
      // TVS
      { id: 'tv_1', name: '55-inch Wall TV', type: 'tv', url: '/models/tv1.glb' },
      { id: 'tv_2', name: '65-inch Curved TV', type: 'tv', url: '/models/tv2.glb' },
      { id: 'tv_3', name: 'Smart TV on Stand', type: 'tv', url: '/models/tv3.glb' },
      // FRIDGES
      { id: 'fridge_1', name: 'Double Door Fridge', type: 'fridge', url: '/models/fridge1.glb' },
      { id: 'fridge_2', name: 'Single Door Fridge', type: 'fridge', url: '/models/fridge2.glb' },
      { id: 'fridge_3', name: 'French Door Fridge', type: 'fridge', url: '/models/fridge3.glb' },
    ]
  },
  {
    id: 'decor_shelves',
    name: 'Decor & Storage',
    icon: Flower2,
    items: [
      // DECOR (Renamed from Bookshelves)
      { id: 'decor_1', name: 'Premium Decor Set A', type: 'decor', url: '/models/decor1.glb' },
      { id: 'decor_2', name: 'Minimalist Decor Piece', type: 'decor', url: '/models/decor2.glb' },
      { id: 'decor_3', name: 'Large Sculptural Decor', type: 'decor', url: '/models/decor3.glb' },
      // KITCHEN SHELVES
      { id: 'kitchen_1', name: 'Overhead Kitchen Cabinet', type: 'kitchen_shelf', url: '/models/kitchen1.glb' },
      { id: 'kitchen_2', name: 'Open Kitchen Rack', type: 'kitchen_shelf', url: '/models/kitchen2.glb' },
      { id: 'kitchen_3', name: 'Corner Kitchen Shelf', type: 'kitchen_shelf', url: '/models/kitchen3.glb' },
    ]
  }
];