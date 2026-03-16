
import axios from 'axios';
import { getCountriesStartingWith } from '../getCountrieBySearch';

jest.mock('axios');

describe('getCountriesStartingWith', () => {
  const mockCountries = {
    FR: { country: 'France' },
    FI: { country: 'Finland' },
    US: { country: 'United States' },
  };

  beforeEach(() => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: { data: mockCountries },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all countries if srch is empty', async () => {
    const result = await getCountriesStartingWith('');
    expect(result).toEqual([
      { country: 'France' },
      { country: 'Finland' },
      { country: 'United States' },
    ]);
  });

  it('should filter countries by starting letters (case-insensitive)', async () => {
    const result = await getCountriesStartingWith('f');
    expect(result).toEqual([
      { country: 'France' },
      { country: 'Finland' },
    ]);
  });

  it('should return empty array if no country matches', async () => {
    const result = await getCountriesStartingWith('zzz');
    expect(result).toEqual([]);
  });
});
