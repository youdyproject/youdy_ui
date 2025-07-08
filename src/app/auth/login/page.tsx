"use client"

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox";
import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { tokenManager } from '@/lib/tokenManager';
import { api } from "@/utils/api";
import Image from "next/image"
import Link from "next/link";

export default function Page() {

    const router = useRouter();
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    })
    const [loginErrMsg, setLoginErrMsg] = useState<string>("");

    /* validation 함수 */
    const validateChk = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (loginData) {
            if (loginData.email && !emailRegex.test(loginData.email)) {
                setLoginErrMsg("올바른 이메일 형식을 입력해주세요.");
                return false;
            }
            else if (!loginData.email) {
                setLoginErrMsg("이메일을 입력해주세요.");
                return false;
            }
            else if (!loginData.password) {
                setLoginErrMsg("비밀번호를 입력해주세요.");
                return false;
            }
        } else {
            setLoginErrMsg("이메일 및 비밀번호를 입력해주세요.");
            return false;
        }

        return true;
    };


    /* 이메일 입력 시 value세팅 및 validation체크 */
    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLoginData((prev) => ({
            ...prev,
            email: value,
        }));
    };

    /* 로그인 핸들러 */
    const handleLogin = async () => {

        if (!validateChk()) return;

        try {
            console.log("로그인 시도:", loginData);

            const response = await api.post("/api/auth/login", {
                email: loginData.email,
                password: loginData.password,
            }, {
                headers: {
                    FrontToken: "youdyfronttoken"
                }
            }

            );

            console.log("로그인 성공:", response.data);

            tokenManager.setToken(response.data.data.accessToken); // accessToken 메모리 저장

            console.log("localStrage:", localStorage);

            router.push("/main");  // 로그인 성공시 페이지 이동

        } catch (error: any) {
            console.error("로그인 실패:", error.response?.data || error.message);
            setLoginErrMsg("로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-[350px] mx-auto flex flex-col items-center">
                <Link href="/intro" className="flex items-center">
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
                {/* <h4 className="mb-2 text-center text-4xl">YOUDY</h4> */}
                <Input
                    name="email"
                    type="text"
                    placeholder="이메일"
                    className="w-[350px] shadow-none mb-2 h-12"
                    value={loginData.email}
                    onChange={handleEmailChange}
                // onBlur={handleEmailBlur}
                />
                <Input
                    name="password"
                    type="password"
                    placeholder="비밀번호"
                    className="w-[350px] shadow-none mb-2 h-12"
                    value={loginData.password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setLoginData((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.value,
                        }))
                    }
                />
                {loginErrMsg &&
                    <p className="text-red-500 self-start text-sm">{loginErrMsg}</p>
                }
                {/* <div className="flex items-center self-start" >
                    <Checkbox className="align-middle" />
                    <p className="ml-2 text-sm">로그인 상태유지</p>
                </div> */}
                <Button
                    size="login"
                    className="!mt-2"
                    onClick={handleLogin}
                >로그인</Button>
                <div className="flex items-center gap-4">
                    <Link href="/auth/find-account" className="mt-2 text-sm">
                        비밀번호 찾기
                    </Link>
                    <Link href="/auth/register" className="mt-2 text-sm">
                        회원가입
                    </Link>
                </div>
            </div>
        </div>
    );
}