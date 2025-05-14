import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Page() {
    return(
        <div className="relative flex flex-col items-center justify-between min-h-screen px-4 py-6">

             <div className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl my-8">
             <p className="text-xs tracking-tight  text-left w-full mb-4 pb-4 border-b">
          내 프로필
        </p>

              <p className="text-xs tracking-tight  text-left w-full mb-4 pb-4 border-b">
          내 계정
        </p>

           <p className="text-lg tracking-tight text-left w-full mb-2 ">
          wnduf0923@naver.com
           </p>
        
          <Link href="/auth/reset-password" className="w-full text-xs text-left text-blue-500 hover:underline">
        비밀번호 변경
        </Link>
        
        

            </div>
        </div>
   );
}

