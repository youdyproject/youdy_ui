import authApi, { api } from "@/utils/api";

// API 엔드포인트 상수
const MEMBER_API = {
  BASE: '/api/member',
  DETAIL: '/api/member/dtl',
  REGISTER: '/api/member/reg',
  UPDATE_PROFILE: '/api/member/updt/profile',
  UPDATE_PASSWORD: '/api/member/updt/password',
  EMAIL_DUPLICATE: '/api/member/email/dup',
  AUTH_CODE_VERIFY: '/api/member/authCode/verify',
} as const;

/* 회원 상세 정보 조회 */
export const fetchMemberDetail = async () => {
  const res = await authApi.get(MEMBER_API.DETAIL);
  return res.data;
};

/* 회원 프로필 수정 */
export const updateMemberProfile = async (formData: FormData) => {
  const res = await authApi.put(MEMBER_API.UPDATE_PROFILE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

/* 회원 비밀번호 수정 */
export const updateMemberPassword = async (passwordData: {
  currentPassword: string;
  newPassword: string;
}) => {
  const res = await authApi.put(MEMBER_API.UPDATE_PASSWORD, passwordData);
  return res.data;
};

/* 이메일 중복 체크 */
export const checkEmailDuplicate = async (email: string) => {
  const url = `${MEMBER_API.EMAIL_DUPLICATE}?email=${email}`;
  const res = await api.get(url);
  return res.data;
};

/* 이메일 인증 코드 검증 */
export const verifyAuthCode = async (authData: {
  email: string;
  authCode: string;
}) => {
  const res = await api.post(MEMBER_API.AUTH_CODE_VERIFY, authData);
  return res.data;
};

/* 회원 가입 */
export const registerMember = async (memberData: any) => {
  const res = await api.post(MEMBER_API.REGISTER, memberData);
  return res.data;
};
