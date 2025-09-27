import { api } from "@/utils/api";
import { tokenManager } from "@/lib/tokenManager";

// API 엔드포인트 상수
const AUTH_API = {
  BASE: '/api/auth',
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  TOKEN_VALIDATE: '/api/auth/token/validate',
  TOKEN_REFRESH: '/api/auth/token/refresh',
} as const;

/* 로그인 타입 정의 */
export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  // 기타 응답 데이터 타입들...
}

/* 로그인 */
export const login = async (loginData: LoginData): Promise<LoginResponse> => {
  const res = await api.post(AUTH_API.LOGIN, loginData);
  return res.data;
};

/* 로그아웃 */
export const logout = async (): Promise<void> => {
  await api.get(AUTH_API.LOGOUT);
};

/* 토큰 검증 */
export const validateToken = async (token: string): Promise<boolean> => {
  if (!token) return false;

  try {
    const response = await api.get(AUTH_API.TOKEN_VALIDATE, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.status === 200;
  } catch (error) {
    console.error('토큰 검증 API 호출 오류:', error);
    return false;
  }
};

/* 토큰 갱신 */
export const refreshToken = async (): Promise<string | null> => {
  try {
    console.log('토큰 갱신 요청');
    const response = await api.get(AUTH_API.TOKEN_REFRESH);

    if (response.status === 200) {
      const data = response.data;
      tokenManager.setToken(data.accessToken); // 새 토큰 저장
      console.log('토큰 갱신 성공');
      return data.accessToken;
    } else {
      console.error('토큰 갱신 실패:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('토큰 갱신 요청 중 오류:', error);
  }
  return null;
};
