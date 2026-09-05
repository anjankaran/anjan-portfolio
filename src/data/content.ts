// Central content file — edit this to update the whole site.

export const profile = {
  name: "Anjan Karan",
  role: "Full Stack Developer · AI Automation · Zoho Developer",
  tagline: "Backend Logic That Runs Itself.",
  taglineAccent: "Itself.",
  summary:
    "I build full stack products, AI-driven workflows and Zoho automations — APIs, data models and integrations that remove manual work from the business.",
  email: "anjan.karan@vivrepanels.com",
  location: "Available worldwide · Remote",
  socials: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },

  ],
};

export const stats = [
  { value: "6+", label: "Years building software" },
  { value: "40+", label: "Projects shipped" },
  { value: "1,240 hrs", label: "Saved via automation" },
];

export type Service = {
  id: string;
  title: string;
  description: string;
  highlight?: boolean;
};

export const services: Service[] = [
  {
    id: "01",
    title: "Full Stack Apps",
    description:
      "React and Node products with typed APIs, auth, payments and clean, normalized data models.",
  },
  {
    id: "02",
    title: "AI Agents & Automation",
    description:
      "LLM pipelines, RAG over company data, and agents wired into real business systems — like the chat agent on this page.",
    highlight: true,
  },
  {
    id: "03",
    title: "Workflow Automation",
    description:
      "Event-driven workflows, queues and schedulers that replace manual spreadsheet handoffs.",
  },
  {
    id: "04",
    title: "Zoho Ecosystem",
    description:
      "CRM, Creator, Books and Flow — Deluge scripts, custom functions and API bridges.",
  },
  {
    id: "05",
    title: "Websites & Apps",
    description:
      "Marketing websites, web apps and cross-platform mobile apps, with role-based access built in from day one.",
  },
  {
    id: "06",
    title: "In-House Applications",
    description:
      "Custom software built end to end for internal teams — scoped, built, deployed and supported in-house.",
  },
];

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  kind: "Live" | "Case Study" | "Demo";
  href?: string;
  metric?: string;
  /** renders a real, running mini-app inside the card */
  demo?: "analytics" | "business" | "zoho";
};

export const projects: Project[] = [
  {
    id: "business-web-app",
    title: "Business Web Application",
    category: "React · Node · RBAC",
    description:
      "Custom web solutions for real business needs — projects, tasks and billing in one workspace, with role-based access and an audit trail.",
    tags: ["React", "Node.js", "Workflows"],
    kind: "Live",
    demo: "business",
    metric: "Replaced 4 spreadsheets and a shared inbox",
  },
  {
    id: "analytics-dashboard",
    title: "Analytics Dashboard",
    category: "Postgres · dbt · React",
    description:
      "Real-time insights for smarter decisions — Zoho, Stripe and product events modelled with dbt, then surfaced as one dashboard the whole org reads.",
    tags: ["Postgres", "dbt", "Charts"],
    kind: "Live",
    demo: "analytics",
    metric: "One source of truth across 3 systems",
  },
  {
    id: "zoho-creator",
    title: "Zoho Creator - Custom Solution",
    category: "Zoho Creator · Deluge",
    description:
      "A Zoho Creator application with a tailored frontend — customer records, filters and stage automation that behave like a product, not a form builder.",
    tags: ["Zoho Creator", "Deluge", "Custom UI"],
    kind: "Live",
    demo: "zoho",
    metric: "Field ops running fully on Zoho",
  },
  {
    id: "agent-widget",
    title: "WhatsApp Order Bot",
    category: "WhatsApp Business API · Zoho",
    description:
      "A WhatsApp automation that answers order status, returns and invoice requests instantly, pulling live data from Zoho/order APIs. Try the live demo below.",
    tags: ["WhatsApp API", "Zoho", "Automation"],
    kind: "Demo",
  },
  {
    id: "business-website",
    title: "Business Website",
    category: "Next.js · SEO · CMS",
    description:
      "Fast, SEO-friendly marketing and business websites — from landing pages to full CMS-driven sites, built for conversions.",
    tags: ["Next.js", "SEO", "CMS"],
    kind: "Live",
  },
  {
    id: "mobile-app",
    title: "Cross-Platform Mobile App",
    category: "React Native · iOS · Android",
    description:
      "A single React Native codebase shipping native iOS and Android apps — push notifications, offline sync and in-app payments.",
    tags: ["React Native", "iOS", "Android"],
    kind: "Live",
  },
  {
    id: "inhouse-platform",
    title: "In-House Operations Platform",
    category: "Full Stack · Internal Tools",
    description:
      "A ground-up in-house application replacing spreadsheets and disconnected tools with one custom system — built, deployed and maintained end to end.",
    tags: ["Full Stack", "Internal Tools", "DevOps"],
    kind: "Live",
  },
];

