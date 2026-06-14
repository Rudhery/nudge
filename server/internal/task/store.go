package task

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	_ "modernc.org/sqlite"
)

// ErrNotFound is returned when a task does not exist.
var ErrNotFound = errors.New("task not found")

const schema = `
CREATE TABLE IF NOT EXISTS tasks (
	id           TEXT PRIMARY KEY,
	title        TEXT NOT NULL,
	notes        TEXT NOT NULL DEFAULT '',
	priority     TEXT NOT NULL DEFAULT 'medium',
	due_at       TEXT,
	remind_at    TEXT,
	reminded_at  TEXT,
	completed_at TEXT,
	created_at   TEXT NOT NULL,
	updated_at   TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_tasks_due_reminder
	ON tasks (remind_at)
	WHERE remind_at IS NOT NULL AND reminded_at IS NULL AND completed_at IS NULL;
`

const columns = `id, title, notes, priority, due_at, remind_at, reminded_at, completed_at, created_at, updated_at`

// Store persists tasks in SQLite.
type Store struct {
	db *sql.DB
}

// Open opens (creating if needed) the SQLite database at path and applies the schema.
func Open(path string) (*Store, error) {
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return nil, fmt.Errorf("open database: %w", err)
	}
	// SQLite handles a single writer; serialize to avoid "database is locked".
	db.SetMaxOpenConns(1)
	if _, err := db.Exec(schema); err != nil {
		return nil, fmt.Errorf("apply schema: %w", err)
	}
	return &Store{db: db}, nil
}

// Close closes the underlying database.
func (s *Store) Close() error { return s.db.Close() }

type scanner interface{ Scan(dest ...any) error }

func scanTask(row scanner) (Task, error) {
	var (
		t                                Task
		due, remind, reminded, completed sql.NullString
		created, updated                 string
	)
	if err := row.Scan(
		&t.ID, &t.Title, &t.Notes, &t.Priority,
		&due, &remind, &reminded, &completed, &created, &updated,
	); err != nil {
		return Task{}, err
	}
	var err error
	if t.DueAt, err = parseNullTime(due); err != nil {
		return Task{}, err
	}
	if t.RemindAt, err = parseNullTime(remind); err != nil {
		return Task{}, err
	}
	if t.RemindedAt, err = parseNullTime(reminded); err != nil {
		return Task{}, err
	}
	if t.CompletedAt, err = parseNullTime(completed); err != nil {
		return Task{}, err
	}
	if t.CreatedAt, err = time.Parse(time.RFC3339Nano, created); err != nil {
		return Task{}, err
	}
	if t.UpdatedAt, err = time.Parse(time.RFC3339Nano, updated); err != nil {
		return Task{}, err
	}
	return t, nil
}

// Create inserts a new task.
func (s *Store) Create(ctx context.Context, t Task) error {
	_, err := s.db.ExecContext(ctx,
		`INSERT INTO tasks (`+columns+`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		t.ID, t.Title, t.Notes, t.Priority,
		formatNullTime(t.DueAt), formatNullTime(t.RemindAt),
		formatNullTime(t.RemindedAt), formatNullTime(t.CompletedAt),
		t.CreatedAt.UTC().Format(time.RFC3339Nano), t.UpdatedAt.UTC().Format(time.RFC3339Nano),
	)
	return err
}

// List returns all tasks, pending first then by reminder/due/creation time.
func (s *Store) List(ctx context.Context) ([]Task, error) {
	rows, err := s.db.QueryContext(ctx,
		`SELECT `+columns+` FROM tasks
		 ORDER BY completed_at IS NOT NULL, COALESCE(remind_at, due_at, created_at)`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return collect(rows)
}

// Get returns a task by ID, or ErrNotFound.
func (s *Store) Get(ctx context.Context, id string) (Task, error) {
	row := s.db.QueryRowContext(ctx, `SELECT `+columns+` FROM tasks WHERE id = ?`, id)
	t, err := scanTask(row)
	if errors.Is(err, sql.ErrNoRows) {
		return Task{}, ErrNotFound
	}
	return t, err
}

// Update writes all mutable fields of an existing task.
func (s *Store) Update(ctx context.Context, t Task) error {
	res, err := s.db.ExecContext(ctx,
		`UPDATE tasks SET title = ?, notes = ?, priority = ?, due_at = ?, remind_at = ?,
		 reminded_at = ?, completed_at = ?, updated_at = ? WHERE id = ?`,
		t.Title, t.Notes, t.Priority,
		formatNullTime(t.DueAt), formatNullTime(t.RemindAt),
		formatNullTime(t.RemindedAt), formatNullTime(t.CompletedAt),
		t.UpdatedAt.UTC().Format(time.RFC3339Nano), t.ID,
	)
	if err != nil {
		return err
	}
	return affected(res)
}

// Delete removes a task by ID.
func (s *Store) Delete(ctx context.Context, id string) error {
	res, err := s.db.ExecContext(ctx, `DELETE FROM tasks WHERE id = ?`, id)
	if err != nil {
		return err
	}
	return affected(res)
}

// DueReminders returns tasks whose reminder is due (<= now) and not yet sent.
func (s *Store) DueReminders(ctx context.Context, now time.Time) ([]Task, error) {
	rows, err := s.db.QueryContext(ctx,
		`SELECT `+columns+` FROM tasks
		 WHERE remind_at IS NOT NULL AND reminded_at IS NULL AND completed_at IS NULL
		   AND remind_at <= ?
		 ORDER BY remind_at`,
		now.UTC().Format(time.RFC3339Nano),
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return collect(rows)
}

// MarkReminded records that a reminder was sent at the given time.
func (s *Store) MarkReminded(ctx context.Context, id string, at time.Time) error {
	stamp := at.UTC().Format(time.RFC3339Nano)
	_, err := s.db.ExecContext(ctx,
		`UPDATE tasks SET reminded_at = ?, updated_at = ? WHERE id = ?`, stamp, stamp, id)
	return err
}

func collect(rows *sql.Rows) ([]Task, error) {
	tasks := []Task{}
	for rows.Next() {
		t, err := scanTask(rows)
		if err != nil {
			return nil, err
		}
		tasks = append(tasks, t)
	}
	return tasks, rows.Err()
}

func affected(res sql.Result) error {
	n, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if n == 0 {
		return ErrNotFound
	}
	return nil
}

func formatNullTime(t *time.Time) any {
	if t == nil {
		return nil
	}
	return t.UTC().Format(time.RFC3339Nano)
}

func parseNullTime(s sql.NullString) (*time.Time, error) {
	if !s.Valid || s.String == "" {
		return nil, nil
	}
	t, err := time.Parse(time.RFC3339Nano, s.String)
	if err != nil {
		return nil, err
	}
	return &t, nil
}
