import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button"

export default function Page() {
    return (
        <div className="flex flex-col gap-4 p-4">
            <label className="text-sm font-medium">아이디</label>
            <Input type="text" placeholder="아이디" />
            <Button>제출</Button>
        </div>
    );
}