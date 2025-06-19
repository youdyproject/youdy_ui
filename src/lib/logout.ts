import { tokenManager } from '@/lib/tokenManager';
import { api } from "@/utils/api";

export async function logout(options?: { silent?: boolean }) {
    const silent = options?.silent ?? false;

    try {
        if (!silent) {
            await api.get('/api/auth/logout');
        }
    } catch (err) {
        console.warn('서버 로그아웃 중 오류:', err);
    }

    tokenManager.clearToken();

    if (typeof window !== 'undefined') {
        window.location.href = '/intro';
    }
}