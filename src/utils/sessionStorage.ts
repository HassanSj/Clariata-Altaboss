export const setItem = (key: string, val: string): void => {
  if (!key) return;
  sessionStorage.setItem(key, val);
};

export const getItem = (key: string): string | null => {
  if (!key) return null;
  return sessionStorage.getItem(key);
};

export const removeItem = (key: string): void => {
  sessionStorage.removeItem(key);
};

export const clear = (): void => {
  sessionStorage.clear();
};