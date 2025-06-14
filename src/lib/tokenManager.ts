/* 토큰 관리용 페이지 */

let accessToken: string | null = null;

export const tokenManager = {
  // 로그인 후 토큰 저장 (메모리 + sessionStorage)
  setToken: (token: string) => {
    accessToken = token;
    
    // 브라우저 환경에서만 sessionStorage 사용
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('accessToken', token);
    }
  },
  
  // API 호출 시 토큰 가져오기
  getToken: (): string | null => {
    // 1. 메모리에 있으면 바로 반환
    if (accessToken) {
      return accessToken;
    }
    
    // 2. 메모리에 없으면 sessionStorage에서 복구 시도
    if (typeof window !== 'undefined') {
      const storedToken = sessionStorage.getItem('accessToken');
      if (storedToken) {
        accessToken = storedToken; // 메모리에 다시 저장
        return storedToken;
      }
    }
    
    return null;
  },
  
  // 로그아웃 시 토큰 삭제
  clearToken: () => {
    accessToken = null;
    
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('accessToken');
    }
  },
  
  // 토큰 존재 여부 확인
  hasToken: (): boolean => {
    return tokenManager.getToken() !== null;
  }
};

// 페이지 로드 시 토큰 복구 (선택사항)
export const initTokenManager = (): void => {
  if (typeof window === 'undefined') return;
  
  // sessionStorage에서 토큰 복구
  const storedToken = sessionStorage.getItem('accessToken');
  if (storedToken && !accessToken) {
    accessToken = storedToken;
  }
};