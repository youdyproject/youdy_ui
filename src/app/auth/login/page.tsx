import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox";

export default function Page() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-[400px] mx-auto flex flex-col items-center">
                <h4 className="mb-2 text-center">YOUDY</h4>
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
                <div className="flex self-start">
                    <Checkbox />
                    <p className="ml-2">로그인 상태유지</p>
                </div>
                <Button className="mt-4 w-[400px]">로그인</Button>
            </div>
        </div>
    );
}
