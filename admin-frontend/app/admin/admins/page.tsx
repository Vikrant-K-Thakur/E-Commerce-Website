"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { addAdmin, deleteAdmin, listAdmins, updateAdmin, AdminUser } from "../../../lib/auth"
import { Plus, Pencil, Trash2, Save, X } from "lucide-react"

type RowState = AdminUser & { editing?: boolean; originalUsername?: string }

export default function AdminsPage() {
  const [rows, setRows] = useState<RowState[]>([])
  const [newUser, setNewUser] = useState<AdminUser>({ username: "", password: "" })
  const [error, setError] = useState<string | null>(null)

  function reload() {
    setRows(listAdmins().map(a => ({ ...a, editing: false, originalUsername: a.username })))
  }

  useEffect(() => { reload() }, [])

  function handleAdd() {
    setError(null)
    try {
      if (!newUser.username.trim() || !newUser.password) {
        setError("Username and password are required")
        return
      }
      addAdmin({ username: newUser.username.trim(), password: newUser.password })
      setNewUser({ username: "", password: "" })
      reload()
    } catch (e: any) {
      setError(e?.message || "Failed to add admin")
    }
  }

  function handleEdit(idx: number) {
    setRows(prev => prev.map((r, i) => (i === idx ? { ...r, editing: true } : r)))
  }

  function handleCancel(idx: number) {
    setRows(prev => prev.map((r, i) => (i === idx ? { ...r, editing: false, username: r.originalUsername!, password: r.password } : r)))
  }

  function handleSave(idx: number) {
    setError(null)
    setRows(prev => {
      const r = prev[idx]
      try {
        if (!r.username.trim() || !r.password) throw new Error("Username and password are required")
        updateAdmin(r.originalUsername!, { username: r.username.trim(), password: r.password })
        const updated = [...prev]
        updated[idx] = { ...r, editing: false, originalUsername: r.username.trim() }
        return updated
      } catch (e: any) {
        setError(e?.message || "Failed to save")
        return prev
      }
    })
  }

  function handleDelete(username: string) {
    setError(null)
    const confirmed = window.confirm(`Delete admin "${username}"?`)
    if (!confirmed) return
    deleteAdmin(username)
    reload()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admins</h1>
        <p className="text-gray-600 mt-1">Add new admins or edit/remove existing ones.</p>
      </div>

      {/* Add new */}
      <Card>
        <CardHeader>
          <CardTitle>Add Admin</CardTitle>
          <CardDescription>Login is restricted to admin accounts listed here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-2 rounded">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder="Username"
              value={newUser.username}
              onChange={e => setNewUser({ ...newUser, username: e.target.value })}
            />
            <Input
              placeholder="Password"
              type="text"
              value={newUser.password}
              onChange={e => setNewUser({ ...newUser, password: e.target.value })}
            />
            <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> Add Admin
            </Button>
          </div>
          <p className="text-xs text-gray-500">Tip: default admin is <Badge variant="secondary">admin123 / admin123</Badge></p>
        </CardContent>
      </Card>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Accounts</CardTitle>
          <CardDescription>Update usernames and passwords inline.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-sm text-gray-600">
                  <th className="text-left py-3 px-4">USERNAME</th>
                  <th className="text-left py-3 px-4">PASSWORD</th>
                  <th className="text-left py-3 px-4">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => (
                  <tr key={r.originalUsername} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {r.editing ? (
                        <Input
                          value={r.username}
                          onChange={e =>
                            setRows(prev => prev.map((row, i) => (i === idx ? { ...row, username: e.target.value } : row)))
                          }
                        />
                      ) : (
                        <span className="font-medium text-gray-900">{r.username}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {r.editing ? (
                        <Input
                          value={r.password}
                          type="text"
                          onChange={e =>
                            setRows(prev => prev.map((row, i) => (i === idx ? { ...row, password: e.target.value } : row)))
                          }
                        />
                      ) : (
                        <span className="text-gray-700">{"•".repeat(Math.max(8, r.password.length))}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {!r.editing ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(idx)}
                            >
                              <Pencil className="w-4 h-4 mr-1" /> Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600"
                              onClick={() => handleDelete(r.username)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" /> Delete
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleSave(idx)}
                            >
                              <Save className="w-4 h-4 mr-1" /> Save
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancel(idx)}
                            >
                              <X className="w-4 h-4 mr-1" /> Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td className="py-6 px-4 text-sm text-gray-500" colSpan={3}>
                      No admins yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
