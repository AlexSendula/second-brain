---
layout: default
title: "Agent memory for the second brain: research and recommendation"
---

# Agent memory for the second brain: research and recommendation

**Date:** 2026-10-13 (revised the same day after a critic's review)

**Question:** Which agent memory system should the second brain use from v1, given the rules in spec section 6.7 (memory suggests, the vault wins, one memory per vault, wipe test)?

**How this was researched.** Eleven candidates were found by a discovery sweep and the 2026-10-11 survey. Each got a researcher pass and an independent adversarial verifier pass on 2026-10-13. Both read primary sources: source code at today's commits, docs, release pages, issue trackers and package registries. Where the two disagreed, this report follows the verifier unless the researcher had a stronger primary source. The revision added a twelfth candidate, Engram, with one pass over its docs and code at today's main and no separate verifier pass. It also re-checked Gemini CLI and its successor, Claude Code's AGENTS.md loading, Hindsight's install options and MCP tools, and the maturity figures (GitHub API, 2026-10-13). Claims nobody could confirm from a primary source are marked **[unverified]**. Nothing was installed, run or changed while researching.

## 1. Result

What was chosen on 2026-10-13. It differs from this report's recommendation in one important way: memory became smaller.

- **Plain markdown, no memory service.** One file per vault, `.memory/MEMORY.md`. It is git-ignored, so it stays out of saved versions and a wipe is a real wipe.
- **Smaller than this report proposed.** Memory holds only what isn't confirmed yet: a preference said once, a pattern the agent noticed, a rule candidate. Earlier sessions come from saved versions and conversations, and "where things are" from the lookup tool and links. Nothing in memory points to notes, so the `memory-check` script and the `sources` and `seen` fields this report proposed were dropped.
- **The tools' own memories are off inside vaults** and stay on elsewhere. Every tool uses the vault's memory. Running both side by side, or pointing Claude Code's memory at the vault file, was rejected: two memories can disagree, and Claude's memory saves things that don't belong in a vault's memory.
- **Tools:** Claude Code first, plus Codex and VS Code with GitHub Copilot. No Google tool.
- **No search index** in v1.
- **Really delete** also names the agent tools' transcripts and history, and offers clearing them as a separate step you confirm.
- **The system design changed to match:** principle 2 and section 6.7 of the [system design]({{ '/system-design/' | relative_url }}).

**Why plain files.** On the eight criteria (table 3.1), memsearch, Cognee, Hindsight with vault sync, qmd and MemPalace all score higher, mostly on forgetting deleted notes (C3) and rebuilding from the vault (C8). Plain files win on four things the criteria don't score (table 3.2): no new party reads your health, money and family notes; nothing new runs on the computer; no young or vendor-controlled project to depend on; and nothing injects remembered claims as authoritative.

**If it falls short** (section 5): for search or duplicate memories, Engram or a separate qmd index over `.memory/`; for patterns across many sessions, Hindsight, sessions only, one server per vault.

**Confidence:** high that plain files are the lowest-risk start; medium that they stay good enough beyond a few months.

Where the tables score plain files "with our glue", the glue is the `memory-check` script and the `sources` and `seen` fields, which were dropped. What was built is in the [implementation]({{ '/implementation/' | relative_url }}), under Agent memory.

## 2. The criteria

From spec 6.7. "Pass" below always means pass once configured; many candidates need non-default settings.

| | Criterion | In plain words |
|---|---|---|
| C1 | Works with any agent tool | Usable from Claude Code, Codex CLI, OpenCode and Google's CLI (see below) through MCP, a CLI or plain files, and not tied to its own agent runtime. |
| C2 | Learns from the vault one way | Reads the vault and agent sessions, keeps its own store, and never writes into the vault. |
| C3 | Forgets what's deleted from the vault | When a note is deleted or changed, memories built from it go too, including summaries built on top of them. |
| C4 | Newer facts replace older ones | A contradicted fact is replaced or marked old, not recalled next to the new one as equally true. |
| C5 | One memory per vault | Real separation, and a session in vault A can only ever see vault A's memory. |
| C6 | Local, or a provider acceptable for private data | What runs where (storage, embeddings, extraction LLM), and who sees the data. |
| C7 | Acceptable cost per use | LLM calls per save and per recall, and the monthly cost at this scale. |
| C8 | Can be wiped and rebuilt from the vault | Delete the store and re-derive it; what is lost. |

**Which criteria are hard gates.** Spec 6.7 lists the eight criteria without ranking them. Four of them repeat rules the spec states as absolutes elsewhere, so this report treats them as gates:
- **C1**, from principle 4 ("any agent, any model") and 6.9 (behaviour lives in the vault, "not in one agent tool").
- **C2's "never writes to the vault" half**, from 6.7 ("never writes to the vault").
- **C5**, from 6.7 ("a session only sees its own vault's memory, so work and personal never mix").
- **C6**, from 6.5: vault content goes nowhere you haven't approved, and memory providers are approved only by choosing them.

C3, C4, C7 and C8 are graded. Most candidates pass all four gates once configured, so the gates screen out little. The choice rests on the graded criteria plus the unscored factors in table 3.2.

**One threat model for C5, applied to every candidate.** Isolation means:
1. Nothing loads or recalls another vault's memory automatically. This must be enforced by configuration.
2. The agent's own tools, in a normal session, don't reach the other vault's memory unless you ask. This is mitigated rather than enforced, unless the tool can block it (Claude Code's `blockReadsOutsideWorkingDirectories`).
3. Any other process running as your user can read every vault and every store on the machine. That is out of scope here, as it is for the vaults themselves.

