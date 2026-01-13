# InterviewReady — User Flow Explanation

This document explains the `docs/user_flow.svg` diagram and provides short talking points you can use in an interview.

Overview (one line): User signs in, generates or selects an interview, runs a live AI voice interview in-browser, transcripts are captured and feedback is saved to Firestore.

Steps and talking points:

1. Landing / Auth
   - Components: `components/AuthForm.tsx`.
   - What happens: User signs up or signs in using Firebase auth. The auth token is used for server actions.

2. Dashboard
   - Files: `app/(root)/page.tsx`, `components/InterviewCard.tsx`.
   - What happens: Server checks current user and fetches user's interviews to show upcoming/past interviews.

3. Generate Interview (client -> server)
   - Files: `app/api/vapi/generate/route.ts`.
   - What happens: Client sends interview parameters (role, level, techstack, amount). Server uses a generative AI model (Gemini) to generate a JSON array of questions, validates/parses them, then writes an `interview` document to Firestore.

4. Open Interview Page
   - Files: `app/(root)/interview/[id]/page.tsx`.
   - What happens: Server-side fetch load interview metadata and questions; page mounts client-only `Agent` component.

5. Agent (client) & VAPI
   - Files: `components/Agent.tsx`, `components/AgentWrapper.tsx`, `lib/vapi.sdk.ts`.
   - What happens: `Agent` initializes VAPI SDK (client token) and starts a voice workflow (either a workflow id or custom assistant). It listens to realtime events: `message` (transcripts), `speech-start`, `speech-end` and updates local state.

6. Collect final transcripts and save feedback
   - Files: `components/Agent.tsx` (calls `createFeedback`), backend actions in `lib/actions` write to Firestore.
   - What happens: After the call finishes `Agent` sends final transcripts to a createFeedback action which computes/saves feedback and redirects user to the feedback page.

7. View Feedback
   - Files: `components/InterviewCard.tsx`, feedback page.
   - What happens: Users can view score/assessment and read detailed feedback stored in Firestore.

Environment & security notes (mentionable)
- Keep the LLM API key (`GOOGLE_GENERATIVE_AI_API_KEY`) server-side and call it from API routes only.
- Use `NEXT_PUBLIC_*` env vars for keys that must be client-visible (e.g., VAPI web token), but prefer minting short-lived session tokens server-side.
- Use Firebase security rules so only authenticated users can read/write their own documents.

Use this diagram when explaining the project flow in the interview: point at each step, name the key file, and say one sentence about what happens and why it’s designed that way.
