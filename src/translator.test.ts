import { translate } from './translator';

const translations = {
  en: {
    test: {
      apple: 'Apple',
      pears: (params: { [key: string]: any }) => {
        const count = params.count;
        if (count !== 1) {
          return `You have ${count} pears`;
        }
        return 'You have 1 pear';
      },
      time: 'Its {{hours}}:{{minutes}}'
    }
  },
  cs: {
    test: {
      apple: 'Jablko',
      pears: (params: { [key: string]: any }) => {
        const count = params.count;
        if (count === 1) {
          return 'Máš jednu hrušku';
        }
        if (count === 0 || count > 4) {
          return `Máš ${count} hrušek`;
        }

        return `Máš ${count} hrušky`;
      },
      time: 'Je {{hours}}:{{minutes}}'
    }
  }
};

describe('Translator test', () => {
  it('translates simple key', () => {
    const en = 'Apple';
    const cs = 'Jablko';

    expect(translate('test.apple', 'en', translations)).toBe(en);
    expect(translate('test.apple', 'cs', translations)).toBe(cs);
  });

  it('translates key with params', () => {
    const en = 'Its 8:00';
    const cs = 'Je 8:00';
    const params = { hours: 8, minutes: '00' };

    expect(translate('test.time', 'en', translations, params)).toBe(en);
    expect(translate('test.time', 'cs', translations, params)).toBe(cs);
  });

  it('translates key with callback', () => {
    const enSingular = 'You have 1 pear';
    const enPlural = 'You have 8 pears';

    const csSingular = 'Máš jednu hrušku';
    const csPlural = 'Máš 4 hrušky';

    expect(translate('test.pears', 'en', translations, { count: 1 })).toBe(enSingular);
    expect(translate('test.pears', 'en', translations, { count: 8 })).toBe(enPlural);
    expect(translate('test.pears', 'cs', translations, { count: 1 })).toBe(csSingular);
    expect(translate('test.pears', 'cs', translations, { count: 4 })).toBe(csPlural);
  });

  it('returns key when nothing is found', () => {
    expect(translate('test.not.found', 'en', translations)).toBe('test.not.found');
    expect(translate('test.not.found', 'en', translations, { count: 8 })).toBe('test.not.found');
    expect(translate('test.not.found', 'en', translations, { hours: 8, minutes: '00' })).toBe('test.not.found');
    expect(translate('test.not.found', 'cs', translations)).toBe('test.not.found');
    expect(translate('test.not.found', 'cs', translations, { count: 4 })).toBe('test.not.found');
    expect(translate('test.not.found', 'cs', translations, { hours: 8, minutes: '00' })).toBe('test.not.found');
  });
});
