// auth.js
"use client"

export type AdminUser = { username: string; password: string }

const ADMINS_KEY = "admins"

function readAdmins(): AdminUser[] {
  if (typeof window === "undefined") return []

  const raw = localStorage.getItem(ADMINS_KEY)
  if (!raw) {
    // ✅ default user is admin / admin123
    const seed: AdminUser[] = [{ username: "admin", password: "admin123" }]
    localStorage.setItem(ADMINS_KEY, JSON.stringify(seed))
    return seed
  }

  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
    const seed: AdminUser[] = [{ username: "admin", password: "admin123" }]
    localStorage.setItem(ADMINS_KEY, JSON.stringify(seed))
    return seed
  } catch {
    const seed: AdminUser[] = [{ username: "admin", password: "admin123" }]
    localStorage.setItem(ADMINS_KEY, JSON.stringify(seed))
    return seed
  }
}

function writeAdmins(admins: AdminUser[]) {
  localStorage.setItem(ADMINS_KEY, JSON.stringify(admins))
}

export function listAdmins(): AdminUser[] {
  return readAdmins()
}

export function addAdmin(user: AdminUser) {
  const admins = readAdmins()
  if (admins.some(a => a.username === user.username)) {
    throw new Error("Username already exists")
  }
  admins.push(user)
  writeAdmins(admins)
}

export function updateAdmin(oldUsername: string, updated: AdminUser) {
  const admins = readAdmins()
  const idx = admins.findIndex(a => a.username === oldUsername)
  if (idx === -1) throw new Error("Admin not found")

  if (
    oldUsername !== updated.username &&
    admins.some(a => a.username === updated.username)
  ) {
    throw new Error("Username already exists")
  }

  admins[idx] = updated
  writeAdmins(admins)
}

export function deleteAdmin(username: string) {
  const admins = readAdmins().filter(a => a.username !== username)
  writeAdmins(admins)
}

export function validateLogin(username: string, password: string): boolean {
  const admins = readAdmins()
  return admins.some(a => a.username === username && a.password === password)
}

export function setAuthCookie() {
  document.cookie = `admin_auth=1; path=/; samesite=lax`
}

export function clearAuthCookie() {
  document.cookie = `admin_auth=; Max-Age=0; path=/; samesite=lax`
}
