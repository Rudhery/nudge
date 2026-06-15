package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"

	"github.com/Rudhery/nudge/server/internal/api"
	"github.com/Rudhery/nudge/server/internal/config"
	"github.com/Rudhery/nudge/server/internal/notify"
	"github.com/Rudhery/nudge/server/internal/scheduler"
	"github.com/Rudhery/nudge/server/internal/task"
)

func main() {
	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))

	cfg := config.Load()

	if dir := filepath.Dir(cfg.DatabasePath); dir != "." && dir != "" {
		if err := os.MkdirAll(dir, 0o755); err != nil {
			logger.Error("create data dir", "error", err)
			os.Exit(1)
		}
	}

	store, err := task.Open(cfg.DatabasePath)
	if err != nil {
		logger.Error("open store", "error", err)
		os.Exit(1)
	}
	defer store.Close()

	if cfg.APIKey == "" {
		logger.Warn("API_KEY is empty — the API is unauthenticated (development mode)")
	}

	// Until WhatsApp delivery is wired up (issue #9), reminders are logged.
	var notifier notify.Notifier = notify.LogNotifier{Logger: logger}

	sched := scheduler.New(store, notifier, cfg.Recipient, cfg.SchedulerInterval, logger)

	srv := api.New(store, cfg.APIKey, cfg.CORSOrigin, cfg.WebDir, logger)
	httpServer := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           srv.Handler(),
		ReadHeaderTimeout: 10 * time.Second,
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	go sched.Run(ctx)

	go func() {
		logger.Info("server listening", "addr", httpServer.Addr)
		if err := httpServer.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("http server", "error", err)
			stop()
		}
	}()

	<-ctx.Done()
	logger.Info("shutting down")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := httpServer.Shutdown(shutdownCtx); err != nil {
		logger.Error("graceful shutdown", "error", err)
	}
}
