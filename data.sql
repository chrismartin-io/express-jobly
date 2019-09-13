DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS users;

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
);

CREATE TABLE users (
  username text PRIMARY KEY,
  password text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  photo_url text,
  is_admin boolean DEFAULT FALSE
);