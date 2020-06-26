export function translate(
  key: string,
  locale: string,
  translations: { [key: string]: any },
  params?: { [key: string]: any }
) {
  if (key === null || key === undefined) {
    return key;
  }

  const keys = key.split('.');
  const translation = keys.reduce(searchForKey, translations[locale]);

  if (!translation) {
    return key;
  }

  if (params) {
    if (translation instanceof Function) {
      return translation(params);
    }

    return injectParamsToTranslation(params, translation);
  }

  return translation;
}

function searchForKey(current: string, key: string) {
  if (!current || !current[key]) {
    return null;
  }

  return current[key];
}

function injectParamsToTranslation(params: { [key: string]: any }, translation: string) {
  const keys = Object.keys(params);
  return keys.reduce((accumulator: string, key: string) => {
    const needle = `{{${key}}}`;
    if (accumulator.includes(needle)) {
      const value = params[key];
      return accumulator.replace(needle, value);
    }

    return accumulator;
  }, translation);
}