export const stack = [
  { label: "Node.js" },
  { label: "TypeScript" },
  { label: "Deluge", featured: true },
  { label: "Python" },
  { label: "PostgreSQL" },
  { label: "React" },
  { label: "Zoho CRM", featured: true },
  { label: "LangChain" },
  { label: "Docker" },
  { label: "AWS" },
  { label: "Zoho Creator", featured: true },
  { label: "Redis" },
];

export const timeline = [
  {
    year: "2025 — Now",
    title: "Independent Full Stack & Zoho Consultant",
    body: "Partnering with growing businesses to build custom Zoho ecosystems, internal tools and AI-powered automations.",
  },
  {
    year: "2022 — 2025",
    title: "Senior Backend Engineer",
    body: "Led API and integrations work for a SaaS platform, owning the data layer and third-party integration surface.",
  },
  {
    year: "2019 — 2022",
    title: "Full Stack Developer",
    body: "Shipped customer-facing features end to end across React front ends and Node/Python services.",
  },
];

export type ChatEntry = {
  keywords: string[];
  reply: string;
};

// --- Floating widget: general portfolio Q&A assistant (site-wide) ---

export const portfolioGreeting = (firstName: string) =>
  `Hi, I'm ${firstName}'s portfolio agent 🤖 — ask me about his stack, Zoho work, AI projects, or how to get in touch.`;

export const portfolioKnowledgeBase: ChatEntry[] = [
  {
    keywords: ["hello", "hi", "hey", "yo"],
    reply:
      "Hey! I'm Anjan's portfolio agent. Ask me about his stack, projects, Zoho work, AI automation experience, or how to get in touch.",
  },
  {
    keywords: ["stack", "tech", "technology", "tools", "language"],
    reply:
      "Anjan's daily stack: Node.js, TypeScript, Python, React and PostgreSQL — plus the Zoho ecosystem (CRM, Creator, Books, Flow with Deluge), LangChain for AI work, Docker and AWS for shipping it all.",
  },
  {
    keywords: ["zoho", "crm", "deluge", "creator", "books", "flow"],
    reply:
      "Anjan is Zoho-certified across CRM, Creator and Flow. Recent work includes a deal-routing engine on Zoho CRM, an invoice automation pipeline on Zoho Books + Flow, and an offline-first field service app on Zoho Creator.",
  },
  {
    keywords: ["ai", "agent", "automation", "llm", "rag", "gpt", "openai", "whatsapp", "bot"],
    reply:
      "On the AI side: RAG pipelines over internal docs, support copilots, and WhatsApp Business bots wired into real order/CRM systems. Scroll down to 'AI Agent' to try a live WhatsApp bot demo.",
  },
  {
    keywords: ["project", "work", "portfolio", "case study", "built"],
    reply:
      "A few highlights: Deal Ops Engine (Zoho CRM + Node), Support Copilot (RAG chatbot), Invoice Autopilot (Zoho Books/Flow), and a WhatsApp Order Bot. Scroll up to 'Selected Work' for details.",
  },
  {
    keywords: ["hire", "contact", "email", "available", "work with", "reach"],
    reply:
      `Anjan is currently available for contract and full-time work. Best way to reach him is ${profile.email}, or use the contact section below — replies usually land within a day.`,
  },
  {
    keywords: ["experience", "years", "background", "history"],
    reply:
      "6+ years building software — from full stack products to backend integrations, now focused on AI automation and the Zoho ecosystem. Check the timeline in the About section for specifics.",
  },
  {
    keywords: ["resume", "cv"],
    reply:
      `Anjan doesn't have a CV posted here, but drop your email in the contact section (or reach ${profile.email}) and he'll send one over.`,
  },
  {
    keywords: ["price", "cost", "rate", "budget"],
    reply:
      "Rates depend on project scope — full stack build, Zoho implementation, or AI automation retainer all price differently. Drop a note in the contact section with rough scope and Anjan will follow up with a quote.",
  },
  {
    keywords: ["thank", "thanks", "cool", "nice", "great"],
    reply: "Anytime! Let me know if there's anything else you'd like to know about Anjan's work.",
  },
];

