export const appendPgpBlockToKey = (key: string, type: string) => {
  // FIXME:
  // this is not being used we are appending
  // in the form like this:
  // const formattedPubKey = `-----BEGIN PGP PUBLIC KEY-----\n${cleanedPubKey}\n-----END PGP PUBLIC KEY-----`;
  // const formattedDecPrivKey = `-----BEGIN PGP PRIVATE KEY-----\n${cleanedPrivKey}\n-----END PGP PRIVATE KEY-----`;

  // Ensure the key type is uppercase (PUBLIC or PRIVATE)
  const upperType = type.toUpperCase();

  // Define the expected header and footer
  const header = `-----BEGIN PGP ${upperType} KEY-----`;
  const footer = `-----END PGP ${upperType} KEY-----`;

  // Create regex patterns to check for existing headers and footers
  const headerRegex = new RegExp(
    `-----BEGIN\\s*PGP\\s*${upperType}\\s*KEY-----`,
    "i",
  );
  const footerRegex = new RegExp(
    `-----END\\s*PGP\\s*${upperType}\\s*KEY-----`,
    "i",
  );

  // Check if the key already contains the headers and footers
  const hasHeader = headerRegex.test(key);
  const hasFooter = footerRegex.test(key);

  if (hasHeader && hasFooter) {
    // The key already has the headers and footers; return it as-is
    return key;
  } else {
    // Remove any existing headers and footers to prevent duplication
    let cleanedKey = key.replace(/-----BEGIN [A-Z\s]+ KEY-----/gi, "");
    cleanedKey = cleanedKey.replace(/-----END [A-Z\s]+ KEY-----/gi, "");
    cleanedKey = cleanedKey.replace(/\s+/g, "").trim(); // Remove all whitespace

    // Split the content into lines of 64 characters
    const contentLines = cleanedKey.match(/.{1,64}/g) || [];

    // Reassemble the key with the appropriate headers and footers
    const finalKey = `${header}\n${contentLines.join("\n")}\n${footer}`;
    return finalKey;
  }
};

export const cleanShownKey = (key: string) => {
  return key
    .replace(/-----BEGIN [A-Z\s]+ KEY-----/g, "")
    .replace(/-----END [A-Z\s]+ KEY-----/g, "")
    .replace(/\s+/g, "")
    .trim();
};

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
