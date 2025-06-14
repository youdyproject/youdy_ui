"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { CheckCircle } from "lucide-react"
import api from "@/utils/api";
import Link from "next/link"

export default function Page() {
    const [currentStep, setCurrentStep] = useState<number>(1)
    const [email, setEmail] = useState<string>("")
    const [verificationCode, setVerificationCode] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false)
    const [isCodeVerified, setIsCodeVerified] = useState<boolean>(false)
    const [animating, setAnimating] = useState<boolean>(false)
    const [showVerificationInput, setShowVerificationInput] = useState(false)

    const totalSteps = 4

    const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
    const [checking, setChecking] = useState(false)

    // 실시간 중복 체크 로직 (입력할 때마다 500ms 기다려서 실행)
    useEffect(() => {
        console.log("useeffect실행중")
        if (!email || !email.includes('@')) return

        const timer = setTimeout(() => {
        setChecking(true)

        const url = "/api/member/email/dup?email=" + email

        const response = api.get(url, 
            {
                headers: {
                    FrontToken : "youdyfronttoken"
                }
            }).then((res) => {
                console.log("res:", res);
                setIsAvailable(res.data.success)
                setChecking(false)
              })
              .catch(() => {
                setIsAvailable(null)
                setChecking(false)
              })
              console.log("check:", checking);
              console.log("available:", isAvailable);
            }, 500)
          

        return () => clearTimeout(timer)
    }, [email])


    // next step용
    const goToNextStep = (nextStep: number) => {
        setAnimating(true)
        setTimeout(() => {
            setCurrentStep(nextStep)
            setAnimating(false)
        }, 300)
    }

    // 이메일 입력
    const handleEmailVerification = () => {
        // validation필요
        if (email && email.includes("@")) {
            setIsEmailVerified(true)
            setShowVerificationInput(true)
            // goToNextStep(2)
        }
    }

    // 인증번호 + 타이머
    const handleCodeVerification = () => {
        if (verificationCode) {
            setIsCodeVerified(true)
            goToNextStep(3)
        }
    }

    // 비밀번호 입력
    const handlePasswordSubmit = () => {
        if (password && password === confirmPassword) {
            goToNextStep(4)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white py-12">
            {/* 로고 */}
            <div className="mb-8 text-center">
                <Link href="/main">
                    <h4 className="text-2xl font-bold text-black">YOUDY</h4>
                </Link>
            </div>
            <div className="w-full max-w-md p-8 space-y-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                {/* 진행단계 */}
                <div className="mb-8">
                    <div className="flex flex-col items-center space-y-2">
                        <span className="text-sm font-medium text-gray-500">
                            Step {currentStep}/{totalSteps}
                        </span>
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-black h-2 rounded-full transition-all duration-500 ease-in-out"
                                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    {/* Step 1: 이메일 입력 */}
                    <div
            className={`w-full transition-all duration-300 ease-in-out ${
              currentStep === 1
                ? "opacity-100 translate-x-0"
                : currentStep < 1
                  ? "opacity-0 translate-x-full"
                  : "opacity-0 -translate-x-full"
            }`}
            style={{
              display: currentStep === 1 || animating ? "block" : "none",
              position: currentStep === 1 ? "relative" : "absolute",
            }}
          >
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center text-black">이메일 인증</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-black">
                    이메일
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="border-gray-300 focus:border-black focus:ring-black"
                      disabled={isEmailVerified}
                    />
                    <Button
                      onClick={handleEmailVerification}
                      className="bg-black hover:bg-gray-800 text-white"
                      disabled={isEmailVerified}
                    >
                      {isEmailVerified ? "전송됨" : "인증"}
                    </Button>
                  </div>
                </div>

                {/* Verification Code Input - appears after email verification */}
                {showVerificationInput && (
                  <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                    <Label htmlFor="verificationCodeStep1" className="text-black">
                      인증번호
                    </Label>
                    <Input
                      id="verificationCodeStep1"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="인증번호 6자리"
                      className="border-gray-300 focus:border-black focus:ring-black"
                    />
                    <Button
                      onClick={handleCodeVerification}
                      className="w-full bg-black hover:bg-gray-800 text-white mt-4"
                    >
                      확인
                    </Button>
                  </div>
                )}

                {isEmailVerified && !showVerificationInput && (
                  <p className="text-sm text-gray-600 text-center">인증번호가 이메일로 전송되었습니다.</p>
                )}
              </div>
            </div>
          </div>

                    {/* Step 2: 이메일 인증 코드  */}
                    <div
                        className={`w-full transition-all duration-300 ease-in-out ${currentStep === 2
                            ? "opacity-100 translate-x-0"
                            : currentStep < 2
                                ? "opacity-0 translate-x-full"
                                : "opacity-0 -translate-x-full"
                            }`}
                        style={{
                            display: currentStep === 2 || animating ? "block" : "none",
                            position: currentStep === 2 ? "relative" : "absolute",
                        }}
                    >
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-center text-black">인증번호 확인</h2>
                            <div className="space-y-2">
                                <Label htmlFor="verificationCode" className="text-black">
                                    인증번호
                                </Label>
                                <Input
                                    id="verificationCode"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    placeholder="인증번호 6자리"
                                    className="border-gray-300 focus:border-black focus:ring-black"
                                />
                                <Button onClick={handleCodeVerification} className="w-full bg-black hover:bg-gray-800 text-white mt-4">
                                    확인
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: 유저ID설정
                    <div
                        className={`w-full transition-all duration-300 ease-in-out ${currentStep === 3
                            ? "opacity-100 translate-x-0"
                            : currentStep < 3
                                ? "opacity-0 translate-x-full"
                                : "opacity-0 -translate-x-full"
                            }`}
                        style={{
                            display: currentStep === 3 || animating ? "block" : "none",
                            position: currentStep === 3 ? "relative" : "absolute",
                        }}
                    >
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-center text-black">아이디 설정</h2>
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-black">
                                    아이디
                                </Label>
                                <Input
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="사용할 아이디"
                                    className="border-gray-300 focus:border-black focus:ring-black"
                                />
                                <Button onClick={handleUsernameSubmit} className="w-full bg-black hover:bg-gray-800 text-white mt-4">
                                    다음
                                </Button>
                            </div>
                        </div>
                    </div> */}

                    {/* Step 3: 비밀번호 설정 */}
                    <div
                        className={`w-full transition-all duration-300 ease-in-out ${currentStep === 3
                            ? "opacity-100 translate-x-0"
                            : currentStep < 3
                                ? "opacity-0 translate-x-full"
                                : "opacity-0 -translate-x-full"
                            }`}
                        style={{
                            display: currentStep === 3 || animating ? "block" : "none",
                            position: currentStep === 3 ? "relative" : "absolute",
                        }}
                    >
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-center text-black">비밀번호 설정</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-black">
                                        비밀번호
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="비밀번호"
                                        className="border-gray-300 focus:border-black focus:ring-black"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-black">
                                        비밀번호 확인
                                    </Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="비밀번호 확인"
                                        className="border-gray-300 focus:border-black focus:ring-black"
                                    />
                                </div>
                                <Button onClick={handlePasswordSubmit} className="w-full bg-black hover:bg-gray-800 text-white mt-4">
                                    가입하기
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Step 4: 회원가입 완료 */}
                    <div
                        className={`w-full transition-all duration-300 ease-in-out ${currentStep === 4
                            ? "opacity-100 translate-x-0"
                            : currentStep < 4
                                ? "opacity-0 translate-x-full"
                                : "opacity-0 -translate-x-full"
                            }`}
                        style={{
                            display: currentStep === 4 || animating ? "block" : "none",
                            position: currentStep === 4 ? "relative" : "absolute",
                        }}
                    >
                        <div className="space-y-6 text-center">
                            <CheckCircle className="w-16 h-16 mx-auto text-black animate-[scale_0.5s_ease-in-out]" />
                            <h2 className="text-2xl font-bold text-black">회원가입 완료</h2>
                            <p className="text-gray-600">
                                회원가입이 성공적으로 완료되었습니다. 이제 로그인하여 서비스를 이용하실 수 있습니다.
                            </p>
                            <Button
                                onClick={() => (window.location.href = "/auth/login")}
                                className="w-full bg-black hover:bg-gray-800 text-white mt-4"
                            >
                                로그인하기
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

