export const setCookie = ({
  name,
  value,
  expirationInMillis,
  domain: customDomain,
  path: customPath,
  secure = false,
}, doc) => {
  doc = doc || document;

  const d = new Date();
  d.setTime(d.getTime() + (expirationInMillis || 7 * 24 * 60 * 60 * 1000));

  const cookie = `${name}=${value};`;
  const expires= `expires=${d.toUTCString()};`;
  const domain = customDomain && `domain=${customDomain}`;
  const path = `path=${customPath || '/'};`;
  const secured = secure ? 'secure;' : '';

  doc.cookie = `${cookie}${expires}${domain}${path}${secured}`;
};

export const getCookie = ({ name }, doc) => {
  doc = doc || document;

  const key = `${name}=`;
  const cookies = doc.cookie.split(';');

  let myCookie = cookies.find((cookie) => cookie.includes(key));

  if (myCookie) {
    myCookie = myCookie.replace(' ', '');

    if (myCookie.indexOf(key) === 0) {
      return myCookie.substring(key.length, myCookie.length);
    }
  }

  return '';
};

export const clearCookie = ({ name, secure = false }, doc) => {
  setCookie({ name, value: '', expirationInMillis: -1, secure }, doc);
};
