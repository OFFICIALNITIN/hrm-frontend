export const AUTH_TOKEN_KEY = "auth_token"
export const AUTH_USER_KEY = "auth_user"

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function getStoredUser(): any | null {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem(AUTH_USER_KEY)
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function clearStoredAuth(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}
