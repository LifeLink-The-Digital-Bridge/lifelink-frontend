
/**
 * Determines if the identifier is an email or username.
 * @param identifier - The string to check.
 * @returns "email" if the identifier is an email, otherwise "username".
 */
export function getLoginType(identifier: string): "username" | "email" {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(identifier) ? "email" : "username";
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
}

export function isValidDateFormat(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date);
}

export function capitalize(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatPhoneNumber(phone: string): string {
  if (phone.length !== 10) return phone;
  return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
}

export function generateRandomId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
