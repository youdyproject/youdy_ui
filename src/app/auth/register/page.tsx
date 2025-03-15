import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox";
import Link from "next/link";

export default function Page() {


    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <form className="w-[400px] mx-auto flex flex-col items-center">
                <h4 className="mb-2 text-center text-2xl">YOUDY</h4>
                <p>회원가입</p>
                <div className="self-start">
                    <p>이메일</p>
                    <Input
                        type="text"
                        placeholder="이메일"
                        className="w-[400px] shadow-none mb-2 h-10"
                    />
                    <p>아이디</p>
                    <Input
                        type="password"
                        placeholder="비밀번호"
                        className="w-[400px] shadow-none mb-2 h-10"
                    />
                    <p>비밀번호</p>
                    <Input
                        type="password"
                        placeholder="비밀번호"
                        className="w-[400px] shadow-none mb-2 h-10"
                    />
                </div>
                <div className="flex items-center self-start" >
                    <Checkbox className="align-middle" />
                    <p className="ml-2 text-sm">로그인 상태유지</p>
                </div>
                <Button size="login" className="!mt-2">로그인</Button>
            </form>
        </div>
    );
}
