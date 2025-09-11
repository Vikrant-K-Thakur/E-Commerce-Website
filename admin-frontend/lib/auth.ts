"use client"

export type AdminUser = { username: string; password: string }

export async function listAdmins(): Promise<AdminUser[]> {
  try {
    const response = await fetch('/api/admins')
    const result = await response.json()
    return result.success ? result.data : []
  } catch (error) {
    console.error('Failed to fetch admins:', error)
    return []
  }
}

export async function addAdmin(user: AdminUser): Promise<void> {
  const response = await fetch('/api/admins', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'add', ...user })
  })
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.error || 'Failed to add admin')
  }
}

export async function updateAdmin(oldUsername: string, updated: AdminUser): Promise<void> {
  const response = await fetch('/api/admins', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'update', oldUsername, ...updated })
  })
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.error || 'Failed to update admin')
  }
}

export async function deleteAdmin(username: string): Promise<void> {
  const response = await fetch('/api/admins', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'delete', username })
  })
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.error || 'Failed to delete admin')
  }
}

export async function validateLogin(username: string, password: string): Promise<boolean> {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    const result = await response.json()
    return result.success
  } catch (error) {
    console.error('Login validation failed:', error)
    return false
  }
}

export function setAuthCookie() {
  document.cookie = `admin_auth=1; path=/; samesite=lax`
}

export function clearAuthCookie() {
  document.cookie = `admin_auth=; Max-Age=0; path=/; samesite=lax`
}
