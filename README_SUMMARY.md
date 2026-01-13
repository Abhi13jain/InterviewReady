# InterviewReady — Quick Cheat Sheet

A one-page cheat sheet to help you explain the project in interviews: what it does, how it works, the main files to reference, environment requirements, and short sample answers.

---

## 1‑line elevator pitch
InterviewReady is a Next.js app that generates mock interview questions with an LLM, runs live AI-driven voice interviews (transcribes them), and stores automated feedback for users using Firebase and a voice API.

## What it does (short)
- Generate interview questions from role/level/tech using Google Gemini (server-side).
- Run a live, voice-based interview in-browser using a VAPI SDK (real-time TTS + STT).
- Capture final transcripts, compute/save feedback, and present scores and assessments.

## Tech stack
- Next.js (App Router) + React (server components + client components)
- Firebase (Auth + Firestore)
- VAPI Web SDK (`@vapi-ai/web`) for real-time voice workflows
- Google Gemini (Generative AI) via server API and `ai` library
- Tailwind / UI components, Sonner for toasts

## Main runtime flow (quick)
1. User signs up / signs in (Firebase email/password). UI: `components/AuthForm.tsx`.
2. Dashboard fetches interviews server-side and shows cards. Server checks current user and redirects in `app/page.tsx` and `app/(root)/page.tsx`.
3. Generate questions: client calls server route `app/api/vapi/generate/route.ts` which calls Gemini to create a JSON array of questions and stores an `interview` doc in Firestore.
4. Start interview: the interview page mounts `AgentWrapper` -> dynamic client-only `Agent` component.
5. `Agent` uses `vapi` to start a voice session, listens to `message` events for final transcripts, stores messages locally and saves feedback (Firestore) after call ends.

## Key files to mention (one-line each)
- `app/layout.tsx` — global layout, fonts, and Toaster.
- `app/page.tsx` — initial redirect based on auth.
- `app/(root)/interview/[id]/page.tsx` — interview page; mounts `AgentWrapper`.
- `components/Agent.tsx` — client-only component that handles VAPI events and transcripts.
- `components/AgentWrapper.tsx` — dynamic import wrapper (no SSR).
- `app/api/vapi/generate/route.ts` — server route that generates interview questions using Gemini and stores them.
- `app/api/gemini/route.ts` — proxy to Gemini (keeps server key secret).
- `firebase/client.ts` — Firebase client initialization (auth + firestore).
- `lib/vapi.sdk.ts` — VAPI Web SDK wrapper initialisation.
- `components/AuthForm.tsx` & `components/InterviewCard.tsx` — sign-in UI and interview UI.

## Important environment variables
- `NEXT_PUBLIC_VAPI_WEB_TOKEN` — client VAPI token (visible to browser). Prefer short-lived/session tokens.
- `NEXT_PUBLIC_VAPI_WORKFLOW_ID` — optional workflow ID for VAPI calls.
- `NEXT_PUBLIC_FIREBASE_API_KEY` — Firebase client key.
- `GOOGLE_GENERATIVE_AI_API_KEY` — server-side key used by Gemini proxy (must be secret).

Note: server-only secrets should never be exposed to the browser.

## How to run locally (short)
1. Install deps: `npm install`
2. Create `.env.local` with the env vars above (and Firebase config values used in `firebase/client.ts`).
3. Run: `npm run dev` and open `http://localhost:3000`.

## Demo script (2 minutes)
1. Show sign-up/sign-in flow (AuthForm).
2. On dashboard, click "Start an Interview" or show a generated interview card.
3. Open an interview -> start call -> show live transcript snippets and then the feedback page.

## Security & production considerations (talking points)
- Keep model API keys server-side; use proxy routes to call the LLMs.
- Use short-lived VAPI tokens or mint per-session tokens from the server.
- Add Firebase security rules so users can only read/write their own documents.
- Add retry/backoff & circuit breaker for external AI calls and monitoring for costs.

## Scaling & reliability (talking points)
- Move heavy generation into background workers or a queue to avoid blocking HTTP requests.
- Add rate limiting and caching for repeated prompts.
- Track AI usage and budget; optimize prompt/templates to reduce token costs.

## Short list of likely technical questions + one-line answers
- Q: Where do AI calls happen? A: Server-side API routes (e.g., `app/api/vapi/generate/route.ts`) so keys stay secret.
- Q: How does real-time audio work? A: Browser initializes `vapi` SDK with a token; SDK streams audio, sends transcripts via events to the `Agent` component.
- Q: How safe are public tokens? A: They are visible — prefer short-lived tokens or server-minted sessions.
- Q: What happens when generated questions can't be parsed? A: The generate route catches JSON.parse errors and returns an error; improvement: retry or fallback questions.
- Q: How to test the app? A: Unit tests for utils/API logic, integration tests with Firebase emulator, E2E tests with Playwright.

## Quick troubleshooting (what to check in a demo)
- No audio/call: ensure `NEXT_PUBLIC_VAPI_WEB_TOKEN` and workflow ID are set.
- Question generation fails: check `GOOGLE_GENERATIVE_AI_API_KEY` and server logs for parsing errors.
- Auth fails: check Firebase config in `firebase/client.ts` and client env vars.

## Short answers you can memorize
- Purpose: "Help people practice interviews using AI-driven voice interviews and automated feedback."
- Main challenge solved: "Combining LLM content generation with a real-time voice experience and persisting meaningful feedback."
- Openness to improvement: "Move generation to async workers, secure VAPI tokens, and add monitoring & tests."

---
If you want, I can also:
- generate a 30-second and a 2-minute demo script, or
- add 10 exact Q&A scripts you can read verbatim.
Tell me which and I'll add them to this repo as well.
