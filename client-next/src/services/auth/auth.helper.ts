import Cookies from 'js-cookie';

const ACCESS_TOKEN = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

export const getAccessToken = () => {
  if (!ACCESS_TOKEN) return null;
  return Cookies.get(ACCESS_TOKEN) || null;
};

export const saveTokenStorage = (accessToken: string) => {
  if (!ACCESS_TOKEN) return;
  Cookies.set(ACCESS_TOKEN, accessToken, {
    domain: 'localhost',
    sameSite: 'strict',
    expires: 1,
  });
};

export const removeFromStorage = () => {
  if (!ACCESS_TOKEN) return;
  Cookies.remove(ACCESS_TOKEN);
};
