package scheduler

import (
	"context"
	"fmt"
	"log/slog"
	"time"

	"github.com/Rudhery/nudge/server/internal/notify"
	"github.com/Rudhery/nudge/server/internal/task"
)

// Scheduler periodically dispatches due reminders through a Notifier.
type Scheduler struct {
	store     *task.Store
	notifier  notify.Notifier
	recipient string
	interval  time.Duration
	logger    *slog.Logger
}

// New creates a Scheduler.
func New(store *task.Store, notifier notify.Notifier, recipient string, interval time.Duration, logger *slog.Logger) *Scheduler {
	return &Scheduler{
		store:     store,
		notifier:  notifier,
		recipient: recipient,
		interval:  interval,
		logger:    logger,
	}
}

// Run ticks until the context is cancelled.
func (s *Scheduler) Run(ctx context.Context) {
	ticker := time.NewTicker(s.interval)
	defer ticker.Stop()
	s.logger.Info("scheduler started", "interval", s.interval.String())

	for {
		select {
		case <-ctx.Done():
			s.logger.Info("scheduler stopped")
			return
		case <-ticker.C:
			s.tick(ctx)
		}
	}
}

func (s *Scheduler) tick(ctx context.Context) {
	now := time.Now()
	due, err := s.store.DueReminders(ctx, now)
	if err != nil {
		s.logger.Error("query due reminders", "error", err)
		return
	}
	for _, t := range due {
		message := fmt.Sprintf("Nudge: %s", t.Title)
		if err := s.notifier.Send(ctx, s.recipient, message); err != nil {
			// Leave reminded_at unset so it retries on the next tick.
			s.logger.Error("send reminder", "task", t.ID, "error", err)
			continue
		}
		if err := s.store.MarkReminded(ctx, t.ID, now); err != nil {
			s.logger.Error("mark reminded", "task", t.ID, "error", err)
		}
	}
}
