"use client"

import { useState, useEffect } from "react"
import { AppHeader } from "@/components/app-header"
import { useAuth } from "@/lib/AuthContext"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ChevronDown, Link2, MoreVertical, Plus, X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AllModelsPage() {
  const [open, setOpen] = useState(false)
  const [models, setModels] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    url: ""
  })

  // Add gradient color combinations
  const gradients = [
    'from-blue-500 to-purple-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-amber-500',
    'from-pink-500 to-rose-500',
    'from-indigo-500 to-violet-500',
    'from-red-500 to-orange-500',
    'from-cyan-500 to-blue-500',
    'from-fuchsia-500 to-pink-500'
  ]

  const fetchUserModels = async () => {
    console.log('Fetching user models...')
    console.log('User ID:', user?.id)
    
    if (!user?.id) {
      console.log('No user ID found, returning early')
      return
    }
    
    try {
      const url = `https://zephea-api.vercel.app/api/get_user_models?uuid=${user.id}`
      console.log('Fetching from URL:', url)
      
      const response = await fetch(url)
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Received data:', data)
      console.log('Data type:', typeof data)
      
      // Extract the models array from the response
      const modelsArray = data.models || []
      console.log('Models array:', modelsArray)
      
      setModels(modelsArray)
      console.log('Models state updated')
      
      // Add a timeout to log the updated state
      setTimeout(() => {
        console.log('Models state after update:', models)
      }, 100)
    } catch (error) {
      console.error('Error fetching models:', error)
    } finally {
      console.log('Fetch complete, setting loading to false')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log('useEffect triggered, current user:', user)
    console.log('Current models state:', models)
    fetchUserModels()
  }, [user?.id])

  // Add effect to monitor models state changes
  useEffect(() => {
    console.log('Models state changed:', models)
    console.log('Has models:', models.length > 0)
  }, [models])

  const hasModels = models.length > 0

  const handleSubmit = () => {
    // Handle form submission here
    console.log(formData)
    setOpen(false)
  }

  return (
    <div className="flex h-full flex-col">
      <AppHeader 
        breadcrumbs={[
          { title: "Models", href: "/all-models" }
        ]}
        actions={
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                New Model
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[800px] sm:w-[1088px] p-6">
              <div className="flex justify-between items-center mb-6">
                <SheetHeader className="gap-2">
                  <SheetTitle className="text-2xl">Create New Model</SheetTitle>
                  <SheetDescription>
                    Add a new model to your workspace. Fill out the details below.
                  </SheetDescription>
                </SheetHeader>
                <SheetClose asChild>
                  <button className="rounded-full p-2 hover:bg-gray-100 cursor-pointer">
                    <X className="h-4 w-4" />
                  </button>
                </SheetClose>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter model name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="cursor-text"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="advertising" className="cursor-pointer">Advertising</SelectItem>
                      <SelectItem value="amortization" className="cursor-pointer">Amortization</SelectItem>
                      <SelectItem value="general" className="cursor-pointer">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">URL</Label>
                  <Input 
                    id="url" 
                    placeholder="https://"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    className="cursor-text"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button onClick={() => setOpen(false)} variant="outline" className="cursor-pointer">Cancel</Button>
                  <Button onClick={handleSubmit} className="cursor-pointer">Create Model</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        }
      />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">All Models</h2>
        </div>
        
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead className="w-[150px]">Category</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[32px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Loading models...
                    </TableCell>
                  </TableRow>
                ) : hasModels ? (
                  models.map((model, index) => (
                    <TableRow key={model.id}>
                      <TableCell>
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradients[index % gradients.length]} opacity-80`}></div>
                      </TableCell>
                      <TableCell>{model.model_name}</TableCell>
                      <TableCell>{model.model_category}</TableCell>
                      <TableCell>{new Date(model.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No models found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
} 