Channels that belong to the agent tools rather than to the memory system (global instruction files, user-scope plugins and hooks, the tools' own memories) affect every candidate equally. Section 5 lists them.

**Google's tool.** Google's announcement of 2026-05-19 says Gemini CLI stopped serving Google AI Pro, Ultra and free individual accounts on 2026-06-18. It stays available with paid Gemini API keys and enterprise licences. The successor is Antigravity CLI, command `agy` (<https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/>, <https://antigravity.google/docs/cli/gcli-migration>). Gemini CLI is Apache-2.0. agy's GitHub repo shows docs, examples and an issue tracker, with no source and no licence (<https://github.com/google-antigravity/antigravity-cli>), so it is probably closed source **[unverified]**. This report covers both.

Two spec rules matter as much as the criteria. Status and dates always come from the lookup tool, never from memory (6.6). Memory may change how the agent talks, never what it does (6.7, "memory suggests, rules decide").

## 3. Comparison tables

**Legend.** ● pass · ◐ partial · ○ fail · ? unknown. Verdicts include the verifier's corrections; Engram had no separate verifier pass.

**Scoring rules, the same for every candidate:**
- **As shipped vs with our glue.** "As shipped" is the product plus settings and instruction text (AGENTS.md, skills). "With our glue" adds a script or optional step we would write. Where the two differ, the cell shows both: `○→◐` fails as shipped and is partial with our glue.
- **C7.** LLM calls on the recall path, or unbounded background LLM work, score ◐ unless measured.
- **C8.** ● the whole store re-derives from the vault (plus kept logs) with the product's own commands. ◐ part of it re-derives, or it re-derives only from transcripts while they exist. ○ nothing re-derives: a wipe is safe only because memory holds no facts.

The tables don't show how much configuration each pass takes.

### 3.1 The eight criteria

| Candidate | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| Plain markdown files (baseline) | ● | ◐ | ○→◐ | ◐ | ● | ● | ● | ○→◐ | **Recommended for v1**, on the factors in 3.2, not on this score. |
| Hindsight, vault sync plus sessions | ● | ● | ◐ | ◐ | ● | ● | ◐ | ● | Best delete handling of the services; an LLM reads every note. Only if status and dates can be kept out (untested). |
| Hindsight, sessions only | ● | ◐ | ○→◐ | ◐ | ● | ● | ◐ | ○→◐ | **Runner-up for patterns across sessions.** The note-delete cascade does not apply. |
| memsearch (Zilliz) | ● | ● | ◐ | ○ | ● | ● | ● | ● | Good "files plus index" design; no supersession; one maintainer. |
| Engram | ● | ◐ | ○→◐ | ◐ | ◐ | ● | ● | ○→◐ | **Runner-up for search and duplicates.** Close to the baseline, plus search and conflict flags; global defaults. |
| qmd | ● | ◐ | ◐ | ◐ | ● | ● | ● | ● | A search index, not memory. Optional later add-on, kept separate from memory. |
| agentcairn | ● | ◐ | ○→◐ | ◐ | ◐ | ● | ● | ◐ | Validity model; stores raw prompts; one maintainer; hard to keep two vaults apart. |
| Cognee | ● | ● | ○→◐ | ◐ | ● | ● | ◐ | ● | Good per-note delete via our sync; leftovers; a server per vault; breaking releases twice a week. |
| Basic Memory | ● | ◐ | ○→◐ | ◐ | ● | ● | ● | ○→◐ | The baseline plus an index, with more to fight (writes into what it indexes, status-first defaults). |
| MemPalace | ● | ● | ◐ | ◐ | ◐ | ● | ● | ● | Local and LLM-free, but bug-prone, with isolation traps and authoritative framing. |
| Graphiti | ● | ◐→● | ○→◐ | ◐ | ◐ | ● | ◐ | ○→● | Temporal facts, but summaries keep deleted facts; three services per vault. |
| mem0 | ◐ | ◐→● | ○→◐ | ○ | ● | ● | ● | ○→● | No automatic update or delete in the open-source add(); key features moved to the paid cloud. |
| Letta / Letta Code | ◐ | ◐ | ○ | ◐ | ◐ | ● | ◐ | ◐ | An agent runtime, not a memory layer; clashes with "memory suggests". |

### 3.2 What the criteria don't score

| Candidate | New party reading private data | Things to run on the machine | Maturity and governance | Fit with "memory suggests" |
|---|---|---|---|---|
| Baseline | None. Memory reaches only the session's model provider, which already reads the vault. | Nothing. | Our own files; no upstream. | Good. Nothing is injected; the framing is ours. |
| Hindsight | The extraction LLM reads every session (and every note, with vault sync) unless it is local; local quality untested. No-LLM mode avoids this but drops consolidation. | A Python server per vault (pip, embedded pg0 or Docker) with local embedding and reranker models; about 2-3 GB of RAM each per its docs. | MIT; v0.10.3 (2026-10-08); a release every 1-2 weeks, pre-1.0; 80 of the last 100 commits by one person; outside PRs closed without review; the vendor sells a cloud. | Mixed. Calls memory "a record of the PAST", but also says "apply them as given"; the agent can create directives. |
| memsearch | None new: the summariser is the agent's own CLI and provider; embeddings are local. | A Python CLI, a Milvus Lite file, an ONNX model. | MIT; v0.4.21 (2026-09-24); one maintainer, about 85% of commits; 227 open PRs. | Not checked in depth; journals are plain files. |
| Engram | None by default (no LLM). An update check calls GitHub unless switched off. Its Claude Code hooks store your prompts. | One Go binary and one SQLite file; the plugin hooks also need a local HTTP server, `jq` and `curl`. | MIT, name trademarked; v3.4.0 (2026-10-12); two main maintainers; 72 open issues, 20 open PRs; fast-moving. | Mixed. Its guide says to "trust that your agent is saving context"; hooks inject a "CRITICAL FIRST ACTION"; no "the vault wins" framing. |
| qmd | None (local models). | A Node CLI, about 2 GB of models, several GB of RAM per query process. | MIT; v2.8.3 (2026-08-16), no release since; one gatekeeper; 103 open PRs. | Search only. Must stay separate from status lookups (section 5). |
| agentcairn | None by default, but your prompts are stored verbatim. | A Python CLI, DuckDB, local models, a launchd sweep. | Apache-2.0; v0.26.2 (2026-09-28); one maintainer; 65 stars, beta. | Mixed. MCP recall shows validity, the injected digest doesn't, and its skill says to treat memory as "shared, durable knowledge". |
| Cognee | The extraction LLM reads every note unless local; telemetry on by default. | A Python server per vault with embedded stores, plus Ollama. | Apache-2.0, open core; v1.6.3 (2026-10-07); about two releases a week with breaking changes. | Poor. Its plugin calls it "the source of truth for memory"; no relevance floor. |
| Basic Memory | None (no LLM); auto-update downloads by default. | A Python MCP server, SQLite, FastEmbed. | AGPL-3.0 with a CLA that allows relicensing; v0.23.2 (2026-08-25); unreleased v0.24 lists about 10 breaking changes. | Poor by default: its brief lists "Active tasks"; its Codex prompt says to search memory for status. |
| MemPalace | None (no LLM on the core path). | Python and ChromaDB; a segfault is reported on one macOS release. | MIT; v3.10.0 (2026-09-16); 365 open issues, 431 open PRs. | Poor: "Never guess", "Return verbatim". |
| Graphiti | The extraction LLM reads every note unless local. | Per vault: a graph database container, an MCP server container, Ollama. | Apache-2.0; FalkorDB is SSPL; graphiti-core 0.30.2 (2026-09-08); 221 open issues, 248 open PRs. | Not checked. |
| mem0 | One LLM call per save unless local; telemetry on by default. | A Python library, a vector store, our own MCP wrapper. | Apache-2.0, VC-backed open core; v2.2.1 (2026-09-25); features moving to the paid platform. | Not checked. |
| Letta | Its own agent and model; error telemetry carries model output. | A whole agent harness. | Apache-2.0; several releases a day. | Poor: memory is the agent's "core program"; it creates skills without approval. |

Sources for the maturity figures are in section 6.

**Reading the tables.** Counted on C1-C8 as shipped: memsearch scores 6 ●, and Hindsight with vault sync, qmd, Cognee and MemPalace score 5 ● each. The baseline scores 4 ● 2 ◐ 2 ○, and 4 ● 4 ◐ with our glue. So the baseline is not recommended for its C1-C8 score. It is recommended because of table 3.2: it is the only option with no new data processor, nothing to run, no upstream to depend on and no authority framing to undo. For a vault holding health, money and family details, and a user who avoids lock-in, those weigh more than the C3 and C8 gaps. Those gaps are covered by keeping facts out of memory and by the spec amendment (see the result at the top).

## 4. Patterns: how a memory can relate to a vault

| Pattern | Examples | Rebuild from vault | Deleted notes | Privacy | Fit with the spec |
|---|---|---|---|---|---|
| **A1. Derived search index, no LLM** | qmd, memsearch (vault part), MemPalace `mine`, `cairn reindex` | Yes, deterministic | Gone on the next index run | A second plain-text copy, local | Fits, but it is search, not memory. The lookup tool plus grep already answer "where is X" at this size. |
| **A2. LLM-extracted facts from the vault** | Hindsight Obsidian sync, Cognee, Graphiti, mem0 | Yes, but costly and not deterministic | Needs a cascade through consolidated layers: Hindsight does it in code, Cognee partly, Graphiti not | Every note goes to the extraction LLM | **Weakest fit.** It turns vault facts, including status and dates, into fact-shaped memory claims, which 6.7 forbids memory to hold. It also duplicates the vault. |
| **B. Files as the memory** | The baseline, Basic Memory, agentcairn's memory vault, Letta MemFS, memsearch journals | No (session-derived) | Edit or grep | Local, readable, editable | **Best fit for what 6.7 says memory holds.** |
| **C. A separate store learning from sessions** | Hindsight sessions, Engram, mem0, agentcairn, MemPalace conversations, Letta | Only from kept transcripts | No link back to notes | Depends on the extraction LLM, if any | Workable if transparent. Opaque stores make "the vault wins, the agent corrects memory" harder to do. |

**Which pattern fits.** Look at what 6.7 says memory holds: your preferences and how you work, patterns, earlier sessions, hunches about where things are. Preferences and patterns come from sessions, not from the vault. "Earlier sessions" are already recorded in the vault: each batch ends with a commit and a summary (6.1 step 4), and conversations are saved as notes (4.3). "Where things are" is a search problem the vault already solves with the lookup tool and grep. So B (files) holds the session-learned content. A1 is an optional add-on if search ever falls short. A2 should wait until a concrete need shows up, because it is the pattern that most easily breaks "never the source for status".

**What this meant for the spec.** Pattern B learns from sessions, including what sessions read in the vault, but it is not built from the vault and cannot be rebuilt from it. A wipe loses preferences you only said in chat and patterns the agent noticed. Replaying kept transcripts would mean keeping more raw private text around, so this report advised against it. The spec was amended instead. The wipe test holds as long as memory never holds facts (no status, no dates, nothing the vault says) and anything important moves into the vault: repeated preferences become proposed rules (6.8), and your own facts go in your person note.

## 5. Recommendation

### v1 setup: plain markdown memory, per vault, no service

The setup as built is in the [implementation]({{ '/implementation/' | relative_url }}), under Agent memory: one git-ignored file per vault, `.memory/MEMORY.md`, with the memory rules in the Memory section of `AGENTS.md`. The multi-file layout, the `sources` and `seen` fields and the `memory-check` script first proposed here were dropped when memory became smaller (see the result at the top).

There is no session-summary file. "What happened in earlier sessions" is read on demand from `git log` of the vault (each batch's summary, 6.1 step 4) and the conversation notes of that period (4.3). That history is vault-derived and survives a wipe. A memory file of session summaries would hold status, dates and outcomes ("moved the dentist to Friday"), which 6.7 forbids and the vault already records.

**Per-tool wiring:**
- **User-scope audit, for every tool and every candidate.** These load in every vault session, whatever the memory system:
  - Claude Code: `~/.claude/CLAUDE.md` and `~/.claude/rules/` always load alongside AGENTS.md (<https://code.claude.com/docs/en/memory>); user-scope plugins, hooks and MCP servers (`~/.claude/settings.json`, `~/.claude.json`); auto memory under `~/.claude/projects/`.
  - Codex: `~/.codex/AGENTS.md`, `~/.codex/config.toml`, `~/.codex/hooks.json`, and memories under `CODEX_HOME`.
  - agy: `~/.gemini/AGENTS.md`, `~/.gemini/GEMINI.md`, `~/.gemini/config/` (rules, hooks, MCP) and `~/.gemini/antigravity-cli/` (settings, rules, plugins) (<https://antigravity.google/docs/rules/>).
  - Gemini CLI: `~/.gemini/GEMINI.md` and settings.
  - OpenCode: `~/.config/opencode/AGENTS.md`, and `~/.claude/CLAUDE.md` as a fallback when that file is missing (<https://opencode.ai/docs/rules/>; `OPENCODE_DISABLE_CLAUDE_CODE_PROMPT=1` turns the fallback off).
  
  Rule: none of these may hold anything about either vault. Where a user-scope file has to keep vault-specific content, exclude it in that vault (`claudeMdExcludes` in the vault's `.claude/settings.json`; whether it applies to user-level files is **[untested]**).
- **Claude Code:** `CLAUDE.md` holds the single import line `@AGENTS.md`. Since v2.1.277 Claude Code reads AGENTS.md natively, but only when no CLAUDE.md exists. A CLAUDE.md that says "read AGENTS.md" in words leaves AGENTS.md unloaded unless the agent decides to open it. The import works on every version and in sessions where native AGENTS.md support is off, and never loads the file twice. This report keeps CLAUDE.md with the import, matching the implementation. Turn off native auto memory (`autoMemoryEnabled: false`), so every tool follows the same rules and there are no hidden recall or extraction calls. Turn on `blockReadsOutsideWorkingDirectories`, so file tools can't read the other vault; reading a file elsewhere (a transcript in Downloads) then needs `/add-dir`. Hindsight's global hooks and MCP must not run in vault sessions (the user-scope list above).
- **Codex CLI:** reads AGENTS.md. `features.memories` stays off, which is the default. A per-vault `CODEX_HOME` also separates its global AGENTS.md and memories, if the audit finds a need.
- **Antigravity CLI (agy):** reads AGENTS.md and GEMINI.md in the workspace natively. No built-in memory is described in its official docs **[unverified]**; local state lives under `~/.gemini/antigravity-cli/` (conversations, "brain") per third-party guides **[unverified]**. Its global rule files load in every workspace, and no documented setting gives each vault its own home (<https://antigravity.google/docs/cli/install/>). So for agy the guard is the audit: those global files stay free of vault content. Running agy with a separate `HOME` per vault might isolate it fully **[untested]**. If it skips the index, add a SessionStart hook in the vault's `.agents/hooks.json`.
- **Gemini CLI (paid API key only):** add AGENTS.md to `context.fileName`. It has no separate memory tool any more: the model saves memory by editing markdown files with `write_file` and `replace`, routing cross-project preferences to the global `~/.gemini/GEMINI.md` and private project notes to a memory folder under `~/.gemini/tmp/<project>/` (<https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/memory.md>; the folder path from `packages/core/src/config/storage.ts`). Excluding a tool can't stop that, because those are its general write tools. Default: start it with a per-vault `GEMINI_CLI_HOME` (a launcher script or a direnv `.envrc` per vault), which moves the whole `~/.gemini`, global memory included.
- **OpenCode:** reads AGENTS.md and has no built-in memory. Set `OPENCODE_DISABLE_CLAUDE_CODE_PROMPT=1` if `~/.claude/CLAUDE.md` holds anything you don't want in vault sessions.
- **If a tool keeps skipping the index:** add a SessionStart hook for that tool, which exists in Claude Code, Codex, agy and Gemini CLI. Don't add hooks before a test shows they're needed.

**What it costs.** $0 in money. Context: the index (about 1-3k tokens) rides along with each request, mostly as cheap cached input. Topic files are read on demand. All of it is paid from the subscription you already use.

**What data leaves the machine, and to whom.** Memory text goes only to the model provider of the session that reads it:
- Claude Code: Anthropic. Confirm which endpoint a terminal session uses, for example with `echo $ANTHROPIC_BASE_URL`.
- Codex: OpenAI.
- agy or Gemini CLI: Google, under the terms of the account or API key you use.
- OpenCode: whatever you configure.

Those providers already read the vault in that session, so memory adds no new party. No embedding, extraction or telemetry service is involved. The work vault has its own `.memory/` and follows whatever provider the work vault uses.

**Accepted limits.**
- No automatic contradiction detection.
- No semantic search over memory.
- Learning depends on the agent following its instructions.
- Session learnings are lost on a wipe, and memory cannot be rebuilt from the vault (section 4).

All four are reasons to upgrade later, not reasons to start heavier.

### Upgrades before a full switch

- **If "where is X" questions miss:** add qmd with two separate indexes, one over the vault and one over `.memory/`, queried separately. Every memory hit is labelled as a hunch. `.memory/` never goes into any tool that answers status questions, including the lookup tool. Benchmark against ripgrep first.
- **If capture is unreliable in one tool:** add that tool's SessionStart or Stop hook as a reminder. If capture stays poor across tools, memsearch-style automatic per-turn journals are the lightest next step, and they keep files as the truth. They need a summariser prompt that drops status, dates and outcomes.
- **If the index grows past about 150 lines, or memories duplicate or contradict each other:** Engram, configured per vault (bare MCP, `ENGRAM_DATA_DIR`, `ENGRAM_PROJECT`), with its plugins off because they store prompts, and with the update check off. Or the qmd memory index above.

### Runner-up for patterns across sessions: Hindsight, sessions only

**Why it, given that the note-delete cascade does not apply in this mode.** What is left is consolidation: facts from many sessions merged into observations with evidence, rewritten when they change, and reflect over them. That is the one item in 6.7 ("patterns it notices") that plain files do not do on their own. The alternatives don't do it either:
- memsearch journals: no consolidation and no supersession (C4 ○).
- agentcairn: a good validity model, but automatic supersession needs the Anthropic API, and it stores prompts verbatim with one maintainer.
- Engram: agent-curated, with lexical conflict flags; it notices nothing on its own.

Of the memory layers checked (not agent runtimes such as Letta), Hindsight, Cognee and Graphiti consolidate automatically. Cognee ships breaking changes twice a week and frames itself as the source of truth. Graphiti needs three services per vault and keeps deleted facts in its summaries. Hindsight keeps a real cascade delete per document, so the really-delete flow can work at session level. The price stays the same: an LLM reads every session, a server per vault, and unsafe defaults.

**Switch when, after 4-8 weeks of v1:**
- you want patterns noticed across many sessions, which plain files will not do on their own; and
- the triggers above (capture, size) have been ruled out as the real problem.

**And only once:**
- it has passed tests on scratch data: deletes, contradictions, status leaks, separation between vaults, rebuild and locked tools;
- you have decided which LLM may read your sessions: a local model that proved accurate and fast enough on test data, or a named API provider per vault;
- never a personal ChatGPT login for a work vault.

**Start with sessions only.** Add the Obsidian vault sync only if a test shows that status and dates stay out. Only then does the note-delete cascade apply.

**Configure it like this:**
- **Install:** `hindsight-api` or the embedded package, pinned, one per vault, each with its own data folder and port. Docker is optional.
- **Network and auth:** bound to `127.0.0.1`; the API-key extension on.
- **MCP tools:** an allowlist through `mcp_enabled_tools` (per bank) or `HINDSIGHT_API_MCP_ENABLED_TOOLS`, limited to recall, reflect, retain and reading knowledge pages. That disables `create_directive`, `update_bank`, `delete_bank`, `clear_memories`, `get_document` and the other management tools (<https://github.com/vectorize-io/hindsight/blob/main/hindsight-docs/docs/developer/configuration.mdx>).
- **Directives and mission:** any bank mission or directives live as a reviewed script in the vault, changed only with your yes (principle 8), never created by the agent.
- **Hidden copies off:** short operation retention, LLM tracing off, mental-model history off.
- **coding-agents plugin:** `optInOnly` with only the vault paths; `mapPathToBank`; `paths.<prefix>` routing to the work server.
- **Plugin features off:** `gitIngest: none`, `autoSeed: false`, `codebaseSurvey: false`, `autoUpdate: false`.
- **Injection:** `autoInject: recall` or `none`, plus a `toolGuideExtra` stating the vault rules.

## 6. Sources

All checked on 2026-10-13 by the research, verification and revision passes unless marked otherwise.

**Project inputs**
- [System design]({{ '/system-design/' | relative_url }}) (sections 2, 4.3, 6.1-6.9 and 8)
- [Landscape survey]({{ '/research/2026-10-11-landscape-survey/' | relative_url }}) (section 4)

**Plain markdown baseline (tool docs and issues)**
- <https://code.claude.com/docs/en/memory> (AGENTS.md loading, `@AGENTS.md` import, user-scope rules, `claudeMdExcludes`, auto memory)
- <https://code.claude.com/docs/en/settings-reference> (incl. `permissions.blockReadsOutsideWorkingDirectories`)
- <https://code.claude.com/docs/en/claude-directory>
- <https://code.claude.com/docs/en/costs>
- <https://code.claude.com/docs/en/hooks>
- <https://code.claude.com/docs/en/env-vars>
- <https://code.claude.com/docs/en/permissions>
- <https://code.claude.com/docs/en/data-usage>
- <https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md>
- <https://github.com/anthropics/claude-code/blob/main/LICENSE.md>
- <https://github.com/anthropics/claude-code/issues/93960>
- <https://github.com/anthropics/claude-code/issues/87517>
- <https://github.com/anthropics/claude-code/issues/100491>
- <https://github.com/anthropics/claude-code/issues/61099>
- <https://github.com/anthropics/claude-code/issues/85075>
- <https://github.com/anthropics/claude-code/issues/96578>
- <https://github.com/anthropics/claude-code/issues/95693>
- <https://github.com/anthropics/claude-code/issues/101500>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool>
- <https://learn.chatgpt.com/docs/customization/memories>
- <https://learn.chatgpt.com/docs/config-file/config-reference>
- <https://learn.chatgpt.com/docs/config-file/config-advanced>
- <https://learn.chatgpt.com/docs/agent-configuration/agents-md>
- <https://learn.chatgpt.com/docs/hooks>
- <https://github.com/openai/codex/blob/main/codex-rs/memories/README.md>
- <https://github.com/openai/codex/blob/main/codex-rs/memories/read/src/lib.rs>
- <https://github.com/openai/codex/blob/main/codex-rs/ext/memories/templates/memories/read_path.md>
- <https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/auto-memory.md>
- <https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/memory.md>
- <https://github.com/google-gemini/gemini-cli/tree/main/packages/core/src/tools> (no `save_memory` tool; `memoryTool.ts` holds only file-path helpers)
- <https://github.com/google-gemini/gemini-cli/blob/main/packages/core/src/config/storage.ts>
- <https://github.com/google-gemini/gemini-cli/blob/main/docs/hooks/reference.md>
- <https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/gemini-md.md>
- <https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/settings.md>
- <https://github.com/google-gemini/gemini-cli/blob/main/packages/core/src/utils/paths.ts>
- <https://opencode.ai/docs/rules/>
- <https://docs.github.com/en/copilot/concepts/agents/copilot-memory>
- <https://obsidian.md/help/data-storage>
- <https://forum.obsidian.md/t/enable-use-of-hidden-files-and-folders-starting-with-a-dot-dotfiles-dotfolders-within-obsidian/26908> (community; behaviour **[unverified]** in official docs)

**Gemini CLI and Antigravity CLI**
- <https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/>
- <https://antigravity.google/docs/cli/gcli-migration>
- <https://antigravity.google/docs/getting-started?tab=cli>
- <https://antigravity.google/docs/cli/install/>
- <https://antigravity.google/docs/rules/>
- <https://antigravity.google/docs/hooks>
- <https://github.com/google-antigravity/antigravity-cli> (no source or licence shown)
- <https://docs.claude-mem.ai/antigravity-cli/setup> (third-party; local state paths **[unverified]**)

**Hindsight**
- <https://github.com/vectorize-io/hindsight>
- <https://github.com/vectorize-io/hindsight/blob/main/README.md> (Docker, pip, embedded and daemon installs)
- <https://github.com/vectorize-io/hindsight/releases> (v0.10.3: <https://github.com/vectorize-io/hindsight/releases/tag/v0.10.3>)
- <https://github.com/vectorize-io/hindsight/blob/main/LICENSE>
- <https://github.com/vectorize-io/hindsight/blob/main/CONTRIBUTING.md>
- <https://api.github.com/repos/vectorize-io/hindsight/commits?per_page=100> (commit authors, 2026-10-13)
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-docs/src/pages/changelog/index.md>
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-api-slim/hindsight_api/engine/memory_engine.py>
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-api-slim/hindsight_api/engine/retain/fact_storage.py>
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-api-slim/hindsight_api/engine/reflect/retractions.py>
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-api-slim/hindsight_api/engine/consolidation/prompts.py>
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-api-slim/hindsight_api/config.py>
- <https://hindsight.vectorize.io/developer/observations>
- <https://hindsight.vectorize.io/developer/mcp-server>
- <https://hindsight.vectorize.io/developer/configuration>
- <https://hindsight.vectorize.io/sdks/integrations/coding-agents>
- <https://hindsight.vectorize.io/sdks/embed>
- <https://hindsight.vectorize.io/blog/2026/06/12/version-0-8-2>
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-docs/docs/developer/installation.md> (RAM per component)
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-docs/docs/developer/configuration.mdx> (no-LLM mode, chunks mode, MCP tool allowlist)
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-docs/docs/developer/mcp-server.md> (directives, bank tools)
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-docs/docs/developer/models.mdx> (`claude-code` provider terms notice)
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-docs/docs/developer/performance.md>
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-docs/docs/developer/api/retain.mdx>
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-docs/docs/developer/api/memories.mdx>
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-docs/docs/developer/api/operations.mdx>
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-docs/docs/developer/api/mental-models.mdx>
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-docs/docs/developer/knowledge-pages.mdx>
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-docs/docs/developer/extensions.md>
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-docs/docs/developer/retrieval.md>
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-integrations/coding-agents/README.md> (Antigravity CLI support, `surveyBudgetUsd`)
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-integrations/coding-agents/src/core/inject.ts>
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-integrations/coding-agents/src/core/transcript.ts>
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-integrations/coding-agents/src/core/config.ts>
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-integrations/coding-agents/src/core/daemon.ts>
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-integrations/coding-agents/src/installer.ts>
- <https://github.com/vectorize-io/hindsight/tree/main/hindsight-integrations/obsidian>
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-integrations/obsidian/src/sync.ts>
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-integrations/obsidian/src/frontmatter.ts>
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-integrations/claude-code/scripts/lib/config.py>
- <https://github.com/vectorize-io/hindsight/blob/main/hindsight-cli/src/commands/fs/sync.rs>
- <https://github.com/vectorize-io/hindsight/issues/5419>
- <https://github.com/vectorize-io/hindsight/issues/5067>
- <https://github.com/vectorize-io/hindsight/issues/5544>
- <https://github.com/vectorize-io/hindsight/issues/5210>
- <https://github.com/vectorize-io/hindsight/issues/2696>
- <https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents>
- <https://help.openai.com/en/articles/11369540> **[unverified, returned 403]**

**Engram**
- <https://github.com/Gentleman-Programming/engram>
- <https://github.com/Gentleman-Programming/engram/releases/tag/v3.4.0>
- <https://github.com/Gentleman-Programming/engram/blob/main/README.md>
- <https://github.com/Gentleman-Programming/engram/blob/main/DOCS.md> (CLI, env vars, schema, update check, cloud autosync)
- <https://github.com/Gentleman-Programming/engram/blob/main/docs/AGENT-SETUP.md> (setup targets, user-scope registration, conflict surfacing)
- <https://github.com/Gentleman-Programming/engram/blob/main/docs/intended-usage.md>
- <https://github.com/Gentleman-Programming/engram/blob/main/plugin/claude-code/scripts/user-prompt-submit.sh>
- <https://github.com/Gentleman-Programming/engram/blob/main/TRADEMARKS.md>
- <https://api.github.com/repos/Gentleman-Programming/engram/commits?per_page=100> and `/contributors` (2026-10-13)

**memsearch**
- <https://github.com/zilliztech/memsearch>
- <https://api.github.com/repos/zilliztech/memsearch/contributors> (commit share, 2026-10-13)
- <https://zilliztech.github.io/memsearch/>
- <https://github.com/zilliztech/memsearch/releases/tag/v0.4.21>
- <https://pypi.org/pypi/memsearch/json>
- <https://github.com/zilliztech/memsearch/blob/main/src/memsearch/core.py>
- <https://github.com/zilliztech/memsearch/blob/main/src/memsearch/store.py>
- <https://github.com/zilliztech/memsearch/blob/main/src/memsearch/config.py>
- <https://github.com/zilliztech/memsearch/blob/main/src/memsearch/maintenance.py>
- <https://github.com/zilliztech/memsearch/blob/main/src/memsearch/compact.py>
- <https://github.com/zilliztech/memsearch/blob/main/plugins/claude-code/hooks/common.sh>
- <https://github.com/zilliztech/memsearch/blob/main/plugins/claude-code/hooks/stop.sh>
- <https://github.com/zilliztech/memsearch/blob/main/docs/faq.md>
- <https://github.com/zilliztech/memsearch/blob/main/docs/architecture.md>
- <https://github.com/zilliztech/memsearch/blob/main/docs/design-philosophy.md>
- <https://github.com/zilliztech/memsearch/issues/750>
- <https://github.com/zilliztech/memsearch/pull/795>
- <https://github.com/zilliztech/memsearch/issues/782>
- <https://github.com/zilliztech/memsearch/issues/779>
- <https://github.com/zilliztech/memsearch/issues/780>
- <https://github.com/zilliztech/memsearch/issues/747>
- <https://github.com/zilliztech/memsearch/issues/755>
- <https://github.com/zilliztech/memsearch/issues/738>
- <https://github.com/zilliztech/memsearch/issues/93>
- <https://github.com/milvus-io/milvus-lite/blob/main/README.md>
- <https://github.com/microsoft/onnxruntime/blob/main/docs/Privacy.md>
- <https://geminicli.com/docs/hooks/reference/>
- <https://platform.claude.com/docs/en/about-claude/pricing>

**qmd**
- <https://github.com/tobi/qmd>
- <https://github.com/tobi/qmd/blob/main/LICENSE>
- <https://github.com/tobi/qmd/blob/main/CHANGELOG.md>
- <https://www.npmjs.com/package/@tobilu/qmd>
- <https://github.com/tobi/qmd/blob/93d211f9ef4a869a9aed0d075ca767dda552627f/src/store.ts>
- <https://github.com/tobi/qmd/blob/v2.8.3/src/store.ts>
- <https://github.com/tobi/qmd/blob/93d211f9ef4a869a9aed0d075ca767dda552627f/src/llm.ts>
- <https://github.com/tobi/qmd/blob/93d211f9ef4a869a9aed0d075ca767dda552627f/.claude-plugin/marketplace.json>
- <https://github.com/tobi/qmd/issues/938>
- <https://github.com/tobi/qmd/issues/897>
- <https://github.com/tobi/qmd/pull/993>
- <https://github.com/tobi/qmd/issues/975>
- <https://github.com/tobi/qmd/issues/961>
- <https://github.com/tobi/qmd/issues/942>
- <https://github.com/tobi/qmd/issues/1010>
- <https://github.com/tobi/qmd/issues/925>
- <https://github.com/tobi/qmd/issues/935>
- <https://github.com/tobi/qmd/issues/1048>
- <https://github.com/openclaw/openclaw/pull/120936>
- <https://docs.openclaw.ai/releases/2026.8.1/memory>

**agentcairn**
- <https://github.com/ccf/agentcairn>
- <https://agentcairn.dev>
- <https://pypi.org/project/agentcairn/>
- <https://github.com/ccf/agentcairn/blob/main/CHANGELOG.md>
- <https://github.com/ccf/agentcairn/blob/main/src/cairn/paths.py>
- <https://github.com/ccf/agentcairn/blob/main/src/cairn/schedule.py>
- <https://github.com/ccf/agentcairn/blob/main/src/cairn/cli.py>
- <https://github.com/ccf/agentcairn/blob/main/src/cairn/ingest/distill.py>
- <https://github.com/ccf/agentcairn/blob/main/src/cairn/ingest/consolidate.py>
- <https://github.com/ccf/agentcairn/blob/main/src/cairn/ingest/harness/opencode.py>
- <https://github.com/ccf/agentcairn/blob/main/src/cairn/temporal.py>
- <https://github.com/ccf/agentcairn/blob/main/src/cairn/recall_hook.py>
- <https://github.com/ccf/agentcairn/blob/main/src/cairn/mcp/server.py>
- <https://github.com/ccf/agentcairn/blob/main/src/cairn/assets/using-agentcairn-memory/SKILL.md>
- <https://github.com/ccf/agentcairn/blob/main/integrations/opencode/agentcairn.ts>
- <https://github.com/ccf/agentcairn/issues/28>
- <https://github.com/ccf/agentcairn/issues/173>
- <https://github.com/ccf/agentcairn-obsidian>
- <https://claude.com/pricing>

**Cognee**
- <https://github.com/topoteretes/cognee>
- <https://github.com/topoteretes/cognee/releases/tag/v1.6.3>
- <https://docs.cognee.ai/core-concepts/main-operations/forget>
- <https://docs.cognee.ai/python-api/update>
- <https://docs.cognee.ai/core-concepts/main-operations/legacy-operations/add>
- <https://docs.cognee.ai/core-concepts/main-operations/recall>
- <https://docs.cognee.ai/guides/review-conflicts>
- <https://docs.cognee.ai/core-concepts/multi-user-mode/data-isolation-and-multi-tenancy>
- <https://docs.cognee.ai/cognee-mcp/mcp-tools>
- <https://docs.cognee.ai/setup-configuration/llm-providers>
- <https://github.com/topoteretes/cognee/blob/main/cognee/infrastructure/databases/unified/provenance_delete_planner.py>
- <https://github.com/topoteretes/cognee/blob/main/cognee/infrastructure/databases/graph/ladybug/adapter.py>
- <https://github.com/topoteretes/cognee/blob/v1.6.3/cognee/modules/improve/registry.py>
- <https://github.com/topoteretes/cognee/blob/v1.6.3/cognee/api/v1/add/routers/get_add_router.py>
- <https://github.com/topoteretes/cognee/blob/v1.6.3/cognee/shared/utils.py>
- <https://github.com/topoteretes/cognee/issues/4462>
- <https://github.com/topoteretes/cognee/issues/3766>
- <https://github.com/topoteretes/cognee-integrations/blob/main/integrations/claude-code/scripts/session-start.py>

**Basic Memory**
- <https://github.com/basicmachines-co/basic-memory>
- <https://github.com/basicmachines-co/basic-memory/blob/main/LICENSE>
- <https://github.com/basicmachines-co/basic-memory/blob/main/CLA.md>
- <https://github.com/basicmachines-co/basic-memory/blob/main/CHANGELOG.md>
- <https://github.com/basicmachines-co/basic-memory/blob/main/src/basic_memory/indexing/batch_indexer.py>
- <https://github.com/basicmachines-co/basic-memory/blob/main/src/basic_memory/cli/commands/hook.py>
- <https://github.com/basicmachines-co/basic-memory/blob/main/src/basic_memory/models/project.py>
- <https://docs.basicmemory.com/raw/integrations/obsidian.md>
- <https://pypi.org/project/basic-memory/>
- <https://github.com/basicmachines-co/basic-memory/issues/1395>
- <https://github.com/basicmachines-co/basic-memory/issues/1588>
- <https://github.com/basicmachines-co/basic-memory/issues/1718>
- <https://github.com/basicmachines-co/basic-memory/issues/1731>

**MemPalace**
- <https://github.com/MemPalace/mempalace>
- <https://github.com/MemPalace/mempalace/issues> and /pulls (open counts via the GitHub search API, 2026-10-13)
- <https://mempalaceofficial.com/concepts/knowledge-graph.html>
- <https://mempalaceofficial.com/reference/mcp-tools.html>
- <https://github.com/MemPalace/mempalace/blob/develop/CHANGELOG.md>
- <https://github.com/MemPalace/mempalace/blob/develop/mempalace/mcp_server/_guards.py>
- <https://github.com/MemPalace/mempalace/blob/develop/mempalace/sync.py>
- <https://github.com/MemPalace/mempalace/blob/develop/mempalace/wal.py>
- <https://github.com/MemPalace/mempalace/blob/v3.10.0/mempalace/mcp_light_server.py>
- <https://github.com/MemPalace/mempalace/blob/develop/.claude-plugin/.mcp.json>
- <https://github.com/MemPalace/mempalace/issues/2225>
- <https://github.com/MemPalace/mempalace/issues/224>
- <https://github.com/MemPalace/mempalace/issues/1355>
- <https://github.com/MemPalace/mempalace/issues/2403>
- <https://pypi.org/project/mempalace/>
- <https://arxiv.org/abs/2604.21284>
- <https://vectorize.io/articles/mempalace-review> (published by Hindsight's vendor, a competitor)

**Graphiti**
- <https://github.com/getzep/graphiti>
- <https://github.com/getzep/graphiti/blob/2f0fb35b749f1ff17377892e099882176e453393/graphiti_core/graphiti.py>
- <https://github.com/getzep/graphiti/blob/2f0fb35b749f1ff17377892e099882176e453393/graphiti_core/utils/maintenance/edge_operations.py>
- <https://help.getzep.com/graphiti/core-concepts/graph-namespacing>
- <https://github.com/getzep/graphiti/issues/1837>
- <https://github.com/getzep/graphiti/pull/1912>
- <https://github.com/getzep/graphiti/issues/1909>
- <https://github.com/getzep/graphiti/issues/1516>
- <https://github.com/getzep/graphiti/issues/1651>
- <https://github.com/getzep/graphiti/pull/1963>
- <https://pypi.org/project/graphiti-core/>
- <https://github.com/FalkorDB/FalkorDB/blob/master/LICENSE>
- <https://github.com/getzep/zep>

**mem0**
- <https://github.com/mem0ai/mem0>
- <https://github.com/mem0ai/mem0/blob/main/mem0/memory/main.py> (`update`, `delete`, `delete_all`, `reset`)
- <https://docs.mem0.ai/migration/oss-v2-to-v3>
- <https://docs.mem0.ai/platform/platform-vs-oss>
- <https://docs.mem0.ai/platform/mem0-mcp>
- <https://docs.mem0.ai/integrations/hermes> (open-source mode)
- <https://github.com/mem0ai/mem0/pull/6530>
- <https://github.com/mem0ai/mem0-mcp>
- <https://github.com/mem0ai/mem0/issues/7452>
- <https://github.com/mem0ai/mem0/issues/7226>
- <https://github.com/mem0ai/mem0/issues/7535>
- <https://github.com/mem0ai/mem0/pull/7538>
- <https://github.com/mem0ai/mem0/issues/6085>
- <https://mem0.ai/pricing>

**Letta / Letta Code**
- <https://github.com/letta-ai/letta-code>
- <https://github.com/letta-ai/letta>
- <https://docs.letta.com/letta-code/local-mode>
- <https://docs.letta.com/letta-code/memfs>
- <https://github.com/letta-ai/letta-code/blob/main/src/agent/subagents/sandbox.ts>
- <https://github.com/letta-ai/letta-code/blob/main/src/telemetry/index.ts>
- <https://github.com/letta-ai/letta-code/blob/main/src/utils/transcript-paths.ts>
- <https://github.com/letta-ai/letta-code/issues/4029>
- <https://github.com/letta-ai/letta-code/issues/4491>
- <https://github.com/letta-ai/claude-subconscious>
- <https://www.letta.com/privacy-policy>

**Screened out**
- <https://github.com/rohitg00/agentmemory>
- <https://github.com/thedotmack/claude-mem>
- <https://github.com/volcengine/OpenViking>
- <https://github.com/supermemoryai/supermemory>
- <https://github.com/EverMind-AI/EverOS>
- <https://github.com/agentscope-ai/ReMe>
- <https://github.com/doobidoo/mcp-memory-service>
- <https://github.com/plastic-labs/honcho>
- <https://github.com/MemMachine/MemMachine>
- <https://github.com/MemTensor/MemOS>
- <https://github.com/NevaMind-AI/memU>
- <https://github.com/MemoriLabs/Memori>
- <https://github.com/khoj-ai/khoj>
