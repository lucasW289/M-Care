// src/app/page.tsx
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-20 px-6 text-center">
        <h1 className="text-4xl font-bold text-[#332522] mb-4">
          Welcome to MCare
        </h1>
        <p className="text-lg text-[#5c4c47] mb-8">
          Private & Accessible Sexual Health Support — Book confidential
          sessions online.
        </p>
        <button className="bg-[#ffa092] text-white px-6 py-3 rounded-full shadow hover:bg-[#ff8777] transition">
          Get Started
        </button>
      </main>
    </>
  );
}
