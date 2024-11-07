# Anthropic Token Counter

https://anthropic-token-counter.vercel.app/

A quick, simple token counting interface for Anthropic's API. This tool helps developers accurately count tokens for their Claude requests.

Uses Anthropic's official token counting API (https://docs.anthropic.com/en/docs/build-with-claude/token-counting).

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/jerhadf/token-counter.git
cd token-counter
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env.local` file in the root directory and add your Anthropic API key:
```
ANTHROPIC_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the counter.

## Tech Stack

- TypeScript
- [Next.js](https://nextjs.org/)
- [Anthropic API](https://docs.anthropic.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- Started with [create-next-app](https://nextjs.org/docs/api-reference/create-next-app)
- Initial interface created with [v0](https://v0.dev/chat)