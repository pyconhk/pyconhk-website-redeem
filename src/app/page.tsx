import { FaGift, FaArrowUp } from "react-icons/fa";

export default function HomePage() {
  return (
    <div className="flex items-center justify-center p-4 md:mt-20 w-full">
      {/* The 80px in min-h is an estimate for your NavBar height, adjust if needed */}
      <div
        className="
        relative w-full max-w-2xl text-center
        rounded-2xl border border-slate-800 bg-slate-900/50
        p-8 md:p-12 shadow-2xl shadow-blue-500/10
        backdrop-blur-sm
      "
      >
        {/* Python-themed accent glow */}
        <div className="hidden md:inline-block absolute -top-1/2 -left-1/2 -z-10 h-[200px] w-[200px] rounded-full bg-blue-600/30 blur-3xl md:h-[300px] md:w-[300px]"></div>
        <div className="hidden md:inline-block absolute -bottom-1/2 -right-1/2 -z-10 h-[200px] w-[200px] rounded-full bg-yellow-400/20 blur-3xl md:h-[300px] md:w-[300px]"></div>

        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-400/10 ring-2 ring-yellow-400/30">
          {/* --- CHANGE HERE: Replaced <Gift> with <FaGift> --- */}
          {/* Note: The strokeWidth prop is specific to lucide-react, so we remove it. */}
          {/* The className handles the size and color perfectly. */}
          <FaGift className="h-12 w-12 text-yellow-400" />
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-300 md:text-5xl">
          PyCon HK Prize Portal
        </h1>

        <p className="mt-6 text-base sm:text-lg leading-8 text-slate-300">
          Congratulations on being a winner! To begin, please select your prize
          from the navigation menu above to start the redemption process.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-2">
          {/* --- CHANGE HERE: Replaced <ArrowUp> with <FaArrowUp> --- */}
          <FaArrowUp className="h-6 w-6 text-slate-200 animate-bounce" />
          <span className="text-sm font-semibold text-slate-200">
            Choose Your Prize Above
          </span>
        </div>
      </div>
    </div>
  );
}
