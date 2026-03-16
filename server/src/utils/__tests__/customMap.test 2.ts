import { customMap } from '../customMap';

describe('customMap', () => {
  it('should map numbers to their double', () => {
    const items = [1, 2, 3];
    const result = customMap(items, x => x * 2);
    expect(result).toEqual([2, 4, 6]);
  });

  it('should map strings to uppercase', () => {
    const items = ['a', 'b', 'c'];
    const result = customMap(items, s => s.toUpperCase());
    expect(result).toEqual(['A', 'B', 'C']);
  });

  it('should return an empty array if input is empty', () => {
    const result = customMap([], x => x);
    expect(result).toEqual([]);
  });

  it('should call changeItem the correct number of times and return expected values (spy)', () => {
    const items = [10, 20, 30];
    const spy = jest.fn()
      .mockImplementationOnce(x => x + 100)
      .mockImplementationOnce(x => x + 200)
      .mockImplementationOnce(x => x + 300);

    const result = customMap(items, spy);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenNthCalledWith(1, 10);
    expect(spy).toHaveBeenNthCalledWith(2, 20);
    expect(spy).toHaveBeenNthCalledWith(3, 30);
    expect(result).toEqual([110, 220, 330]);

    spy.mockReset();
  });
});