import argon2 from "argon2";

export function hashPassword(password: string) {
  return argon2.hash(password);
}

export function verifyPassword(passwordHash: string, password: string) {
  return argon2.verify(passwordHash, password);
}
