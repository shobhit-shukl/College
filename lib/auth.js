import jwt from "jsonwebtoken";

function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};
  return cookieHeader.split(";").reduce((acc, pair) => {
    const [k, v] = pair.split("=").map((s) => s && s.trim());
    if (k) acc[k] = decodeURIComponent(v || "");
    return acc;
  }, {});
}

export function getTokenFromRequest(req) {
  // Try Authorization header
  try {
    const auth = req.headers.get("authorization") || req.headers.get("Authorization");
    if (auth && auth.startsWith("Bearer ")) return auth.split(" ")[1];

    // Fallback to cookie named token
    const cookieHeader = req.headers.get("cookie");
    const cookies = parseCookies(cookieHeader);
    if (cookies.token) return cookies.token;
  } catch (err) {
    return null;
  }
  return null;
}

export function verifyToken(token) {
  if (!token) throw new Error("No token provided");
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set in environment");
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}

export function requireAuth(req) {
  const token = getTokenFromRequest(req);
  if (!token) throw new Error("Unauthorized");
  const payload = verifyToken(token);
  return payload; // { id, role, iat, exp }
}

export function isAllowedRoute(role, pathname, allowedMap) {
  // allowedMap: { role: [pathPrefix,...] }
  const allowed = allowedMap[role] || [];
  return allowed.some((prefix) => pathname.startsWith(prefix));
}
