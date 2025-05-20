import Header from "@/components/layout/header"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">메인 콘텐츠</h1>
        <p className="mt-4">메인 페이지 콘텐츠</p>
      </div>
    </main>
  )
}
