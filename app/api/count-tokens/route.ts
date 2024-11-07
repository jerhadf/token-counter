import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    const response = await client.beta.messages.countTokens({
      betas: ["token-counting-2024-11-01"],
      model: "claude-3-5-sonnet-20241022",
      messages: [{
        role: "user",
        content: text
      }]
    })

    return NextResponse.json({ tokens: response.input_tokens })
  } catch (error) {
    console.error("Token counting error:", error)
    return NextResponse.json({ error: "Failed to count tokens" }, { status: 500 })
  }
}