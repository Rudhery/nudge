import { useCallback, useEffect, useState } from "react"

import { api } from "@/lib/api"
import type { NewTask, Task, TaskPatch } from "@/types"

export interface UseTasks {
  tasks: Task[]
  loading: boolean
  error: string | null
  reload: () => void
  addTask: (input: NewTask) => Promise<void>
  updateTask: (id: string, patch: TaskPatch) => Promise<Task>
  setCompleted: (id: string, completed: boolean) => Promise<Task>
  toggleComplete: (task: Task) => Promise<void>
  removeTask: (id: string) => Promise<void>
}

export function useTasks(): UseTasks {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(() => {
    setLoading(true)
    api
      .listTasks()
      .then((data) => {
        setTasks(data)
        setError(null)
      })
      .catch((err: unknown) => setError(errorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  useEffect(reload, [reload])

  const addTask = useCallback(async (input: NewTask) => {
    const created = await api.createTask(input)
    setTasks((prev) => [created, ...prev])
  }, [])

  const updateTask = useCallback(async (id: string, patch: TaskPatch) => {
    const updated = await api.updateTask(id, patch)
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    return updated
  }, [])

  const setCompleted = useCallback(async (id: string, completed: boolean) => {
    const updated = await api.updateTask(id, { completed })
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    return updated
  }, [])

  const toggleComplete = useCallback(async (task: Task) => {
    const updated = await api.updateTask(task.id, { completed: task.completedAt == null })
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
  }, [])

  const removeTask = useCallback(async (id: string) => {
    await api.deleteTask(id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return {
    tasks,
    loading,
    error,
    reload,
    addTask,
    updateTask,
    setCompleted,
    toggleComplete,
    removeTask,
  }
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong"
}
