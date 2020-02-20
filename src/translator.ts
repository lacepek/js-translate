export function translate(
  key: string,
  locale: string,
  translations: { [key: string]: any },
  params?: { [key: string]: any }
) {
  const keys = key.split(".");
  const translation = keys.reduce(searchForKey, translations[locale]);

  if (translation instanceof Function) {
    return translation(params);
  }

  if (params) {
    return injectParamsToTranslation(params, translation);
  }

  return translation;
}

function searchForKey(current: string, key: string) {
  if (current[key]) {
    return current[key];
  }

  return key;
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