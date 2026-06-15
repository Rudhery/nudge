package task

import "time"

// Priority describes how important a task is.
type Priority string

const (
	PriorityLow    Priority = "low"
	PriorityMedium Priority = "medium"
	PriorityHigh   Priority = "high"
)

// Valid reports whether p is a known priority.
func (p Priority) Valid() bool {
	switch p {
	case PriorityLow, PriorityMedium, PriorityHigh:
		return true
	default:
		return false
	}
}

// Task is a single to-do item, optionally with a reminder.
type Task struct {
	ID          string     `json:"id"`
	Title       string     `json:"title"`
	Notes       string     `json:"notes"`
	Priority    Priority   `json:"priority"`
	DueAt       *time.Time `json:"dueAt,omitempty"`
	RemindAt    *time.Time `json:"remindAt,omitempty"`
	RemindedAt  *time.Time `json:"remindedAt,omitempty"`
	CompletedAt *time.Time `json:"completedAt,omitempty"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
}

// Done reports whether the task has been completed.
func (t Task) Done() bool { return t.CompletedAt != nil }
