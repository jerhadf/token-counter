import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is not set')
}

console.log("Valid API key received:", !!process.env.ANTHROPIC_API_KEY, "Last 4 digits:", (process.env.ANTHROPIC_API_KEY || "").slice(-4))

const MODEL = "claude-3-5-sonnet-20241022"

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    console.log("Making Anthropic API request for text:", text)

    const response = await client.beta.messages.countTokens({
      betas: ["token-counting-2024-11-01"],
      model: MODEL,
      messages: [{
        role: "user",
        content: text
      }]
    })

    console.log("Anthropic API response:", response)

    return NextResponse.json({ tokens: response.input_tokens })
  } catch (error) {
    console.error("Token counting error:", error)

    // provide more specific error messages
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Anthropic API error: ${error.message}` },
        { status: error.status || 500 }
      )
    }

    return NextResponse.json(
      { error: "Failed to count tokens" },
      { status: 500 }
    )
  }
}