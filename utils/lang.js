const label = reg => id => {
  const lang = window.dynamicLang || 'en';
  return reg[lang][id];
};

export {
  label
};