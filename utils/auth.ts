const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export const getTokenExpiration = () => {
  return Date.now() + ONE_WEEK_IN_MS;
};

export const isTokenExpired = (expirationTime: number) => {
  return Date.now() >= expirationTime;
};
