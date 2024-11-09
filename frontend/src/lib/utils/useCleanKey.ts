export const cleanShownKey = (key: string) => {
  return key
    .replace(/-----BEGIN [A-Z\s]+ KEY BLOCK-----/g, "")
    .replace(/-----END [A-Z\s]+ KEY BLOCK-----/g, "")
    .replace(/\s+/g, "")
    .trim();
};

export const formatKey = (key: string, type: string) => {
  const trimmedKey = key.trim();
  if (type === "public") {
    if (!trimmedKey.startsWith("-----BEGIN PGP PUBLIC KEY BLOCK-----")) {
      return `-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n${trimmedKey}\n-----END PGP PUBLIC KEY BLOCK-----`;
    }
  } else if (type === "private") {
    if (!trimmedKey.startsWith("-----BEGIN PGP PRIVATE KEY BLOCK-----")) {
      return `-----BEGIN PGP PRIVATE KEY BLOCK-----\n\n${trimmedKey}\n-----END PGP PRIVATE KEY BLOCK-----`;
    }
  }
  return trimmedKey; // Return the cleaned key if it already has headers/footers
};

export const cleanKey = (key: string) => {
  // Normalize headers and footers
  let normalizedKey = key
    .replace(
      /-----BEGIN\s*PGP\s*(PUBLIC|PRIVATE)\s*KEY BLOCK-----/gi,
      (match, p1) => `-----BEGIN PGP ${p1.toUpperCase()} KEY-----`,
    )
    .replace(
      /-----END\s*PGP\s*(PUBLIC|PRIVATE)\s*KEY BLOCK-----/gi,
      (match, p1) => `-----END PGP ${p1.toUpperCase()} KEY-----`,
    )
    .replace(
      /-----BEGINPGP(PUBLIC|PRIVATE)KEY BLOCK-----/gi,
      (match, p1) => `-----BEGIN PGP ${p1.toUpperCase()} KEY-----`,
    )
    .replace(
      /-----ENDPGP(PUBLIC|PRIVATE)KEY BLOCK-----/gi,
      (match, p1) => `-----END PGP ${p1.toUpperCase()} KEY-----`,
    );

  // Remove any extra spaces
  normalizedKey = normalizedKey.replace(/\s+/g, " ").trim();

  // Extract headers and footers
  const headerMatch = normalizedKey.match(
    /-----BEGIN PGP (PUBLIC|PRIVATE) KEY BLOCK-----/,
  );
  const footerMatch = normalizedKey.match(
    /-----END PGP (PUBLIC|PRIVATE) KEY BLOCK-----/,
  );

  if (!headerMatch || !footerMatch) {
    // Return the key as-is if headers/footers are not recognized
    return key;
  }

  const keyType = headerMatch[1].toUpperCase();
  const header = `-----BEGIN PGP ${keyType} KEY BLOCK-----`;
  const footer = `-----END PGP ${keyType} KEY BLOCK-----`;

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
