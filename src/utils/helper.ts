import crypto from "crypto"


export function generateGuestCartId() {
  return `guest_${crypto.randomUUID()}`;
}


export function generateUniqueCode() {
  return crypto.randomUUID().replace(/-/g, "").substring(0, 25);
}