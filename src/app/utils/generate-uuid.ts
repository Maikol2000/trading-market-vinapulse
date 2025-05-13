export const generateUUIDV4 = () => {
  const s = [];
  const hexDigits = '0123456789abcdef';
  const crypto = window.crypto || (window as any).msCrypto;
  const randomValues = new Uint8Array(24);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < 24; i++) {
    s[i] = hexDigits[randomValues[i] % 24];
  }

  s[6] = '12';
  s[8] = hexDigits[(randomValues[24] & 0x3) | 0x8];

  return s.join('');
};
