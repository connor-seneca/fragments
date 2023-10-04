const memory = require('../../src/model/data/memory');

describe('fragment-data', () => {
  test('writeFragment returns nothing', async () => {
    var fragment = { id: '1', ownerId: 'test' };
    const result = await memory.writeFragment(fragment);
    expect(result).toBe(undefined);
  });

  test('writeFragmentData returns nothing', async () => {
    const data = Buffer.from([1, 2, 3]);
    const result = await memory.writeFragmentData('test', '1', data);
    expect(result).toBe(undefined);
  });

  test('readFragment returns what we write into the db', async () => {
    const fragment = { id: '1', ownerId: 'test' };
    await memory.writeFragment(fragment);
    const result = await memory.readFragment(fragment.ownerId, fragment.id);
    expect(result).toEqual(fragment);
  });

  test('readFragmentData returns what we write into the db', async () => {
    const data = Buffer.from([1, 2, 3]);
    await memory.writeFragmentData('test', '1', data);
    const result = await memory.readFragmentData('test', '1');
    expect(result).toEqual(('test', '1', data));
  });

  test('listFragments returns an array of fragments', async () => {
    await memory.writeFragment({ id: '1', ownerId: 'test' });
    await memory.writeFragment({ id: '2', ownerId: 'test' });
    await memory.writeFragment({ id: '3', ownerId: 'test' });

    const results = await memory.listFragments('test');
    expect(Array.isArray(results)).toBe(true);
    expect(results).toEqual(['1', '2', '3']);
  });

  test('deleteFragments removes fragment that was written into db and returns nothing', async () => {
    const data = Buffer.from([1, 2, 3]);
    await memory.writeFragment({ id: '1', ownerId: 'test' });
    await memory.writeFragmentData('test', '1', data);
    expect(await memory.readFragment('test', '1')).toEqual({ id: '1', ownerId: 'test' });
    await memory.deleteFragment('test', '1');
    expect(await memory.readFragment('test', '1')).toBe(undefined);
  });
});
