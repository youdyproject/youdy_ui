export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 text-sm border-t w-full">
      <div className="w-full px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="flex-1">
            <p className="font-semibold mb-2">고객센터 &gt;</p>
            <p className="text-xl font-bold">1600 - 0000</p>
            <p className="text-xs text-gray-500">평일 : 09:00 ~ 18:00</p>
            <p className="tnpm run devext-xs text-gray-500">주말, 공휴일 : 09:00 ~ 12:00</p>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <p>회사소개</p>
            <p>이용약관</p>
            <p>공지사항</p>
            <p>개인정보 처리 방침</p>
          </div>

          <div className="flex-1 border-l pl-4 text-xs text-gray-500">
            <p>(주)어쩌구 | 대표이사 저쩌구 | 서울 서초구 서초대로 00길 00타워 00층</p>
            <p>email@test.com / 사업자등록번호 000-0000000</p>
          </div>
        </div>
      </div>
    </footer>
  );
}