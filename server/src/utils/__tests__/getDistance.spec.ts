
import { getDistance } from '../getDistance';

describe('getDistance', () => {
  test('calcule correctement la distance entre deux points (Haversine)', () => {
    
    const paris = { lat: 48.8566, lng: 2.3522 };
    const north = { lat: 48.9016, lng: 2.3522 }; // ~5 km
    expect(getDistance(paris, north)).toBeCloseTo(5, 0);
  });

  test('retourne 0 si les deux points sont identiques', () => {
    const point = { lat: 2, lng: 2 };
    expect(getDistance(point, point)).toBe(0);
  });
});