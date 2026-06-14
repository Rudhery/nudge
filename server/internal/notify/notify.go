package notify

import (
	"context"
	"log/slog"
)

// Notifier delivers a reminder message to a recipient.
//
// Implementations are pluggable so that channels (WhatsApp, Telegram, push) can
// be added without touching the scheduler.
type Notifier interface {
	Send(ctx context.Context, recipient, message string) error
}

// LogNotifier "delivers" reminders by logging them. It is the default until a
// real channel (WhatsApp via whatsmeow) is wired up — see issue #9.
type LogNotifier struct {
	Logger *slog.Logger
}

// Send logs the reminder instead of sending it.
func (n LogNotifier) Send(_ context.Context, recipient, message string) error {
	n.Logger.Info("reminder delivered (log notifier)",
		"recipient", recipient,
		"message", message,
	)
	return nil
}
