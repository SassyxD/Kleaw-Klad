import type { Shelter, EvacuationRoute, Coordinates } from '../types';

export const mockShelters: Shelter[] = [
  {
    id: 'shelter_1',
    name: 'Prince of Songkla University Gym',
    capacity: 500,
    currentOccupancy: 234,
    status: 'open',
    coordinates: { lat: 7.0234, lng: 100.4901 },
    facilities: ['medical', 'food', 'power', 'water', 'restrooms'],
    contactPhone: '+66-74-123-4567',
  },
  {
    id: 'shelter_2',
    name: 'Hat Yai Municipal Hall',
    capacity: 300,
    currentOccupancy: 156,
    status: 'open',
    coordinates: { lat: 7.0156, lng: 100.4823 },
    facilities: ['food', 'power', 'water', 'restrooms'],
    contactPhone: '+66-74-123-4568',
  },
  {
    id: 'shelter_3',
    name: 'Rajamangala Stadium',
    capacity: 800,
    currentOccupancy: 445,
    status: 'open',
    coordinates: { lat: 7.0198, lng: 100.4689 },
    facilities: ['medical', 'food', 'power', 'water', 'restrooms', 'generators'],
    contactPhone: '+66-74-123-4569',
  },
  {
    id: 'shelter_4',
    name: 'Community Center - Zone B',
    capacity: 200,
    currentOccupancy: 89,
    status: 'open',
    coordinates: { lat: 7.0034, lng: 100.4712 },
    facilities: ['food', 'water', 'restrooms'],
    contactPhone: '+66-74-123-4570',
  },
  {
    id: 'shelter_5',
    name: 'Buddhist Temple - Wat Hat Yai',
    capacity: 400,
    currentOccupancy: 201,
    status: 'open',
    coordinates: { lat: 7.0123, lng: 100.4856 },
    facilities: ['medical', 'food', 'water', 'restrooms'],
    contactPhone: '+66-74-123-4571',
  },
  {
    id: 'shelter_6',
    name: 'Hat Yai International School',
    capacity: 350,
    currentOccupancy: 0,
    status: 'open',
    coordinates: { lat: 7.0267, lng: 100.4934 },
    facilities: ['medical', 'food', 'power', 'water', 'restrooms'],
    contactPhone: '+66-74-123-4572',
  },
  {
    id: 'shelter_7',
    name: 'Central Mosque',
    capacity: 250,
    currentOccupancy: 115,
    status: 'open',
    coordinates: { lat: 7.0078, lng: 100.4678 },
    facilities: ['food', 'water', 'restrooms'],
    contactPhone: '+66-74-123-4573',
  },
  {
    id: 'shelter_8',
    name: 'Green View Resort (Emergency)',
    capacity: 600,
    currentOccupancy: 0,
    status: 'open',
    coordinates: { lat: 7.0312, lng: 100.5012 },
    facilities: ['medical', 'food', 'power', 'water', 'restrooms', 'generators', 'beds'],
    contactPhone: '+66-74-123-4574',
  },
];

export function generateMockRoute(
  origin: Coordinates,
  destination: { id: string; lat: number; lng: number },
  priority: string,
  index: number
): EvacuationRoute {
  // Calculate rough distance (simplified)
  const latDiff = destination.lat - origin.lat;
  const lngDiff = destination.lng - origin.lng;
  const distance = Math.sqrt(latDiff ** 2 + lngDiff ** 2) * 111; // km approximation

  // Generate waypoints
  const waypoints: Coordinates[] = [
    origin,
    { lat: origin.lat + latDiff * 0.33, lng: origin.lng + lngDiff * 0.33 },
    { lat: origin.lat + latDiff * 0.67, lng: origin.lng + lngDiff * 0.67 },
    { lat: destination.lat, lng: destination.lng },
  ];

  const duration = priority === 'fastest' 
    ? Math.max(5, distance * 4 + Math.random() * 10)
    : Math.max(8, distance * 6 + Math.random() * 15);

  const safetyScore = priority === 'safest'
    ? 0.85 + Math.random() * 0.1
    : 0.65 + Math.random() * 0.15;

  return {
    id: `route_${index + 1}`,
    destination: destination.id,
    distance: parseFloat(distance.toFixed(2)),
    duration: Math.round(duration),
    safetyScore: parseFloat(safetyScore.toFixed(2)),
    waypoints,
    instructions: [
      'Head north on main road',
      'Turn right at intersection',
      `Continue for ${(distance * 0.6).toFixed(1)} km`,
      'Avoid flooded areas',
      'Arrive at shelter',
    ],
  };
}
