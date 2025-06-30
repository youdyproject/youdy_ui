"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { CheckCircle, Eye, EyeOff } from "lucide-react"
import AuthTimer from "./authTimer"
import api from "@/utils/api";
import Link from "next/link"

export default function Page() {
    const [currentStep, setCurrentStep] = useState<number>(1)
    const [verificationCode, setVerificationCode] = useState<string>("")
    const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false)
    const [animating, setAnimating] = useState<boolean>(false)
    const [showVerificationInput, setShowVerificationInput] = useState(false)
    const [errMsg, setErrMsg] = useState<string>("");
    const [pwdErrMsg, setPwdErrMsg] = useState<string>("");
    const [codeErrMsg, setCodeErrMsg] = useState<string>("");
    const [resetTimerKey, setResetTimerKey] = useState(false);
    const [codeInput, setCodeInput] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordChk, setShowPasswordChk] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        passwordChk: '',
        codeVerified: '',
    });

    const totalSteps = 3


    /* 타이머 종료 */
    const handleTimeOver = () => {
        setCodeInput(true);
        setCodeErrMsg("제한 시간이 초과되었습니다. 재전송 버튼을 눌러 주세요.");
    };

    /* 타이머 리셋 */
    useEffect(() => {
        setCodeInput(false); // 타이머 리셋되면 input 활성화
        setCodeErrMsg("");
    }, [resetTimerKey]);

    // next step용
    const goToNextStep = (nextStep: number) => {
        setAnimating(true)
        setTimeout(() => {
            setCurrentStep(nextStep)
            setAnimating(false)
        }, 300)
    }

    /* 이메일 validation */
    const isValidEmail = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    /* 이메일 입력 시 */
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // 유효성 검사 실행
        if (value.length === 0) {
            setErrMsg('이메일을 입력해주세요.');
        } else if (!isValidEmail(value)) {
            setErrMsg('올바른 이메일 형식이 아닙니다.');
        } else {
            setErrMsg("");
        }
        // 이메일 상태 업데이트
        setFormData((prev) => ({
            ...prev,
            email: value,
        }));

    };

    /* 이메일 인증버튼 클릭 */
    const handleEmailVerification = async() => {

        const url = "/api/member/email/dup?email=" + formData.email

        try {

            const response = await api.get(url);

            // 중복체크 성공 시 폼/타이머 활성화, 실패 시 메시지 노출
            if (response.data.data === true) {
                setIsEmailVerified(true)    // email input 비활성화
                setShowVerificationInput(true)  // 인증번호 폼 활성화 
                setResetTimerKey(prev => !prev); // 재전송시 타이머 리셋
            } else {
                setErrMsg("이미 사용중인 이메일입니다.");
            }

        } catch (error: any) {
            console.error("이메일 중복/메일 에러:", error.response?.data || error.message)
            setErrMsg("이메일 발송 중 에러가 발생했습니다. 관리자에게 문의해 주세요.");
        }
    }

    /* 인증번호 validation + 검증 */
    const handleCodeVerification = async () => {

        // 숫자만 허용
        if (!/^\d*$/.test(verificationCode)) {
            setCodeErrMsg('숫자만 입력 가능합니다.');
            return;
        }
        // 자리수 검사
        else if (verificationCode.length > 0 && verificationCode.length !== 6) {
            setCodeErrMsg('6자리 숫자를 입력해주세요.');
            return;
        }

        // 인증번호 검증
        try {
            const response = await api.post("/api/member/authCode/verify", {
                authCode: verificationCode,
                email: formData.email
            })

            if (response.data.data === true) {
                setErrMsg("");
                goToNextStep(2);
            } else {
                setCodeErrMsg("인증번호를 확인해 주세요.");
                return;
            }

        } catch (error: any) {
            console.error("이메일 인증 에러:", error.response?.data || error.message)
            setCodeErrMsg("인증에 실패했습니다.");
        }
    }


    /* 비밀번호 validation */
    const isValidPassword = (password: string): boolean => {
        // 8자이상, 영문, 숫자, 특수문자 포함
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^~()\-_=+])[A-Za-z\d@$!%*#?&^~()\-_=+]{8,}$/;
        return passwordRegex.test(password);
    }

    /* 비밀번호 입력 */
    const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // 유효성 검사 실행
        if (value.length === 0) {
            setErrMsg('비밀번호를 입력해주세요.');
        } else if (!isValidPassword(value)) {
            setErrMsg('올바른 비밀번호 형식이 아닙니다.');
        } else {
            setErrMsg("");
        }

        // 비밀번호 상태 업데이트
        setFormData((prev) => ({
            ...prev,
            password: value
        }))
    }

    /* 비밀번호 확인 */
    const handlePwdChkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (formData.password !== value) {
            setPwdErrMsg("비밀번호가 일치하지 않습니다.");
        } else {
            setPwdErrMsg("");
        }

        setFormData((prev) => ({
            ...prev,
            passwordChk: value
        }))
    }

    /* 가입하기 */
    const handlePasswordSubmit = async () => {

        try {
            const response = await api.post("/api/member/reg", formData);

            if (response.data.data === true) {
                goToNextStep(3);
            } else {
                setErrMsg("가입에 실패했습니다.");
                return;
            }

        } catch (error: any) {
            console.error("이메일 인증 에러:", error.response?.data || error.message)
            setErrMsg("가입에 실패했습니다.");
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
                        className={`w-full transition-all duration-300 ease-in-out ${currentStep === 1
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
                                            value={formData.email}
                                            onChange={handleEmailChange}
                                            placeholder="example@email.com"
                                            className="border-gray-300 focus:border-black focus:ring-black"
                                            disabled={isEmailVerified}
                                        />
                                        <Button
                                            onClick={handleEmailVerification}
                                            className="bg-black hover:bg-gray-800 text-white"
                                            disabled={!formData.email && !!errMsg}
                                        >
                                            {isEmailVerified ? "재전송" : "인증"}
                                        </Button>
                                    </div>
                                    {/* 이메일 유효성 문구 */}
                                    {errMsg && (
                                        <p className="text-red-500 text-sm mt-1">{errMsg}</p>
                                    )}
                                </div>

                                {/* 인증번호 입력 */}
                                {showVerificationInput && (
                                    <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="verificationCodeStep1" className="text-black">
                                                인증번호
                                            </Label>
                                            <AuthTimer activeTimer={handleTimeOver} resetTrigger={resetTimerKey} />
                                        </div>
                                        <Input
                                            id="verificationCodeStep1"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            placeholder="인증번호 6자리"
                                            className="border-gray-300 focus:border-black focus:ring-black"
                                            disabled={codeInput}
                                        />
                                        {codeErrMsg && (
                                            <p className="text-sm text-red-500 mt-1">{codeErrMsg}</p>
                                        )}
                                        <Button
                                            onClick={handleCodeVerification}
                                            className="w-full bg-black hover:bg-gray-800 text-white mt-4"
                                            disabled={codeInput}
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
                    {/* Step 2: 비밀번호 설정 */}
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
                            <h2 className="text-2xl font-bold text-center text-black">비밀번호 설정</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-black">
                                        비밀번호
                                    </Label>
                                    <p className="text-xs text-gray-500">영문, 특수문자를 포함한 8자 이상의 비밀번호를 입력해주세요.</p>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handlePwdChange}
                                            placeholder="비밀번호"
                                            className="border-gray-300 focus:border-black focus:ring-black pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {/* 비밀번호 유효성 문구 */}
                                    {errMsg && (
                                        <p className="text-red-500 text-sm mt-1">{errMsg}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-black">
                                        비밀번호 확인
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showPasswordChk ? "text" : "password"}
                                            value={formData.passwordChk}
                                            onChange={handlePwdChkChange}
                                            placeholder="비밀번호 확인"
                                            className="border-gray-300 focus:border-black focus:ring-black pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswordChk(!showPasswordChk)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPasswordChk ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {/* 비밀번호 확인 유효성 문구 */}
                                    {pwdErrMsg && (
                                        <p className="text-red-500 text-sm mt-1">{pwdErrMsg}</p>
                                    )}
                                </div>
                                <Button
                                    onClick={handlePasswordSubmit}
                                    className="w-full bg-black hover:bg-gray-800 text-white mt-4"
                                    disabled={!formData.password || !formData.passwordChk || !!errMsg || !!pwdErrMsg}>
                                    가입하기
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: 회원가입 완료 */}
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

