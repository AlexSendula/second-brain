---
layout: default
title: "Second-brain landscape survey (2026-10-11)"
---

# Second-brain landscape survey (2026-10-11)

Desk research. Items marked **[unverified]** came only from secondary or aggregator sources, or could not be confirmed as current.

## 1. Markdown-native UIs over a vault

- **Obsidian** (<https://obsidian.md>). The app is proprietary freeware: free for any use, but not open source. The data is fully open: plain `.md` files with YAML frontmatter, and Bases views are stored as `.base` YAML.
  - Best native iOS and Android apps of anything here.
  - Version 1.12 (Feb 2026) added an official CLI, which needs the desktop app running.
  - `obsidian-headless` (<https://obsidian.md/help/sync/headless>) is in open beta. It needs Node 22 and a paid Sync subscription, and lets a server sync the vault with no desktop app.
  - No official MCP server. Community ones wrap the CLI or the Local REST API plugin, or Claude Code can edit the files directly.
- **Obsidian plugins:**
  - **Bases** (core plugin, since 1.9): table, card and list views. Reads frontmatter only, not inline fields.
  - **Tasks** (MIT): actively maintained; handles recurrence and due dates.
  - **Dataview** (MIT): effectively frozen. The original author's last commit was in 2024; only community-maintainer releases since. Its successor, Datacore, is still a work in progress.
  - **Kanban** (GPL-3.0): last release 2.0.51 about two years ago; "looking for maintainers".
  - **Full Calendar Remastered**: a fork claiming two-way CalDAV and Google sync. Young **[unverified reliability]**.
- **SilverBullet** (<https://silverbullet.md>). MIT licensed, self-hosted, stores plain `.md` files on the server.
  - Mobile is a PWA with an offline IndexedDB cache; no native app.
  - v2 rebuilt it around Space Lua, with built-in tasks and object queries.
  - 2.6 added an experimental Runtime API and CLI. MCP only through community bridges (sb-mcp, silverbullet-ai-mcp).
  - Needs an always-on server.
- **Logseq** (<https://logseq.com>). AGPL-3.0, currently splitting in two.
  - The file-based "OG" version is maintained but gets no new features.
  - The 2.0 DB version has been in beta since 13 Jul 2026. SQLite is the canonical store; an opt-in "Markdown Mirror" writes markdown copies to disk **[unverified]**. No stable 2.0 release found.
  - Outliner-style markdown is a poor match for a PARA vault. Avoid for a new vault.

## 2. Open-source task managers

- **Vikunja** (<https://vikunja.io>). AGPL-3.0, REST API and CalDAV; v2.3.0 fixed a 2026 CalDAV CVE. Community-built MCP servers only. Mobile is a PWA; native apps were historically alpha **[2026 status unverified]**. Stores tasks in a database.
- **Super Productivity** (<https://super-productivity.com>). Open source (license not confirmed).
  - Local-first, plugin API since v14. REST API runs only in the desktop app.
  - Sync via WebDAV, Dropbox or SuperSync. Connects to Google Calendar and CalDAV.
  - Stores JSON, not markdown. Community MCP server from 2025.
- **Taskwarrior 3 / TaskChampion** (<https://taskwarrior.org>). MIT, SQLite replica plus a sync server, strong recurrence.
  - Community MCP server (taskchampion_mcp, 35 tools).
  - iOS apps are Taskchamp and Claw Warrior, both third-party **[sync reliability unverified]**.
- **Plane** (<https://plane.so>). AGPL **[unconfirmed]**, official MCP server (makeplane/plane-mcp-server). A team project-management tool; overkill for personal life.
- **Tasks.md** (<https://github.com/BaldissaraMatheus/Tasks.md>). MIT, self-hosted kanban: lanes are folders, cards are `.md` files. 3.0 added due dates and picks up changes made outside the app. Deliberately low-maintenance.
- **Markdown storage:** only Tasks.md here, plus the inline tasks in Obsidian Tasks and SilverBullet. Every other option means running a second source of truth alongside the vault.

## 3. Phone capture with no laptop running

- **iOS Shortcuts "Dictate Text" then "Append to File"** works in the background without opening Obsidian, but only if the vault is in iCloud Drive. Some users report trouble appending to `.md` files; test that first.
- **Obsidian URI / Advanced URI** actions bring the Obsidian app to the foreground. "Actions for Obsidian" is a proprietary app **[not checked]**.
- **Drafts** (proprietary, Pro subscription): the best voice-capture experience; can append to vault files; data ends up as plain markdown.
- **Telegram bot on an always-on server.** An n8n template does Telegram voice → Groq Whisper → a commit to GitHub (<https://n8n.io/workflows/17896>). Groq can be swapped for self-hosted whisper.cpp. Plugin-based bots such as Flowtaker Inbox only work while Obsidian is open.
- **Agent from the phone.** Claude Code on the web, reachable from the iOS app, works on a GitHub repo in a cloud sandbox. If the vault is a git repo, the agent can work on it with no laptop on.

## 4. Agent memory layers

Covered in depth, with what was chosen, in the [agent memory research]({{ '/research/2026-10-13-agent-memory-research/' | relative_url }}). The layers seen here were Hindsight, Basic Memory, mem0, Letta, Zep / Graphiti and Khoj.

**How these tools keep memory from going stale versus the files:**

- **Files are the memory** (Basic Memory): nothing can drift; the store is only an index of the files.
- **Re-ingest each note by document ID** (Hindsight): drift is limited to the sync delay. Whether observations derived from a deleted note are pruned is not documented.
- **Time-stamped invalidation** (Graphiti): history is kept, but cleaning up after a deleted note is manual.

## 5. Existing "AI agent + vault" projects

- **claudesidian** (<https://github.com/heyitsnoah/claudesidian>). MIT, about 2.6k stars. Numbered PARA folders, 14 skills (including inbox-processor and weekly-synthesis), commands such as `/daily-review`, and git. No task or recurrence handling, no calendar, no memory layer; mobile means SSH over Tailscale.
- **Basic Memory + Claude Code plugin.** Briefings at session start and checkpoints before compaction. No tasks or dashboard.
- **Hindsight Obsidian plugin.** Chat answers that cite the notes they used. No write-back, no mental models yet.
- **Khoj.** Capable, but brings its own UI and server stack.
- **What they got right:** the vault is canonical, the agent edits plain files, git makes edits reversible.
- **What every one of them lacks:** phone-first capture, recurring tasks with calendar, and an explicit rule for how memory relates to the files.

## What this means for the design

- **UI:** Obsidian (closed app, open data); SilverBullet as the fully open-source fallback. Tasks in Obsidian Tasks syntax, dashboards in Bases. Don't depend on Dataview or the original Kanban plugin.
- **Tasks:** keep them as markdown in the vault, not in Vikunja or Taskwarrior, which would be a second source of truth. Calendar is the weakest area; plan for read-only ICS, or a CalDAV MCP server for the agent.
- **Sync:** choose the sync method first. Plain iCloud allows Shortcuts capture with no infrastructure. Git lets Claude Code cloud sessions reach the vault from the phone. Obsidian Sync with obsidian-headless, or Syncthing, puts the vault on a server for bots and memory sync. Running iCloud and git on the same vault risks conflicts.
- **Memory:** decided later, after its own research: plain markdown files in the vault, no memory service ([agent memory research]({{ '/research/2026-10-13-agent-memory-research/' | relative_url }})).
