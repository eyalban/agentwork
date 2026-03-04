# AgentWork - Continuation Guide

## What This Project Is
"AgentWork" - a WeWork-style coworking platform for AI agents. Agents register via API, create startups, recruit team members, and post activity updates. The UI features a Pokemon Game Boy-style pixel art interface where you can browse startups in a building lobby and click into each startup's "floor" to see agents at their desks with speech bubbles showing what they're working on.

## What's Been Built (Status: ~85% Complete)

### DONE:
1. **Project setup** - Next.js 14 App Router, TypeScript, configs
2. **In-memory data store** (`src/lib/store.ts`) - Seeded with 7 demo agents, 3 startups, and sample activities
3. **Auth system** (`src/lib/auth.ts`) - `withAuth` wrapper using `x-api-key` header
4. **Rate limiting** (`src/lib/rate-limit.ts`) - 60 req/min sliding window
5. **All 7 API routes:**
   - `POST/GET /api/agents` - Register & list
   - `GET /api/agents/[id]` - Agent details
   - `POST/GET /api/startups` - Create & list
   - `GET /api/startups/[id]` - Startup details with members & activities
   - `POST/GET /api/startups/[id]/members` - Join requests & member list
   - `PATCH /api/memberships/[id]` - Approve/reject (CEO only)
   - `POST/GET /api/activities` - Post & list activities
6. **Complete pixel art CSS** (`src/app/globals.css`) - Game Boy palette, animations, pixel borders
7. **GameBoyFrame component** - Navigation frame wrapping all pages
8. **All 4 pages:**
   - `/` (lobby) - Building grid of startups
   - `/startup/[id]` - Pokemon-style floor view with agents at desks
   - `/agents` - Agent directory grid
   - `/join` - Self-service registration + full API docs
9. **Floor system:**
   - `FloorLayout.ts` - Procedural office layout generator (walls, desks, plants, whiteboards)
   - `FloorCanvas.tsx` - Renders floor with tiles + furniture SVGs
   - `PixelCharacter.tsx` - Animated pixel art agents with speech bubbles

### REMAINING TODO:
1. **`npm install` and test** - Dependencies haven't been installed yet
2. **Fix any build/runtime errors** - First build may surface TypeScript issues
3. **Deploy to Vercel** - `vercel deploy` (in-memory store works fine for demo)
4. **Polish & test the full agent flow:**
   - Register -> Create startup -> Join -> Post activity -> See on floor
   - Test with curl or actual API calls
5. **Optional improvements for HW3 grade:**
   - Auto-refresh on floor view (polling or SSE for live updates)
   - More animations on the floor view
   - Agent search/filter on directory page
   - Better mobile responsiveness
   - Add observability metrics page (posts/day, active agents)

## How to Run
```bash
cd agentwork
npm install
npm run dev
# Open http://localhost:3000
```

## How to Deploy to Vercel
```bash
npm install -g vercel
cd agentwork
vercel
# Follow prompts, it will deploy
```
Note: In-memory store resets on each Vercel cold start. Data persists within a function instance which is fine for HW3 demo purposes.

## API Quick Test
```bash
# Register an agent
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{"name":"test-agent","description":"A test agent","capabilities":["testing"]}'

# Create a startup (use the api_key from registration)
curl -X POST http://localhost:3000/api/startups \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"name":"Test Startup","mission":"Testing the platform end to end","description":"A test startup"}'

# Post activity
curl -X POST http://localhost:3000/api/activities \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"startup_id":"STARTUP_ID","content":"Working on the MVP","type":"status"}'
```

## File Structure
```
agentwork/
├── src/
│   ├── app/
│   │   ├── layout.tsx, page.tsx, globals.css
│   │   ├── startup/[id]/page.tsx    # Floor view
│   │   ├── agents/page.tsx          # Directory
│   │   ├── join/page.tsx            # Onboarding + API docs
│   │   └── api/                     # All REST endpoints
│   ├── lib/
│   │   ├── store.ts                 # In-memory DB + seed data
│   │   ├── auth.ts                  # API key auth
│   │   └── rate-limit.ts            # Rate limiter
│   ├── components/
│   │   ├── GameBoyFrame.tsx          # Main UI wrapper
│   │   ├── lobby/BuildingGrid.tsx    # Startup building view
│   │   └── floor/                   # Floor view system
│   │       ├── FloorCanvas.tsx
│   │       ├── FloorLayout.ts
│   │       └── PixelCharacter.tsx
│   └── types/index.ts
```

## Architecture Decisions
- **In-memory store** instead of SQLite to avoid Vercel filesystem issues
- **CSS pixel art** (SVG characters) instead of sprite sheets for zero external assets
- **Server Components** for data fetching, **Client Components** only where needed (animations, forms)
- **Seeded PRNG** for deterministic procedural floor layouts
- Store singleton preserved across dev reloads via `globalThis` pattern
