import crypto from "node:crypto";

const ENCRYPTION_KEY = "IID-ORG-123456#@";
const IV = Buffer.alloc(16, 0);

/**
 * Decrypt legacy mobile API payloads (AES-128-CBC, zero IV).
 * Same algorithm as src/lib/api/encryption.ts
 */
export function decrypt128(encryptedBase64) {
  const decipher = crypto.createDecipheriv(
    "aes-128-cbc",
    Buffer.from(ENCRYPTION_KEY, "utf8"),
    IV
  );
  let plaintext = decipher.update(encryptedBase64, "base64", "utf8");
  plaintext += decipher.final("utf8");
  return JSON.parse(plaintext);
}

export function getEncryptedBody(json) {
  return json?.body ?? json?.data?.body ?? null;
}
