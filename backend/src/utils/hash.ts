export async function hashPassword(password: string) {
  try {
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
