export interface ITokens {
  token: string;
  expires_at: string;
}

export const setTokens = (data: ITokens): void => {
  const authKey: string = process.env.NEXT_PUBLIC_STORAGE_AUTH_KEY || '';
  const tokenExpirationKey: string = process.env.NEXT_PUBLIC_STORAGE_TOKEN_EXPIRATION_DATE_KEY || '';

  localStorage.setItem(authKey, data.token);
  localStorage.setItem(tokenExpirationKey, data.expires_at);
};

export const deleteTokens = (): void => {
  const authKey: string = process.env.NEXT_PUBLIC_STORAGE_AUTH_KEY || '';
  const tokenExpirationKey: string = process.env.NEXT_PUBLIC_STORAGE_TOKEN_EXPIRATION_DATE_KEY || '';

  localStorage.removeItem(authKey);
  localStorage.removeItem(tokenExpirationKey);
};

export const isAccessTokenAlive = (): boolean => {
  // TODO - temporary
  return true;

  const tokenExpirationKey: string = process.env.NEXT_PUBLIC_STORAGE_TOKEN_EXPIRATION_DATE_KEY || '';
  const tokenRefreshKey: string = process.env.NEXT_PUBLIC_STORAGE_TOKEN_REFRESH_INTERVAL || '';
  const token = getAccessToken();
  if (!token) return false;
  const currentTime = Math.floor(new Date().getTime() / 1000);
  const tokenExpTime = localStorage.getItem(tokenExpirationKey);
  return currentTime + Number(tokenRefreshKey) < Number(tokenExpTime);
};

export const setSessionGUID = (token: string): void => {
  const authKey: string = 'SessionGUID';
  localStorage.setItem(authKey, token);
};

export const getSessionGUID = (): string | null => {
  const authKey: string = 'SessionGUID';
  return localStorage.getItem(authKey);
};

export const setAccessToken = (token: string): void => {
  const authKey: string = "clariata-jwt";
  localStorage.setItem(authKey, token);
};
export const getAccessToken = (): string | null => {
  if (typeof window == 'undefined') {
    return null;
  }
  const authKey: string = "clariata-jwt";
  return localStorage.getItem(authKey);
}

export const deleteAccessToken = (): void => {
  const authKey: string = "clariata-jwt";
  localStorage.removeItem(authKey);
};

export const setAuthenticated = (authenticated: boolean): void => {
  const authKey: string = process.env.NEXT_PUBLIC_STORAGE_AUTH_FLAG || '';
  localStorage.setItem(authKey, authenticated ? 'true' : 'false');
};
export const isAuthenticated = (): boolean => {
  const authKey: string = process.env.NEXT_PUBLIC_STORAGE_AUTH_FLAG || '';
  const token = localStorage.getItem(authKey);
  return token ? token === 'true' : false;
};

// Selected Household
export const setSelectedHouseholdId = (selectedHouseholdId: number): void => {
  const key: string = 'selectedHouseholdId';
  localStorage.setItem(key, selectedHouseholdId.toString());
};
export const getSelectedHouseholdId = (): number => {
  const key: string = 'selectedHouseholdId';
  const selectedHouseholdId = localStorage.getItem('selectedHouseholdId');
  if(selectedHouseholdId)
    return Number(selectedHouseholdId);
  else
    return 0;
};

export const setSelectedContactId = (personId: number): void => {
  const key: string = 'selectedContactId';
  localStorage.setItem(key, personId.toString());
};
export const getSelectedContactId = (): number => {
  const key: string = 'selectedContactId';
  const selectedContactId = localStorage.getItem(key);
  if(selectedContactId)
    return Number(selectedContactId);
  else
    return 0;
};
