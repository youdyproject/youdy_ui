import axios from "axios";
import { tokenManager } from "@/lib/tokenManager";
import { logout } from "@/lib/logout";

/* 토큰 검증용 api */
export const authApi = axios.create({
  baseURL: "http://localhost:8088", // 개발용 백엔드 주소
  headers: {
    FrontToken: "youdyfronttoken",
  },
});

/* 별도의 axios 인스턴스 (토큰검증 필요없는 경우) */
export const api = axios.create({
  baseURL: "http://localhost:8088",
  headers: {
    FrontToken: "youdyfronttoken",
    'Content-Type': 'application/json'
  },
});

/* 토큰 interceptors */
authApi.interceptors.request.use(async (config) => {
  let token = tokenManager.getToken(); // 자동으로 메모리 > sessionStorage 순서로 확인

  if (token) {
    console.log('토큰 검증을 시작합니다. 토큰:', token ? '존재함' : '없음');

    // 매번 토큰 검증 API 호출
    const isValid = await validateToken(token);

    if (!isValid) {
      console.log('토큰이 유효하지 않습니다. 갱신을 시도합니다.');

      try {
        const newToken = await refreshToken();
        if (newToken) {
          token = newToken;
          console.log('토큰이 성공적으로 갱신되었습니다.');
        } else {
          // 갱신 실패 시 로그아웃
          logout({ silent: true });
          return Promise.reject(new Error('토큰 갱신 실패'));
        }
      } catch (error) {
        logout({ silent: true });
        return Promise.reject(error);
      }
    } else {
      console.log('토큰이 유효합니다.');
    }

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* 401 에러 시 토큰 갱신 또는 로그아웃 */
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log('401 에러 발생. 토큰 갱신을 시도합니다.');

      try {
        const newToken = await refreshToken();
        if (newToken) {
          console.log('401 에러 후 토큰 갱신 성공. 요청을 재시도합니다.');
          // 새 토큰으로 재시도
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return authApi.request(error.config);
        }
      } catch (refreshError) {
        console.error('401 에러 후 토큰 갱신 실패:', refreshError);
        // 갱신 실패 시 로그아웃
        logout({ silent: true });
      }
    }
    return Promise.reject(error);
  }
);

/* 토큰 검증 */
async function validateToken(token: string): Promise<boolean> {

  if (!token) return false;

  try {
    const response = await api.get('/api/auth/token/validate', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.status === 200;
  } catch (error) {
    console.error('토큰 검증 API 호출 오류:', error);
    return false;
  }
}

/* 토큰 갱신 */
async function refreshToken(): Promise<string | null> {
  try {
    console.log('토큰 갱신 요청');
    const response = await api.get('/api/auth/token/refresh');

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
}

export default authApi;