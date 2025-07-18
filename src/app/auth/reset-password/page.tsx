"use client";

import { useState, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/utils/api"; 
import { logout } from "@/lib/logout";

export default function Page() {
  const router = useRouter();

  const [prevPassword, setPrevPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordChk, setNewPasswordChk] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 입력값 업데이트 핸들러
  const handlePrevPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrevPassword(e.target.value);
  };
  const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };
  const handleNewPasswordChkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPasswordChk(e.target.value);
  };

  // validation 함수
  const validate = () => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^~()\-_=+])[A-Za-z\d@$!%*#?&^~()\-_=+]{8,}$/;

    if (!prevPassword) {
      setErrorMsg("현재 비밀번호를 입력해주세요.");
      return false;
    }

    if (!newPassword) {
      setErrorMsg("새 비밀번호를 입력해주세요.");
      return false;
    }

    if (!passwordRegex.test(newPassword)) {
      setErrorMsg(
        "새 비밀번호는 8자 이상, 영문+숫자+특수문자를 포함해야 합니다."
      );
      return false;
    }

    if (newPassword !== newPasswordChk) {
      setErrorMsg("새 비밀번호가 일치하지 않습니다.");
      return false;
    }

    setErrorMsg("");
    return true;
  };

  // 유효성 검사
  const handleChangePassword = async () => {
    if (!validate()) return;
   
    // 비밀번호 변경 요청
    try {
      const res = await authApi.put("/api/member/updt/password", {
        prevPassword,
        password: newPassword,
        passwordChk: newPasswordChk,
      });

      //  정상 처리
      if (res.status === 200 && res.data.success) {
        alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
        logout();
        router.push("/auth/login"); 
      }
    } catch (error: any) {
      console.error("비밀번호 변경 실패:", error.response?.data || error.message);

      //  에러 메시지 저장
      if (error.response?.status === 400) {
        setErrorMsg("현재 비밀번호가 일치하지 않습니다.");
      } else {
        setErrorMsg("비밀번호 변경 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-[350px] mx-auto flex flex-col items-center">
        <Link href="/main" className="flex items-center mb-6">
          <Image
            src="/YouTubeLogo.png"
            alt="로고"
            width={80}
            height={50}
            priority
            className="object-contain"
          />
          <span className="text-2xl font-semibold">Youdy</span>
        </Link>

        {/* 비밀번호 변경 입력 필드 */}
        <Input
          name="prevPassword"
          type="password"
          placeholder="현재 비밀번호"
          className="w-[350px] shadow-none mb-2 h-12"
          value={prevPassword}
          onChange={handlePrevPasswordChange}
        />

        <Input
          name="newPassword"
          type="password"
          placeholder="새 비밀번호"
          className="w-[350px] shadow-none mb-2 h-12"
          value={newPassword}
          onChange={handleNewPasswordChange}
        />

        <Input
          name="newPasswordChk"
          type="password"
          placeholder="새 비밀번호 확인"
          className="w-[350px] shadow-none mb-2 h-12"
          value={newPasswordChk}
          onChange={handleNewPasswordChkChange}
        />

        {/* 에러 메시지 출력 */}
        {errorMsg && (
          <p className="text-red-500 self-start text-sm">{errorMsg}</p>
        )}

        <Button size="login" className="!mt-2" onClick={handleChangePassword}>
          비밀번호 변경
        </Button>
      </div>
    </div>
  );
}