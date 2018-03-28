import { searchTags } from './searchTags';

jest.mock('lingui-react', () => ({
  withI18n: () => whatever => whatever,
  i18nMark: () => whatever => whatever,
}));

describe('modules tags - services - searchTags', () => {
  it('searchTags', async () => {
    const i18n = { _: id => id };
    const userTags = [{ name: 'foobar', label: 'Foobar' }, { name: 'bar', label: 'Bar' }];

    const results = await searchTags(i18n, userTags, 'foo');

    expect(results).toEqual([userTags[0]]);
  });
});
