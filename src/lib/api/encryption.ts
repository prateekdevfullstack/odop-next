const ENCRYPTION_KEY = "IID-ORG-123456#@";
const ALGORITHM = "AES-CBC";
const KEY_LENGTH = 128;

function getKeyBytes(): BufferSource {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(ENCRYPTION_KEY);
  return bytes.buffer as ArrayBuffer;
}

function getIV(): BufferSource {
  return new ArrayBuffer(16);
}

async function importKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    getKeyBytes(),
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function encrypt128(data: unknown): Promise<string> {
  const key = await importKey();
  const plaintext = new TextEncoder().encode(JSON.stringify(data));

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv: getIV() },
    key,
    plaintext
  );

  return arrayBufferToBase64(encrypted);
}

export async function decrypt128<T = unknown>(
  encrypted: string
): Promise<T> {
  const key = await importKey();
  const ciphertext = base64ToArrayBuffer(encrypted);

  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv: getIV() },
    key,
    ciphertext
  );

  const plaintext = new TextDecoder().decode(decrypted);
  return JSON.parse(plaintext) as T;
}

export async function aes128cbcDecrypt(encrypted: string): Promise<string> {
  const key = await importKey();
  const ciphertext = base64ToArrayBuffer(encrypted);

  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv: getIV() },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}
