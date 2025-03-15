import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox";
import Link from "next/link";

export default function Page() {

    const handleSaveLogin = {

    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-[400px] mx-auto flex flex-col items-center">
                <h4 className="mb-2 text-center text-4xl">YOUDY</h4>
                <Input
                    type="text"
                    placeholder="아이디"
                    className="w-[400px] shadow-none mb-2 h-10"
                />
                <Input
                    type="password"
                    placeholder="비밀번호"
                    className="w-[400px] shadow-none mb-2 h-10"
                />
                <div className="flex items-center self-start" >
                    <Checkbox className="align-middle" />
                    <p className="ml-2 text-sm">로그인 상태유지</p>
                </div>
                <Button size="login" className="!mt-2">로그인</Button>
                <div className="flex items-center gap-4">
                    <Link href="/auth/find-account" className="mt-2 text-sm">
                        아이디/비밀번호 찾기
                    </Link>
                    <Link href="/auth/register" className="mt-2 text-sm">
                        회원가입
                    </Link>
                </div>
            </div>
        </div>
    );
}