export const portfolioFallback =
  "I'm a small demo agent, so my knowledge is limited — try asking about Anjan's stack, Zoho experience, AI automation work, projects, or how to get in touch.";

export const portfolioSuggestions = [
  "What's your tech stack?",
  "Tell me about your Zoho work",
  "How do I hire you?",
  "What AI projects have you built?",
];

// --- Inline "AI Agent" section: WhatsApp order-bot demo (project showcase) ---

export const waBotName = "Order Assistant";
export const waBotSubtitle = "Automated · usually replies instantly";

export const waGreeting =
  "Hi 👋 this is a simulated order assistant — a front-end demo of the WhatsApp Business bots I build. In production these connect to live order data via a backend/API (Zoho, order DB, etc). Try 'track my order', 'return item' or 'invoice'.";

export const waKnowledgeBase: ChatEntry[] = [
  {
    keywords: ["hello", "hi", "hey", "yo", "hii"],
    reply: "Hey! 👋 I can check order status, start a return, resend an invoice, or connect you to support. What do you need?",
  },
  {
    keywords: ["track", "order status", "where is my order", "order", "delivery status"],
    reply:
      "Your order #ORD-4821 is out for delivery 📦 — expected by 6:00 PM today.\nLive tracking: bit.ly/track-4821",
  },
  {
    keywords: ["cancel"],
    reply:
      "I've flagged order #ORD-4821 for cancellation ✅ — our team will confirm here on WhatsApp within 30 minutes.",
  },
  {
    keywords: ["return", "refund", "exchange"],
    reply:
      "No worries! Reply with your order ID and reason and I'll start the return — refunds land back in 3–5 business days.",
  },
  {
    keywords: ["invoice", "bill", "receipt", "payment"],
    reply:
      "Your invoice for order #ORD-4821 has been resent to your registered email 📧. Need it here instead? Just say 'send invoice here'.",
  },
  {
    keywords: ["send invoice here"],
    reply: "Here you go: bit.ly/invoice-4821 — let me know if anything looks off.",
  },
  {
    keywords: ["support", "agent", "human", "talk to someone", "help"],
    reply: "Connecting you to a support agent now — someone will join this chat shortly 🙋",
  },
  {
    keywords: ["hours", "delivery time", "shipping", "how long"],
    reply:
      "Standard delivery is 2–4 business days. Express orders placed before 2 PM arrive the next day.",
  },
  {
    keywords: ["thank", "thanks", "cool", "nice", "great", "perfect"],
    reply: "Anytime! Let me know if there's anything else you need 🙂",
  },
];

export const waFallback =
  "I didn't quite catch that — try 'track my order', 'return item', 'invoice', or 'talk to support'.";

export const waSuggestions = [
  "📦 Track my order",
  "↩️ Return an item",
  "🧾 Resend invoice",
  "🙋 Talk to support",
];
