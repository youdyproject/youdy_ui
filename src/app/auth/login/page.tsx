"use client"

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox";
import { useState, ChangeEvent } from "react";
import { setLocalItem } from "@/utils/storage";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import Link from "next/link";

export default function Page() {
    
    const router = useRouter();
    const [loginData, setLoginData] = useState({
        email : "",
        password : "",
    })

    const handleLogin = async () => {
        try {
          console.log("로그인 시도:", loginData);
    
          const response = await api.post("/api/auth/login", {
            email: loginData.email,
            password: loginData.password,
          }, {
            headers: {
                FrontToken : "youdyfronttoken"
            }
          }
          
          );
    
          console.log("로그인 성공:", response.data);
          
          setLocalItem("token", response.data.data.accessToken);    // accessToken저장

          console.log("localStrage:", localStorage);
    
          //router.push("/dashboard");  // 로그인 성공시 페이지 이동
    
        } catch (error: any) {
          console.error("로그인 실패:", error.response?.data || error.message);
          alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.");
        }
      };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-[400px] mx-auto flex flex-col items-center">
                <h4 className="mb-2 text-center text-4xl">YOUDY</h4>
                <Input
                    name="email"
                    type="text"
                    placeholder="이메일"
                    className="w-[400px] shadow-none mb-2 h-10"
                    value={loginData.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => 
                        setLoginData((prev) => ({
                          ...prev,
                          [e.target.name]: e.target.value,
                        }))
                      }
                />
                <Input
                    name="password"
                    type="password"
                    placeholder="비밀번호"
                    className="w-[400px] shadow-none mb-2 h-10"
                    value={loginData.password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setLoginData((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.value,
                        }))
                    }
                />
                <div className="flex items-center self-start" >
                    <Checkbox className="align-middle" />
                    <p className="ml-2 text-sm">로그인 상태유지</p>
                </div>
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
