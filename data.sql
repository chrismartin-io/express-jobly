DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
  handle text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  num_employees int,
  description text,
  logo_url text
);


CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  title text NOT NULL,
  salary float NOT NULL,
  equity float,
  company_handle text REFERENCES companies(handle) ON DELETE CASCADE,
  date_posted date DEFAULT CURRENT_DATE NOT NULL,
  CONSTRAINT equity_check
     CHECK(equity >= 0 AND equity <=1)
)