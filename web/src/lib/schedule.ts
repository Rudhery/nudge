import * as chrono from "chrono-node"

export interface ParsedSchedule {
  /** Title with the recognised date phrase removed. */
  title: string
  /** Parsed date, or null if none was found. */
  date: Date | null
}

/**
 * Parses a natural-language task line, pulling out a date/time if present —
 * e.g. "pay rent tomorrow 9am" → { title: "pay rent", date: <tomorrow 09:00> }.
 */
export function parseSchedule(input: string): ParsedSchedule {
  const results = chrono.parse(input, new Date(), { forwardDate: true })
  if (results.length === 0) return { title: input.trim(), date: null }

  const match = results[0]
  const title = (input.slice(0, match.index) + input.slice(match.index + match.text.length))
    .replace(/\s{2,}/g, " ")
    .trim()

  return { title: title || input.trim(), date: match.start.date() }
}

export interface Preset {
  label: string
  date: () => Date
}

/** One-tap scheduling presets. */
export function presets(): Preset[] {
  return [
    { label: "Later today", date: () => at(0, 18) },
    { label: "This evening", date: () => at(0, 21) },
    { label: "Tomorrow", date: () => at(1, 9) },
    { label: "This weekend", date: () => weekend() },
    { label: "Next week", date: () => at(7, 9) },
  ]
}

/** A short, friendly label for a scheduled date — "Today 18:00", "Tomorrow 09:00", "Mar 5 09:00". */
export function scheduleLabel(date: Date): string {
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  if (sameDay(date, today)) return `Today ${time}`
  if (sameDay(date, tomorrow)) return `Tomorrow ${time}`
  return `${date.toLocaleDateString([], { month: "short", day: "numeric" })} ${time}`
}

function at(addDays: number, hour: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + addDays)
  d.setHours(hour, 0, 0, 0)
  return d
}

function weekend(): Date {
  const d = new Date()
  const toSaturday = (6 - d.getDay() + 7) % 7 || 7
  d.setDate(d.getDate() + toSaturday)
  d.setHours(10, 0, 0, 0)
  return d
}

function sameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString()
}
