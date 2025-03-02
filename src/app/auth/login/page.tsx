import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button"

export default function Page() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-[400px] border rounded-lg">
                <Input
                type="text"
                placeholder="아이디"
                className="w-full border-none rounded-none px-4 py-2 focus:ring-2"
                />
                <Input
                type="password"
                placeholder="비밀번호"
                className="w-full border-none rounded-none px-4 py-2"
                />
            </div>
            <Button className="mt-4 w-[400px]">로그인</Button>
        </div>
    );
}
