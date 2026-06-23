// Lightweight constants safe to import from edge middleware.

export const USE_SECURE_COOKIES = process.env.SECURE_COOKIES === "true";

export const SESSION_COOKIE_NAME = `${USE_SECURE_COOKIES ? "__Secure-" : ""}site80.session`;
