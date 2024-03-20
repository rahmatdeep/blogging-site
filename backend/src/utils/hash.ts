export async function hashPassword(password: string) {
  try {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );

    const publicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);

    const passwordBuffer = new TextEncoder().encode(password);

    const hashBuffer = await crypto.subtle.digest("SHA-256", passwordBuffer);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    return { hashedPassword: hashHex };
  } catch (e) {
    console.error("Error: ", e);
    return null;
  }
}
