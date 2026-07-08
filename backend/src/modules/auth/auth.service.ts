import bcrypt from 'bcryptjs';
import { pool } from '../../config/db';
import { ApiError } from '../../middleware/errorHandler';
import { signAdminToken } from '../../utils/jwt';

export async function loginAdmin(username: string, password: string): Promise<string> {
  const [rows] = await pool.query<any[]>(
    'SELECT id, username, password_hash FROM admin_users WHERE username = ? AND is_active = TRUE',
    [username]
  );
  if (rows.length === 0) {
    throw new ApiError(401, 'Invalid username or password.');
  }

  const admin = rows[0];
  const valid = admin.password_hash && (await bcrypt.compare(password, admin.password_hash));
  if (!valid) {
    throw new ApiError(401, 'Invalid username or password.');
  }

  return signAdminToken({ adminId: admin.id, username: admin.username });
}
