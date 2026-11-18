# ALIGN

React 18 + TypeScript application using Vite as its local development server and build tool.

## Run locally

1. Install the current Node.js LTS release.
2. Open a terminal in this folder.
3. Run `npm install`.
4. Run `npm run dev` and open the localhost URL printed in the terminal.

## Demo sign-in

Sign-in is intentionally temporary. Any syntactically valid email and password of at least six characters will start an in-memory demo session. The app does not save account names, email addresses, passwords, or signed-in state to browser storage. Refreshing the page ends the session. Old `align.users` and `align.user` local-storage keys from earlier demo versions are cleared on startup.

The AI Agent's sample chat history remains a separate local-only feature; it is not account or login information.

## Current routes

- `/` — Landing page
- `/repository` — Repository placeholder, ready for the existing materials repository to be connected
- `/resources/:id` — Resource detail pages
- `/ai-agent` — AI Agent demo
- `/community` — Community of Practice
- `/about` — About ALIGN
- `/login` and `/signup` — Temporary demo sign-in

The separate contribution and My Contributions routes are not part of this version; legacy URLs redirect to `/repository`.
