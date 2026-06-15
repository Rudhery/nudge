package config

import (
	"bufio"
	"os"
	"strings"
	"time"
)

// Config holds runtime configuration loaded from the environment.
type Config struct {
	Port              string
	APIKey            string
	DatabasePath      string
	Recipient         string
	Timezone          string
	WebDir            string
	CORSOrigin        string
	SchedulerInterval time.Duration
}

// Load reads configuration from a local .env file (if present) and the environment.
func Load() Config {
	loadDotEnv(".env")
	return Config{
		Port:              env("API_PORT", "8080"),
		APIKey:            env("API_KEY", ""),
		DatabasePath:      env("DATABASE_PATH", "./data/nudge.db"),
		Recipient:         env("REMINDER_RECIPIENT", ""),
		Timezone:          env("TIMEZONE", "UTC"),
		WebDir:            env("WEB_DIR", ""),
		CORSOrigin:        env("CORS_ORIGIN", "*"),
		SchedulerInterval: envDuration("SCHEDULER_INTERVAL", 30*time.Second),
	}
}

func env(key, fallback string) string {
	if v, ok := os.LookupEnv(key); ok && v != "" {
		return v
	}
	return fallback
}

func envDuration(key string, fallback time.Duration) time.Duration {
	if v, ok := os.LookupEnv(key); ok && v != "" {
		if d, err := time.ParseDuration(v); err == nil {
			return d
		}
	}
	return fallback
}

// loadDotEnv loads KEY=VALUE lines from path into the environment without
// overwriting variables that are already set. A missing file is not an error.
func loadDotEnv(path string) {
	f, err := os.Open(path)
	if err != nil {
		return
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		key, value, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}
		key = strings.TrimSpace(key)
		value = strings.Trim(strings.TrimSpace(value), `"'`)
		if _, exists := os.LookupEnv(key); !exists {
			_ = os.Setenv(key, value)
		}
	}
}
