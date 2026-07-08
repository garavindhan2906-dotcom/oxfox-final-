USE oxfox_studio;

ALTER TABLE admin_users
  ADD COLUMN username VARCHAR(100) NULL AFTER phone,
  ADD COLUMN password_hash VARCHAR(255) NULL AFTER username,
  MODIFY COLUMN phone VARCHAR(15) NULL;

ALTER TABLE admin_users
  ADD UNIQUE INDEX idx_admin_users_username (username);

DROP TABLE IF EXISTS otp_requests;
