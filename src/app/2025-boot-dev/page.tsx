import RedemptionForm from "./RedemptionForm";

export default function BootDevRedemptionPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-start justify-center p-8 sm:pt-24">
      <div className="w-full max-w-2xl">
        <div className="text-center">
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-zinc-600 dark:text-white">
            Redeem Your One-month Boot.dev Subscription
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            Please enter your Order ID from your conference ticket and your
            email address to claim your prize.
          </p>
          <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            You can redeem your subscription at any time before 15th November at <a href="https://boot.dev/redeem" className="text-blue-500 underline">https://boot.dev/redeem</a>.
          </p>
        </div>

        {/* The interactive form component will be rendered here */}
        <RedemptionForm />
      </div>
    </div>
  );
}
