"use client"
import { useEffect, useState} from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Eye, Crown, User, MoreHorizontal, Trash2, Edit } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { UserModal } from "./UserModal"
import { toast } from "sonner"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserType {
  _id: string
  first_name: string
  last_name: string
  email: string
  profile_image: string
  avatarColor: string
  role: "superadmin" | "admin" | "employe"
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [modalOpen, setModalOpen] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL
  const token = localStorage.getItem("token");

  const colorMap: Record<string, string> = {
  "bg-red-500": "#ef4444",
  "bg-green-500": "#22c55e",
  "bg-blue-500": "#3b82f6",
  "bg-yellow-500": "#eab308",
  "bg-purple-500": "#8b5cf6",
  "bg-pink-500": "#ec4899",
  "bg-orange-500": "#f97316",
};

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
      setUsers(res.data)
    } catch (err) {
      toast.error("Failed to fetch users")
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
      toast.success("User deleted")
      fetchUsers()
    } catch (err) {
      toast.error("Failed to delete user")
    }
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || u.last_name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">User Management</h1>
          <p className="text-sm text-muted-foreground">Manage users and their permissions</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>Add User</Button>
      </div>

      <UserModal open={modalOpen} onOpenChange={setModalOpen} onUserCreated={fetchUsers} />

      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <Input placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="superadmin">Superadmin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="employe">Employe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs text-muted-foreground sm:text-sm">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left hidden sm:table-cell">Role</th>
                  <th className="px-4 py-3 text-left hidden sm:table-cell">Joined</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u._id} className="border-b">

                    <td className="px-4 py-3 flex items-center gap-2">
  <Avatar className="w-8 h-8">
    <AvatarImage 
      src={u.profile_image || undefined}
      alt={u.first_name}
    />
<AvatarFallback style={{ backgroundColor: colorMap[u.avatarColor], color: "white" }}>
  {u?.first_name?.charAt(0).toUpperCase() || "?"}
</AvatarFallback>

  </Avatar>

                      <div>
                        <div className="font-medium">{u.first_name} {u.last_name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>

</td>

                    <td className="px-4 py-3 hidden sm:table-cell capitalize">
                      <div className="flex items-center gap-2">
                         <div>{u.role === "superadmin" ? <Crown className="h-4 w-4 text-purple-500" /> :
                       u.role === "admin" ? <Crown className="h-4 w-4 text-yellow-500" /> :
                       <User className="h-4 w-4 text-blue-500" />}</div>
                      <div>{u.role}</div>
                      </div>
                      
                      </td>
                    <td className="px-4 py-3 hidden sm:table-cell">{new Date(u.createdAt).toLocaleDateString("en-GB")}</td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link to={`/dashboard/users/${u._id}`} className="flex items-center">
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled>
                            <Edit className="mr-2 h-4 w-4" /> Edit (disabled)
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="cursor-pointer"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This will remove the user permanently.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(u._id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
