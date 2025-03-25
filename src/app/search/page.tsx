import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">ShadCN/UI 적용 완료 🎉</h1>
      <Button className="mt-4">클릭하세요</Button>
    </div>
  );
}