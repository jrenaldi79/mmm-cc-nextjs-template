'use client'

import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import type { Task } from '@/types/supabase'
import Navigation from '../components/Navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/tasks')
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch tasks')
      }

      setTasks(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault()

    if (!newTaskTitle.trim()) {
      setError('Task title cannot be empty')
      return
    }

    try {
      setError(null)
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          priority: newTaskPriority
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create task')
      }

      setNewTaskTitle('')
      setNewTaskPriority('medium')
      await fetchTasks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  async function handleToggleComplete(task: Task) {
    try {
      setError(null)
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to update task')
      }

      await fetchTasks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  async function handleDeleteTask(taskId: string) {
    try {
      setError(null)
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to delete task')
      }

      await fetchTasks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  function getPriorityClasses(priority: string) {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Navigation />
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-4xl">Supabase Tasks Example</CardTitle>
              <CardDescription>
                This is a sample integration showing how to connect to Supabase and perform CRUD operations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  <strong>Error:</strong> {error}
                </div>
              )}

              <form onSubmit={handleCreateTask} className="mb-8 p-6 bg-muted/50 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter task title..."
                    className="flex-1"
                  />
                  <Select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="sm:w-44"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </Select>
                  <Button type="submit">Add Task</Button>
                </div>
              </form>

              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Tasks ({tasks.length})
                </h2>

                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground">Loading tasks...</p>
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-12 bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground text-lg">No tasks yet. Create one above!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-4 p-4 bg-card border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => handleToggleComplete(task)}
                          aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                        />
                        <div className="flex-1">
                          <p className={`text-lg ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {task.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Created: {new Date(task.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className={getPriorityClasses(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          aria-label={`Delete "${task.title}"`}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">📚 For Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 mb-4">
                  This example demonstrates:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Environment Variables:</strong> Supabase credentials stored in environment variables (e.g. a <code className="bg-muted px-2 py-1 rounded">.env.local</code> file)</li>
                  <li><strong>API Routes:</strong> RESTful endpoints in <code className="bg-muted px-2 py-1 rounded">app/api/tasks/</code></li>
                  <li><strong>CRUD Operations:</strong> Create, Read, Update, Delete tasks</li>
                  <li><strong>Type Safety:</strong> TypeScript types for database schema</li>
                  <li><strong>Error Handling:</strong> Proper error messages and loading states</li>
                  <li><strong>Client-Side State:</strong> React hooks for managing UI state</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Study the code in <code className="bg-muted px-2 py-1 rounded">app/tasks/</code>,
                  <code className="bg-muted px-2 py-1 rounded">app/api/tasks/</code>, and
                  <code className="bg-muted px-2 py-1 rounded">lib/supabase.ts</code> to understand how it works!
                </p>
                <p className="text-gray-700 mt-4">
                  See <code className="bg-muted px-2 py-1 rounded">SUPABASE_SETUP.md</code> for the full setup guide.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
