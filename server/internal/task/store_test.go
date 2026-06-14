package task

import (
	"context"
	"path/filepath"
	"testing"
	"time"
)

func newTestStore(t *testing.T) *Store {
	t.Helper()
	s, err := Open(filepath.Join(t.TempDir(), "test.db"))
	if err != nil {
		t.Fatalf("open store: %v", err)
	}
	t.Cleanup(func() { _ = s.Close() })
	return s
}

func must(t *testing.T, err error) {
	t.Helper()
	if err != nil {
		t.Fatal(err)
	}
}

func TestCreateAndGet(t *testing.T) {
	s := newTestStore(t)
	ctx := context.Background()
	now := time.Now().UTC().Truncate(time.Second)

	must(t, s.Create(ctx, Task{
		ID: "abc", Title: "Buy milk", Priority: PriorityHigh,
		CreatedAt: now, UpdatedAt: now,
	}))

	got, err := s.Get(ctx, "abc")
	if err != nil {
		t.Fatalf("get: %v", err)
	}
	if got.Title != "Buy milk" || got.Priority != PriorityHigh {
		t.Fatalf("unexpected task: %+v", got)
	}
}

func TestGetNotFound(t *testing.T) {
	if _, err := newTestStore(t).Get(context.Background(), "missing"); err != ErrNotFound {
		t.Fatalf("expected ErrNotFound, got %v", err)
	}
}

func TestDueRemindersAndMark(t *testing.T) {
	s := newTestStore(t)
	ctx := context.Background()
	now := time.Now().UTC()
	past := now.Add(-time.Minute)
	future := now.Add(time.Hour)

	mk := func(id string, remind *time.Time) Task {
		return Task{ID: id, Title: id, Priority: PriorityMedium, RemindAt: remind, CreatedAt: now, UpdatedAt: now}
	}
	must(t, s.Create(ctx, mk("due", &past)))
	must(t, s.Create(ctx, mk("future", &future)))
	must(t, s.Create(ctx, mk("no-reminder", nil)))

	due, err := s.DueReminders(ctx, now)
	if err != nil {
		t.Fatalf("due reminders: %v", err)
	}
	if len(due) != 1 || due[0].ID != "due" {
		t.Fatalf("expected only 'due', got %+v", due)
	}

	must(t, s.MarkReminded(ctx, "due", now))
	if due, _ = s.DueReminders(ctx, now); len(due) != 0 {
		t.Fatalf("expected none due after marking, got %+v", due)
	}
}
