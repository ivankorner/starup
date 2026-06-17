<claude-mem-context>
# Memory Context

# [starup] recent context, 2026-06-11 4:43pm GMT-3

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 26 obs (8,597t read) | 234,810t work | 96% savings

### Apr 23, 2026
12 2:03p 🟣 SIMI brand redesign applied to radar-proyectos app
13 2:27p 🔵 SIMI footer full-width investigation — radar-proyectos app
14 " ✅ Footer Full-Width Fix Requested for Cloudways Site
15 2:28p 🟣 Footer SVG updated and Vite project rebuilt
16 2:33p 🔴 Footer image switched from SVG to PNG for full-width display
17 2:34p ✅ Footer PNG deployed to public and dist, Vite build triggered
18 2:40p 🔵 Starup App Header Uses SVG Logo + Text Brand Block
20 " ✅ Header Logo Replaced: SVG+Text → PNG Image Only
21 2:41p ✅ Logo PNG Asset Deployed to Public and Dist, Build Triggered
22 " 🔵 Vite Build Succeeds With Large Chunk Warning
23 2:45p ✅ New SVG Logo Asset Prepared for Potential Second Logo Swap
24 " ✅ logonuevo.svg Deployed to Branding Dirs, Second Build Triggered
### Apr 27, 2026
25 2:42p 🔵 starup project structure — radar-proyectos startup evaluator
26 2:44p ✅ CLAUDE.md refreshed with accurate v2.0 architecture snapshot
27 3:22p 🔴 Removed hardcoded demo credentials from LoginScreen
S10 Replace Radar 📡 emoji logo with SIMI logo in LoginScreen — FTP file list for Cloudways deploy (Apr 27 at 3:22 PM)
28 3:30p 🔵 Radar login screen uses 📡 emoji as logo; SIMI branding assets available
S11 LoginScreen logo swapped to SVG (Apr 27 at 3:31 PM)
29 3:42p ✅ LoginScreen logo swapped to SVG
S12 Login screen logo swapped to logonuevo.svg (Apr 27 at 3:42 PM)
30 3:44p ✅ Login screen logo swapped to logonuevo.svg
S13 XLSX Export Bug — Duplicate Sheet Name Crash (Apr 27 at 3:44 PM)
31 3:49p 🔵 XLSX Export Bug — Duplicate Sheet Name Crash
S14 Dashboard + SubmissionsTable architecture pre-feature (Apr 27 at 3:49 PM)
32 4:02p 🔵 Dashboard + SubmissionsTable architecture pre-feature
S15 [**title**: Short title capturing the core action or topic] (Apr 27 at 4:02 PM)
S16 Replace PricingTable component — full redesign with comparison table layout (Apr 27 at 4:12 PM)
S18 Build filterable submissions table (ResponsesTable) replacing SubmissionsTable in starup Dashboard (Apr 27 at 4:23 PM)
### Apr 28, 2026
34 6:55a ⚖️ Submissions table UI design decisions finalized for starup dashboard
35 6:57a ⚖️ Submissions table UI design choices finalized via brainstorm
36 6:58a ⚖️ Submissions table UI spec finalized — layout, location, filters chosen
S20 Identify which files to upload via FTP to Cloudways after frontend build (Apr 28 at 6:58 AM)
37 7:08a 🔵 Starup project deployed on Cloudways via FTP
39 8:14a 🔵 Starup project CSS design system structure mapped
40 8:15a 🟣 ResponsesTable UI redesigned with stats cards, grid filter bar, icon action buttons
S21 ResponsesTable UI redesigned with stats cards, grid filter bar, icon action buttons (Apr 28 at 8:15 AM)

Access 235k tokens of past work via get_observations([IDs]) or mem-search skill.
</claude-mem-context>

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, invoke the `skill` tool with `skill: "graphify"` before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
