import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

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
    return NextResponse.json({ error: "Failed to count tokens" }, { status: 500 })
  }
}