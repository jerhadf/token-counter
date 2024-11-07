"use client";

import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

async function getTokenCount(text: string): Promise<number> {
  try {
    console.log(
      "Sending request to Anthropic API with text:",
      text.substring(0, 100) + "..."
    );

    const res = await fetch("/api/count-tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) throw new Error("Failed to fetch token count");
    const data = await res.json();

    console.log("Received response from Anthropic API:", data);
    return data.tokens;
  } catch (error) {
    console.error("Error fetching token count:", error);
    throw error;
  }
}

export function TokenCounter() {
  const [text, setText] = useState("");
  const [tokenCount, setTokenCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleTextChange = (value: string) => {
    setText(value);
    setError(null);

    startTransition(async () => {
      if (value.trim()) {
        try {
          const count = await getTokenCount(value);
          setTokenCount(count);
        } catch (error) {
          setError(
            `Failed to count tokens: ${
              error instanceof Error ? error.message : "Unknown error"
            }. Please try again.`
          );
          setTokenCount(null);
        }
      } else {
        setTokenCount(null);
      }
    });
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] font-serif p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full space-y-16">
        <header className="text-center">
          <h1 className="text-7xl font-normal tracking-tight font-serif">
            Anthropic Token Counter
          </h1>
        </header>

        <Card className="p-10 bg-white rounded-3xl shadow-sm border-0">
          <div className="space-y-10">
            <Textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Paste your text here..."
              className="min-h-[400px] text-xl leading-relaxed rounded-2xl
                        bg-white border border-neutral-200
                        focus:ring-2 focus:ring-[#AE5530]/20 focus:border-[#AE5530]/30
                        hover:border-neutral-300 resize-y transition-shadow duration-300
                        placeholder:text-neutral-500"
            />

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center text-red-900 text-sm">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-12">
              {[
                { label: "WORDS", value: wordCount },
                { label: "TOKENS", value: tokenCount },
                { label: "CHARACTERS", value: charCount },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-sm tracking-widest text-gray-500 mb-2">
                    {label}
                  </div>
                  <div
                    className={`tabular-nums ${
                      label === "TOKENS"
                        ? "text-6xl font-semibold"
                        : "text-4xl text-gray-600"
                    }`}
                  >
                    {label === "TOKENS" && isPending
                      ? "..."
                      : value !== null
                      ? value.toLocaleString()
                      : "-"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
