--
-- All SQL statements must be on a single line and end in a semicolon.
--

-- Mail Table --
DROP TABLE IF EXISTS mail;
CREATE TABLE mail(mailbox jsonb, mail jsonb);

-- User Table --
DROP TABLE IF EXISTS users;
CREATE TABLE users(Name VARCHAR(32), EMail_address VARCHAR(32), Password_hash VARCHAR(64));

