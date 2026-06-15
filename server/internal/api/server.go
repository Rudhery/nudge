package api

import (
	"crypto/subtle"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/Rudhery/nudge/server/internal/task"
)

// Server wires HTTP handlers to the task store.
type Server struct {
	store      *task.Store
	apiKey     string
	corsOrigin string
	webDir     string
	logger     *slog.Logger
}

// New creates a Server.
func New(store *task.Store, apiKey, corsOrigin, webDir string, logger *slog.Logger) *Server {
	return &Server{
		store:      store,
		apiKey:     apiKey,
		corsOrigin: corsOrigin,
		webDir:     webDir,
		logger:     logger,
	}
}

// Handler builds the HTTP handler (routes + middleware).
func (s *Server) Handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", s.handleHealth)

	api := http.NewServeMux()
	api.HandleFunc("GET /api/tasks", s.handleListTasks)
	api.HandleFunc("POST /api/tasks", s.handleCreateTask)
	api.HandleFunc("GET /api/tasks/{id}", s.handleGetTask)
	api.HandleFunc("PATCH /api/tasks/{id}", s.handleUpdateTask)
	api.HandleFunc("DELETE /api/tasks/{id}", s.handleDeleteTask)
	api.HandleFunc("POST /api/tasks/{id}/complete", s.handleCompleteTask)
	mux.Handle("/api/", s.authenticate(api))

	if s.webDir != "" {
		mux.Handle("/", s.staticHandler())
	}

	return s.cors(mux)
}

func (s *Server) handleHealth(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

// authenticate enforces a bearer API key, unless none is configured (dev mode).
func (s *Server) authenticate(next http.Handler) http.Handler {
	const prefix = "Bearer "
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if s.apiKey == "" {
			next.ServeHTTP(w, r)
			return
		}
		auth := r.Header.Get("Authorization")
		token := strings.TrimPrefix(auth, prefix)
		if !strings.HasPrefix(auth, prefix) ||
			subtle.ConstantTimeCompare([]byte(token), []byte(s.apiKey)) != 1 {
			writeError(w, http.StatusUnauthorized, "invalid or missing API key")
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (s *Server) cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", s.corsOrigin)
		w.Header().Set("Vary", "Origin")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// staticHandler serves the built web app with SPA fallback to index.html.
func (s *Server) staticHandler() http.Handler {
	fs := http.FileServer(http.Dir(s.webDir))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		path := filepath.Join(s.webDir, filepath.Clean(r.URL.Path))
		if info, err := os.Stat(path); err == nil && !info.IsDir() {
			fs.ServeHTTP(w, r)
			return
		}
		http.ServeFile(w, r, filepath.Join(s.webDir, "index.html"))
	})
}
