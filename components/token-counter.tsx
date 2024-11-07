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
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full space-y-16">
        <header className="text-center">
          <h1 className="text-7xl font-normal tracking-tight font-serif">
            Anthropic Token Counter
          </h1>
        </header>

        <div className="space-y-6">
          <Card className="p-10 bg-white rounded-3xl shadow-sm border-0">
            <div className="space-y-10">
              <Textarea
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Paste your text here..."
                className="min-h-[400px] text-4xl leading-relaxed rounded-2xl
                          bg-white border border-neutral-200 font-sans
                          focus:ring-0 focus:border-[#AE5530]
                          hover:border-neutral-300 resize-y
                          transition-all duration-300 ease-out
                          placeholder:text-neutral-500
                          focus:shadow-[0_0_40px_rgba(174,85,48,0.2)]"
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
                    <div className="text-sm tracking-widest text-gray-500 mb-2 font-sans">
                      {label}
                    </div>
                    <div
                      className={`tabular-nums font-sans ${
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

          <p className="text-sm text-gray-500 text-center px-4">
            This interface calculates the number of tokens in text requests to
            the Anthropic API. Use it to count the tokens in system prompts or
            messages to Claude models. For more details, see the{" "}
            <a
              href="https://docs.anthropic.com/en/docs/build-with-claude/token-counting"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#AE5530] hover:underline"
            >
              Anthropic token counting documentation
            </a>{" "}
            and the{" "}
            <a
              href="https://github.com/jerhadf/token-counter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#AE5530] hover:underline"
            >
              source code
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
