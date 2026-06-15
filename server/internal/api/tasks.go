package api

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/Rudhery/nudge/server/internal/task"
)

// taskInput is the request body for creating/updating a task. Pointer fields
// let PATCH distinguish "not provided" from a zero value.
type taskInput struct {
	Title    *string        `json:"title"`
	Notes    *string        `json:"notes"`
	Priority *task.Priority `json:"priority"`
	DueAt    *time.Time     `json:"dueAt"`
	RemindAt *time.Time     `json:"remindAt"`
}

func (s *Server) handleListTasks(w http.ResponseWriter, r *http.Request) {
	tasks, err := s.store.List(r.Context())
	if err != nil {
		s.serverError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, tasks)
}

func (s *Server) handleCreateTask(w http.ResponseWriter, r *http.Request) {
	var in taskInput
	if !decodeJSON(w, r, &in) {
		return
	}
	if in.Title == nil || strings.TrimSpace(*in.Title) == "" {
		writeError(w, http.StatusBadRequest, "title is required")
		return
	}

	priority := task.PriorityMedium
	if in.Priority != nil {
		if !in.Priority.Valid() {
			writeError(w, http.StatusBadRequest, "invalid priority")
			return
		}
		priority = *in.Priority
	}

	now := time.Now().UTC()
	t := task.Task{
		ID:        newID(),
		Title:     strings.TrimSpace(*in.Title),
		Priority:  priority,
		DueAt:     in.DueAt,
		RemindAt:  in.RemindAt,
		CreatedAt: now,
		UpdatedAt: now,
	}
	if in.Notes != nil {
		t.Notes = *in.Notes
	}

	if err := s.store.Create(r.Context(), t); err != nil {
		s.serverError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, t)
}

func (s *Server) handleGetTask(w http.ResponseWriter, r *http.Request) {
	t, err := s.store.Get(r.Context(), r.PathValue("id"))
	if s.handleStoreErr(w, err) {
		return
	}
	writeJSON(w, http.StatusOK, t)
}

func (s *Server) handleUpdateTask(w http.ResponseWriter, r *http.Request) {
	t, err := s.store.Get(r.Context(), r.PathValue("id"))
	if s.handleStoreErr(w, err) {
		return
	}

	var in taskInput
	if !decodeJSON(w, r, &in) {
		return
	}
	if in.Title != nil {
		if strings.TrimSpace(*in.Title) == "" {
			writeError(w, http.StatusBadRequest, "title cannot be empty")
			return
		}
		t.Title = strings.TrimSpace(*in.Title)
	}
	if in.Notes != nil {
		t.Notes = *in.Notes
	}
	if in.Priority != nil {
		if !in.Priority.Valid() {
			writeError(w, http.StatusBadRequest, "invalid priority")
			return
		}
		t.Priority = *in.Priority
	}
	if in.DueAt != nil {
		t.DueAt = in.DueAt
	}
	if in.RemindAt != nil {
		t.RemindAt = in.RemindAt
		t.RemindedAt = nil // re-arm the reminder
	}
	t.UpdatedAt = time.Now().UTC()

	if s.handleStoreErr(w, s.store.Update(r.Context(), t)) {
		return
	}
	writeJSON(w, http.StatusOK, t)
}

func (s *Server) handleDeleteTask(w http.ResponseWriter, r *http.Request) {
	if s.handleStoreErr(w, s.store.Delete(r.Context(), r.PathValue("id"))) {
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) handleCompleteTask(w http.ResponseWriter, r *http.Request) {
	t, err := s.store.Get(r.Context(), r.PathValue("id"))
	if s.handleStoreErr(w, err) {
		return
	}
	if t.CompletedAt == nil {
		now := time.Now().UTC()
		t.CompletedAt = &now
		t.UpdatedAt = now
		if s.handleStoreErr(w, s.store.Update(r.Context(), t)) {
			return
		}
	}
	writeJSON(w, http.StatusOK, t)
}

// --- helpers ---------------------------------------------------------------

func (s *Server) handleStoreErr(w http.ResponseWriter, err error) bool {
	switch {
	case err == nil:
		return false
	case errors.Is(err, task.ErrNotFound):
		writeError(w, http.StatusNotFound, "task not found")
		return true
	default:
		s.serverError(w, err)
		return true
	}
}

func (s *Server) serverError(w http.ResponseWriter, err error) {
	s.logger.Error("internal error", "error", err)
	writeError(w, http.StatusInternalServerError, "internal server error")
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}

func decodeJSON(w http.ResponseWriter, r *http.Request, dst any) bool {
	if err := json.NewDecoder(r.Body).Decode(dst); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body: "+err.Error())
		return false
	}
	return true
}

// newID returns a random RFC 4122 v4 UUID.
func newID() string {
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	b[6] = (b[6] & 0x0f) | 0x40
	b[8] = (b[8] & 0x3f) | 0x80
	return hex.EncodeToString(b[0:4]) + "-" + hex.EncodeToString(b[4:6]) + "-" +
		hex.EncodeToString(b[6:8]) + "-" + hex.EncodeToString(b[8:10]) + "-" +
		hex.EncodeToString(b[10:16])
}
