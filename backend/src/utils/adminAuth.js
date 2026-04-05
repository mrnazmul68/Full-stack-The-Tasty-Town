import crypto from "crypto";

const ADMIN_TOKEN_TTL_HOURS = Number(process.env.ADMIN_TOKEN_TTL_HOURS || 12);

const base64UrlEncode = (value) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");

const base64UrlDecode = (value) =>
  JSON.parse(Buffer.from(value, "base64url").toString("utf8"));

const getSessionSecret = () =>
  process.env.ADMIN_SESSION_SECRET || "change-this-admin-session-secret";

const sign = (value) =>
  crypto.createHmac("sha256", getSessionSecret()).update(value).digest("base64url");

export const getAdminCredentials = () => ({
  email: (process.env.ADMIN_EMAIL || "admin@tastytown.com").trim().toLowerCase(),
  password: process.env.ADMIN_PASSWORD || "Admin@12345",
  fullName: process.env.ADMIN_NAME || "Tasty Town Admin",
});

export const createAdminToken = ({ email, fullName }) => {
  const header = base64UrlEncode({ alg: "HS256", typ: "JWT" });
  const payload = base64UrlEncode({
    email,
    fullName,
    role: "admin",
    exp: Date.now() + ADMIN_TOKEN_TTL_HOURS * 60 * 60 * 1000,
  });
  const signature = sign(`${header}.${payload}`);

  return `${header}.${payload}.${signature}`;
};

export const verifyAdminToken = (token) => {
  if (!token) {
    throw new Error("Missing admin token.");
  }

  const [header, payload, signature] = token.split(".");

  if (!header || !payload || !signature) {
    throw new Error("Invalid admin token.");
  }

  const expectedSignature = sign(`${header}.${payload}`);

  if (signature.length !== expectedSignature.length) {
    throw new Error("Invalid admin token.");
  }

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    throw new Error("Invalid admin token.");
  }

  const decodedPayload = base64UrlDecode(payload);

  if (decodedPayload.exp <= Date.now()) {
    throw new Error("Admin session expired.");
  }

  return decodedPayload;
};
