# Anjan Karan — Portfolio

Personal portfolio site for Anjan Karan (Full Stack · AI Automation · Zoho
Developer). Built with React, TypeScript, Vite and Tailwind CSS v4, animated
with Framer Motion.

## Stack

- **Vite + React 19 + TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/vite`, theme tokens in `src/index.css`)
- **Framer Motion** for scroll reveals, hero motion and the chat widget
- **lucide-react** for icons

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Project structure

```
src/
  components/       All page sections and UI pieces
    Navbar.tsx       Sticky nav with mobile menu
    Hero.tsx         Hero copy + stats
    HeroVisual.tsx   Custom SVG server/network illustration (no stock images)
    Services.tsx     "What I Build" service cards
    Projects.tsx      Selected work grid (Live / Case Study / Demo)
    Stack.tsx        Infinite-scroll tech marquee
    About.tsx        Bio + career timeline
    AgentSection.tsx  Inline "Live demo" chat panel (#agent)
    ChatPanel.tsx     Shared chat UI used by AgentSection + ChatWidget
    ChatWidget.tsx    Floating bottom-right chat bubble
    Contact.tsx       CTA + contact section
    Footer.tsx
    Reveal.tsx        Shared scroll-reveal animation wrapper
  data/
    content.ts        ALL editable site copy — profile, projects, stack,
                       timeline, and the chat agent's knowledge base
  lib/
    agent.ts           Rule-based keyword matcher powering the chat agent
  App.tsx
  index.css            Tailwind import + theme tokens (colors, fonts, marquee)
```

## Editing content

Everything text-based — name, bio, projects, stack badges, timeline, and the
chat agent's answers — lives in **`src/data/content.ts`**. Update that file
rather than hunting through components.

To teach the chat agent a new answer, add an entry to `agentKnowledgeBase`:

```ts
{
  keywords: ["pricing", "cost"],
  reply: "Here's how I price projects...",
}
```

## The AI agent chat

The chat widget (floating button + the inline demo under "AI Agent" in the
nav) is a small rule-based keyword matcher (`src/lib/agent.ts`) — it runs
entirely in the browser with no backend or API key required. It's meant both
as a working demo of the kind of assistant Anjan builds for clients, and as
an easy way for site visitors to get quick answers.

To upgrade it to a real LLM-backed agent later, swap `getAgentReply` in
`src/lib/agent.ts` for a call to your API of choice — `ChatPanel.tsx` already
handles the async send/typing-indicator flow.

## Theme

Colors, fonts and marquee/blink animation keyframes are defined once in
`src/index.css` under the Tailwind v4 `@theme` block — edit `--color-*`
tokens there to retheme the whole site.
