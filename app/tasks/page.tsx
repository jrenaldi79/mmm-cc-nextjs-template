'use client'

import { useState, useEffect } from 'react'
import type { Task } from '@/types/supabase'
import Navigation from '../components/Navigation'

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

  function getPriorityColor(priority: string) {
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
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Supabase Tasks Example
            </h1>
            <p className="text-gray-600">
              This is a sample integration showing how to connect to Supabase and perform CRUD operations.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <strong>Error:</strong> {error}
            </div>
          )}

          <form onSubmit={handleCreateTask} className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Task</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter task title..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Add Task
              </button>
            </div>
          </form>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Tasks ({tasks.length})
            </h2>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="mt-4 text-gray-600">Loading tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-lg">No tasks yet. Create one above!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task)}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <p className={`text-lg ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {task.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(task.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📚 For Students</h2>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 mb-4">
              This example demonstrates:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Environment Variables:</strong> Supabase credentials stored in Replit Secrets (accessible via the Secrets tool in the sidebar)</li>
              <li><strong>API Routes:</strong> RESTful endpoints in <code className="bg-gray-100 px-2 py-1 rounded">app/api/tasks/</code></li>
              <li><strong>CRUD Operations:</strong> Create, Read, Update, Delete tasks</li>
              <li><strong>Type Safety:</strong> TypeScript types for database schema</li>
              <li><strong>Error Handling:</strong> Proper error messages and loading states</li>
              <li><strong>Client-Side State:</strong> React hooks for managing UI state</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Study the code in <code className="bg-gray-100 px-2 py-1 rounded">app/tasks/</code>, 
              <code className="bg-gray-100 px-2 py-1 rounded">app/api/tasks/</code>, and 
              <code className="bg-gray-100 px-2 py-1 rounded">lib/supabase.ts</code> to understand how it works!
            </p>
            <div className="mt-4">
              <a 
                href="/markdown-preview?file=SUPABASE_SETUP.md"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                📖 View Supabase Setup Guide
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
