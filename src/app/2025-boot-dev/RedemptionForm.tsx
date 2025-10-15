"use client";

import { useState } from "react";
import {
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRegCopy,
} from "react-icons/fa";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function RedemptionForm() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // State to hold the code from the API
  const [redemptionCode, setRedemptionCode] = useState("");
  // State for the "copy" button UX
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(redemptionCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch(
        `/api/redeem/2025-boot-dev?email=${email}&orderId=${orderId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle errors from the API (4xx or 5xx responses)
        throw new Error(data.message || "Something went wrong");
      }

      // Success! Set the code and change status
      setRedemptionCode(data.data.code);
      setStatus("success");
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message);
    }
  };

  if (status === "success") {
    return (
      <div className="mt-12 rounded-lg border border-green-500/30 bg-green-900/30 px-4 py-8 text-center backdrop-blur-sm">
        <FaCheckCircle className="mx-auto h-12 w-12 text-green-400" />
        <h3 className="mt-4 text-xl sm:text-2xl font-semibold text-white">
          Success! Here is your code:
        </h3>

        <div className="relative mt-6 rounded-lg bg-zinc-900 p-4 font-mono text-sm md:text-lg text-yellow-300 border border-zinc-700">
          <span>{redemptionCode}</span>
          <button
            onClick={handleCopy}
            className="absolute top-1/2 right-2 -translate-y-1/2 p-2 text-zinc-400 hover:text-white transition-colors"
            title="Copy to clipboard"
          >
            {isCopied ? (
              <FaCheckCircle className="text-green-400" />
            ) : (
              <FaRegCopy />
            )}
          </button>
        </div>
        <p className="mt-2 text-sm text-zinc-400">
          {isCopied
            ? "Copied to clipboard!"
            : "Click the icon to copy your code."}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 sm:mt-12">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-lg backdrop-blur-sm"
      >
        <div className="space-y-6">
          <div>
            <label
              htmlFor="orderId"
              className="block text-sm font-medium leading-6 text-zinc-300"
            >
              Order ID
            </label>
            <div className="mt-2">
              <input
                id="orderId"
                name="orderId"
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
                className="block w-full rounded-md border-0 bg-zinc-800/80 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm sm:leading-6 transition-all"
                placeholder="e.g., 1234567890"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-zinc-300"
            >
              Email Address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 bg-zinc-800/80 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm sm:leading-6 transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>
        </div>

        {status === "error" && (
          <div className="mt-6 flex items-start gap-x-3 rounded-md border border-red-500/30 bg-red-900/30 p-3">
            <FaExclamationTriangle
              className="h-5 w-5 text-red-400 flex-shrink-0"
              aria-hidden="true"
            />
            <p className="text-sm text-red-300">{errorMessage}</p>
          </div>
        )}

        <div className="mt-8">
          <button
            type="submit"
            disabled={status === "loading"}
            className="flex w-full items-center justify-center rounded-md bg-yellow-500 px-3 py-2.5 text-sm font-semibold leading-6 text-zinc-900 shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-yellow-500 disabled:bg-zinc-600 disabled:cursor-not-allowed transition-colors"
          >
            {status === "loading" ? (
              <>
                <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Searching...
              </>
            ) : (
              "Redeem Prize"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
