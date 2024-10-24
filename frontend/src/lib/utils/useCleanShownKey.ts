export const cleanShownKey = (key: string) => {
  return key
    .replace(/-----BEGIN [A-Z\s]+ KEY-----/g, "")
    .replace(/-----END [A-Z\s]+ KEY-----/g, "")
    .replace(/\s+/g, "")
    .trim();
};
