CREATE TABLE companies (
  handle text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  num_employees BINARY_FLOAT,
  description text,
  logo_url text
)

