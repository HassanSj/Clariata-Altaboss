export const setItem = (key: string, val: string) => {
  if (!key) return;
  return localStorage.setItem(key, val);
};

export const getItem = (key: string) => {
  if (!key) return null;
  return localStorage.getItem(key);
};

export const removeItem = (key: string): void => {
  localStorage.removeItem(key);
};
