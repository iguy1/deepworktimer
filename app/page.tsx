import DeepWorkTimer from "@/components/deep-work-timer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <DeepWorkTimer />
      </div>
    </main>
  )
}
