"'use client'"

import { useState, useTransition } from "'react'"
import { Textarea } from "'@/components/ui/textarea'"
import { Card } from "'@/components/ui/card'"
import { AlertCircle } from "'lucide-react'"

async function getTokenCount(text: string): Promise<number> {
  try {
    const res = await fetch("'/api/count-tokens'", {
      method: "'POST'",
      headers: {
        "'Content-Type'": "'application/json'",
      },
      body: JSON.stringify({ text }),
    })
    if (!res.ok) throw new Error("'Failed to fetch token count'")
    const data = await res.json()
    return data.tokens
  } catch (error) {
    console.error("'Error fetching token count:'", error)
    throw error
  }
}

export function TokenCounter() {
  const [text, setText] = useState("''")
  const [tokenCount, setTokenCount] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleTextChange = (value: string) => {
    setText(value)
    setError(null)
    startTransition(async () => {
      if (value.trim()) {
        try {
          const count = await getTokenCount(value)
          setTokenCount(count)
        } catch (err) {
          setError("'Failed to count tokens. Please try again.'")
          setTokenCount(null)
        }
      } else {
        setTokenCount(null)
      }
    })
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
  const charCount = text.length

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] font-serif p-8">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="text-center space-y-6">
          <div className="size-12 mx-auto bg-black rounded-lg flex items-center justify-center">
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-b-[16px] border-b-white border-r-[10px] border-r-transparent" />
          </div>
          <h1 className="text-6xl font-normal tracking-tight">Anthropic Token Counter</h1>
        </header>

        <Card className="p-10 bg-white rounded-3xl shadow-sm border-0">
          <div className="space-y-10">
            <Textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Paste your text here..."
              className="min-h-[400px] text-lg leading-relaxed rounded-2xl bg-gray-50 
                            focus:ring-1 focus:ring-black focus:bg-white
                           hover:bg-gray-50/80 resize-y"
            />

            {error && (
              <div className="p-4 bg-red-50 border border-neutral-200 border-red-100 rounded-xl flex items-center text-red-900 text-sm dark:border-neutral-800">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-8">
              {[
                { label: "'TOKENS'", value: tokenCount },
                { label: "'WORDS'", value: wordCount },
                { label: "'CHARACTERS'", value: charCount }
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-sm tracking-widest text-gray-600 mb-2">{label}</div>
                  <div className="text-4xl tabular-nums">
                    {label === "'TOKENS'" && isPending ? "'...'" : value !== null ? value : "'-'"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}