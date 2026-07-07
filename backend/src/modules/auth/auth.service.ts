import { pool } from '../../config/db';
import { env } from '../../config/env';
import { ApiError } from '../../middleware/errorHandler';
import { signAdminToken } from '../../utils/jwt';

/**
 * DEV-ONLY PLACEHOLDER: OTP is a static code and no SMS is actually sent.
 * This must be replaced with a real SMS OTP provider (e.g. MSG91, Twilio Verify)
 * before public launch. Isolated here so the swap doesn't touch routes/controllers.
 */
export async function requestOtp(phone: string): Promise<void> {
  const [rows] = await pool.query<any[]>('SELECT id FROM admin_users WHERE phone = ? AND is_active = TRUE', [
    phone,
  ]);
  if (rows.length === 0) {
    throw new ApiError(404, 'This phone number is not registered as an admin.');
  }

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await pool.query('INSERT INTO otp_requests (phone, code, expires_at) VALUES (?, ?, ?)', [
    phone,
    env.adminStaticOtp,
    expiresAt,
  ]);
  // In production, trigger the SMS provider here instead of using a static code.
}

export async function verifyOtp(phone: string, code: string): Promise<string> {
  const [adminRows] = await pool.query<any[]>(
    'SELECT id, phone FROM admin_users WHERE phone = ? AND is_active = TRUE',
    [phone]
  );
  if (adminRows.length === 0) {
    throw new ApiError(404, 'This phone number is not registered as an admin.');
  }

  const [otpRows] = await pool.query<any[]>(
    `SELECT id FROM otp_requests
     WHERE phone = ? AND code = ? AND used = FALSE AND expires_at > NOW()
     ORDER BY created_at DESC LIMIT 1`,
    [phone, code]
  );
  if (otpRows.length === 0) {
    throw new ApiError(401, 'Invalid or expired OTP.');
  }

  await pool.query('UPDATE otp_requests SET used = TRUE WHERE id = ?', [otpRows[0].id]);

  const admin = adminRows[0];
  return signAdminToken({ adminId: admin.id, phone: admin.phone });
}
