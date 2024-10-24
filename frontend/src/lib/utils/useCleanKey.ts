export const cleanKey = (key: string) => {
  // Normalize headers and footers
  let normalizedKey = key
    .replace(
      /-----BEGIN\s*PGP\s*(PUBLIC|PRIVATE)\s*KEY-----/gi,
      (match, p1) => `-----BEGIN PGP ${p1.toUpperCase()} KEY-----`,
    )
    .replace(
      /-----END\s*PGP\s*(PUBLIC|PRIVATE)\s*KEY-----/gi,
      (match, p1) => `-----END PGP ${p1.toUpperCase()} KEY-----`,
    )
    .replace(
      /-----BEGINPGP(PUBLIC|PRIVATE)KEY-----/gi,
      (match, p1) => `-----BEGIN PGP ${p1.toUpperCase()} KEY-----`,
    )
    .replace(
      /-----ENDPGP(PUBLIC|PRIVATE)KEY-----/gi,
      (match, p1) => `-----END PGP ${p1.toUpperCase()} KEY-----`,
    );

  // Remove any extra spaces
  normalizedKey = normalizedKey.replace(/\s+/g, " ").trim();

  // Extract headers and footers
  const headerMatch = normalizedKey.match(
    /-----BEGIN PGP (PUBLIC|PRIVATE) KEY-----/,
  );
  const footerMatch = normalizedKey.match(
    /-----END PGP (PUBLIC|PRIVATE) KEY-----/,
  );

  if (!headerMatch || !footerMatch) {
    // Return the key as-is if headers/footers are not recognized
    return key;
  }

  const keyType = headerMatch[1].toUpperCase();
  const header = `-----BEGIN PGP ${keyType} KEY-----`;
  const footer = `-----END PGP ${keyType} KEY-----`;

  // Extract the content between header and footer
  const contentMatch = normalizedKey.match(
    new RegExp(`${header}([\\s\\S]*?)${footer}`, "i"),
  );
  if (!contentMatch) {
    // Return the key as-is if content cannot be extracted
    return key;
  }
  let content = contentMatch[1].replace(/\s+/g, "").trim(); // Remove all whitespace

  // Split the content into lines of 64 characters
  const contentLines = content.match(/.{1,64}/g) || [];

  // Reassemble the key with headers, content lines, and footers
  const cleanedKey = `${header}\n${contentLines.join("\n")}\n${footer}`;

  return cleanedKey;
};
