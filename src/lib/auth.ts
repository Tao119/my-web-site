import { cookies } from 'next/headers';
import { createHash } from 'crypto';

// Default admin credentials
const DEFAULT_ADMIN_PASSWORD = 'password';
const ADMIN_EMAIL = 'tao.dama.art@gmail.com';
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-secret-key-change-in-production';

// Simple hash function for password storage (in production, use bcrypt)
function hashPassword(password: string): string {
    return createHash('sha256').update(password + SESSION_SECRET).digest('hex');
}

// In a real application, this would be stored in a database
// For now, we'll use environment variables or defaults
let ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || hashPassword(DEFAULT_ADMIN_PASSWORD);

// Session token generation with longer expiry
function generateSessionToken(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return Buffer.from(`${timestamp}-${random}-${SESSION_SECRET}`).toString('base64');
}

// Session token validation with extended expiry (7 days)
function validateSessionToken(token: string): boolean {
    try {
        const decoded = Buffer.from(token, 'base64').toString();
        const parts = decoded.split('-');
        if (parts.length !== 3) return false;

        const timestamp = parseInt(parts[0]);
        const now = Date.now();
        const sevenDays = 7 * 24 * 60 * 60 * 1000; // 7 days

        // Check if token is not expired (7 days)
        if (now - timestamp > sevenDays) return false;

        // Check if secret matches
        return parts[2] === SESSION_SECRET;
    } catch {
        return false;
    }
}

export async function verifyPassword(password: string): Promise<boolean> {
    try {
        const hashedInput = hashPassword(password);
        return hashedInput === ADMIN_PASSWORD_HASH;
    } catch (error) {
        // エラーログを無効化
        return false;
    }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
        // Verify current password
        const isCurrentPasswordValid = hashPassword(currentPassword) === ADMIN_PASSWORD_HASH;
        if (!isCurrentPasswordValid) {
            return { success: false, error: '現在のパスワードが正しくありません' };
        }

        // Validate new password
        if (newPassword.length < 6) {
            return { success: false, error: '新しいパスワードは6文字以上である必要があります' };
        }

        // Hash new password
        const newPasswordHash = hashPassword(newPassword);

        // In a real application, this would be saved to a database
        // For now, we'll update the in-memory hash
        ADMIN_PASSWORD_HASH = newPasswordHash;

        // TODO: In production, save to database or secure storage
        // ログ出力を無効化

        return { success: true };
    } catch (error) {
        // エラーログを無効化
        return { success: false, error: 'パスワードの変更に失敗しました' };
    }
}

export async function createSession(): Promise<string> {
    const token = generateSessionToken();
    const cookieStore = cookies();

    cookieStore.set('admin-session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
    });

    return token;
}

export async function verifySession(): Promise<boolean> {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('admin-session')?.value;

        if (!token) return false;

        return validateSessionToken(token);
    } catch {
        return false;
    }
}

export async function getSessionInfo(): Promise<{
    isValid: boolean;
    expiresAt?: Date;
    createdAt?: Date;
    email?: string;
}> {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('admin-session')?.value;

        if (!token) {
            return { isValid: false };
        }

        const isValid = validateSessionToken(token);
        if (!isValid) {
            return { isValid: false };
        }

        // Extract timestamp from token
        const decoded = Buffer.from(token, 'base64').toString();
        const parts = decoded.split('-');
        const timestamp = parseInt(parts[0]);
        const createdAt = new Date(timestamp);
        const expiresAt = new Date(timestamp + (7 * 24 * 60 * 60 * 1000)); // 7 days

        return {
            isValid: true,
            createdAt,
            expiresAt,
            email: ADMIN_EMAIL,
        };
    } catch {
        return { isValid: false };
    }
}

export async function destroySession(): Promise<void> {
    const cookieStore = cookies();
    cookieStore.delete('admin-session');
}

export function getAdminEmail(): string {
    return ADMIN_EMAIL;
}