import { Button } from "@/components/ui/Button";


export default function Page() {
  return (
    <>
    <div className="relative flex flex-col items-center justify-between min-h-screen px-4 py-6">
      
      <div className="absolute top-2 left-4 text-sm font-bold">
        YOUDY
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl my-8">

        <p className="text-3xl font-extrabold tracking-tight lg:text-4xl text-left w-full mb-4">
          당신이 보는 영상을<br />저장하고, 학습하세요
        </p>

        <p className="text-2xl text-gray-600 text-left w-full mb-4">
          나만의<br />영상 학습공간
        </p>

        <div className="flex space-x-4 mb-4 self-start">
          <Button className="rounded-md px-6 py-2 text-sm bg-blue-500 font-bold text-white hover:bg-blue-600">
            로그인
          </Button>
          <Button className="rounded-md px-6 py-2 text-sm bg-gray-200 text-blue-400 hover:bg-gray-300">
            회원가입
          </Button>
        </div>

        <div className="w-full h-[300px] bg-white border border-gray-300 rounded-none flex items-center justify-center mb-4">
          <span className="text-gray-500">페이지 1,2,3,4 이미지</span>
        </div>

        <div className="flex justify-center space-x-2 mb-4 w-full text-gray-500">
          {["page1", "page2", "page3", "page4"].map((page) => (
            <Button
              key={page}
              size="icon"
              className="w-20 h-8 text-xs rounded-md"
              variant="outline"
            >
              {page}
            </Button>
          ))}
        </div>
      </div>
    </div>
     </>
  );
}