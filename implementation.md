---
layout: default
title: "Second Brain: implementation"
---

# Second Brain: implementation

The author's implementation of the system described in [the system design]({{ '/system-design/' | relative_url }}). Others can use it as a template for their own.

| | |
|---|---|
| Status | One working setup. Section 3 lists where it deliberately differs from the system. |
| Implements | [System design]({{ '/system-design/' | relative_url }}), system v1 |
| Research | [Landscape survey]({{ '/research/2026-10-11-landscape-survey/' | relative_url }}); agent memory: [Agent memory research]({{ '/research/2026-10-13-agent-memory-research/' | relative_url }}) |

**How the two documents relate.** This document says how the system runs. It never changes what the system is. When an implementation choice seems to need a change to the system, it is raised as a proposal. References to "section 5.8", "6.7" and so on below point to the system design unless they say otherwise.

---

## 1. Setup

**Repositories:**
- The system and its specs are published in this repository. A person's own vault is private and is never part of it.
- The plugin, Ninja Board, is in its own repository: <https://github.com/AlexSendula/ninja-board>.
- The setup kit (`SETUP.md`, `install.py`, the vault template, `AGENTS.md`, the `brain` skills and the `brain` CLI) is in its own repository, <https://github.com/AlexSendula/second-brain-setup>, at version 1.0.0.
- Every vault is its own private git repository and holds its own copy of the `brain` skills (system 6.4: self-contained).
- A vault is a folder with local git and no remote until backups are decided, kept out of cloud-sync folders. iCloud's "Desktop & Documents" sync must stay off for a vault; `brain-setup` warns when a vault sits in a folder iCloud syncs.

**Requirements:** git and uv. `uv` runs the scripts with Python 3.14 or newer and fetches that Python itself. `brain-setup` checks both and says exactly what to install when one is missing.

**Agent tools:** Claude Code first; Codex and VS Code with GitHub Copilot are also used and tested. No Google tool. Install asks which tools a vault uses and writes only their files; config records the choice, updates keep those files current, and `brain-setup` adds a tool's files when you start using another one.

| Tool | Reads natively | Extra files in the vault |
|---|---|---|
| Claude Code | `CLAUDE.md` or `.claude/CLAUDE.md`, `.claude/skills/` | `.claude/CLAUDE.md` with the import lines `@../AGENTS.md` and `@../.memory/MEMORY.md` (imports resolve from the file's own folder; a pointer in plain words would leave AGENTS.md unloaded; inside `.claude/`, Obsidian never shows it); `.claude/settings.json` (`autoMemoryEnabled: false`); `.claude/skills` linked to `.agents/skills` |
| Codex | `AGENTS.md`, `.agents/skills/` (from the working folder up to the repo root; follows symlinks) | none; its memories are off by default |
| VS Code Copilot | `AGENTS.md`, `.agents/skills/` (also `.claude/skills/` and `.github/skills/`) | `.vscode/settings.json` (`github.copilot.chat.tools.memory.enabled: false`) |

**Entry point:** `AGENTS.md` at the vault's top folder.

**Reader and views:** Obsidian, with as few third-party plugins as possible, because a plugin can do anything on the computer (see [Obsidian plugins]({{ '/research/2026-10-13-obsidian-plugins/' | relative_url }})).
- **The human side is Ninja Board, an Obsidian plugin built for this implementation**, in its own repository (install and use are in its README). It shows the vault the way a good app would: a week board with story cards and their tasks (tickable), boards you drag cards on, progress per story and project, appointments next to tasks. It reads and writes the notes directly and keeps no data of its own, so views can't drift from the vault. It only shows notes and makes simple edits (tick, change state, move a card), plus the one-step completion edit for a repeating note (its next due date); the `brain` tools and the agent keep the rest of the repeat math. **Parity:** anything you can do in the plugin, the agent can do with the same result. The plugin's edits are the fixed edit rules below (section 2, "Edits"), and the agent makes them with `brain` commands. The plugin's tests run one shared file of these examples, `test/edit-cases.json` in its repository. The Tasks plugin stays: Ninja Board ticks task lines through it, so there is one completion engine, and task lines use its Dataview format with a custom status `w` for waiting (section 2).
- Core plugins: Bases (including its kanban view since Obsidian 1.14), Properties view, Bookmarks, File recovery, Backlinks. Obsidian's own "Default file to open" setting opens the start page.
- Dashboard pages in a `01 Dashboard/` folder (system 4.8 asks for these views): one note per Ninja Board view, numbered so the file list shows them in order of use (`01 Today`, `02 Week`, `03 Projects`, `04 Backlog`, `05 Guide`), each a `base` block that uses the view. Today is the start page. How you arrange cards on the Week and Projects boards is saved in that dashboard note's `base` block (an `arrange:` list per column), and so is which view Today's Schedule shows (`schedule: compact`; large when absent), never in task notes; it's layout only, and the agent can edit it too. Ninja Board replaces a mix of Tasks queries and Bases views, because Tasks lists look plain and can't show a story's tasks on a board card.

**Folders, numbered by importance** (deviation 2):
```
01 Dashboard/   02 Inbox/   03 Projects/   04 Areas/   05 People/   06 Conversations/
07 Resources/   08 Weeks/   09 Logs/   10 Archive/   99 System/
```
`99 System` replaces the system's `_system`, which Obsidian would sort above the numbers. The archive mirrors the numbered names (`10 Archive/03 Projects/…`), so a revived item goes back to its old spot. Links point to note names, so the numbers never break a link.

**Week plan:**
- `08 Weeks/<year>/<YYYY-Www>.md`; the year is the ISO week's year, so the week of Mon 29 Dec 2025 is `08 Weeks/2026/2026-W01.md`. Yours: the focus, `## Plan` (free text) and `## Budgets` (Capacity); the tool never touches them. Generated: `## Overview` between two marker comments, which say that edits there are overwritten.
- The overview shows Monday to Sunday, each day with its appointments (repeating ones included), commitments with a time, tasks due or planned that day and birthdays; then "Done this week"; with Capacity, uncommitted, planned and tracked hours.
- **What a week holds** (the overview and the Week board follow the same rule): an item is in a week when one of these falls in it: its do date (a planned day, `scheduled`, or planned for the week, `start` as that Monday), its deadline (`due`), its lead window (from `due` minus `lead` up to `due`), its chase date (a waiting line's `scheduled`), its repeat, or it was done that week. An item still open that was assigned to an earlier week carries over into this week until it is done or replanned. A story with no date is in no week; it is listed under Backlog until it is planned.
- It also holds the week's record, which Ninja Board shows for a past week: `### Appointments`, `### Done`, `### In progress`, `### Not done` and `### Backlog`, each item a plain list item (never a checkbox): `- <title> · <context>` with fields where they apply, `[day:: date]`, `[time:: HH:MM]`, `[due:: date]`, `[moved:: date]`, `[dropped:: date]`. An item that was ever listed in the week and later leaves it stays in Not done with `moved` or `dropped`, whoever moved it, so nothing is lost from the record.
- `brain week` builds or refreshes it, and every refresh sets the plan's `updated` to that day's date; the date math happens in the tool. The catch-up runs it every session, so the current week stays current.
- Freezing: the first catch-up in a new week refreshes the last existing week plan one final time (recording what got done, what was in progress, what was left undone and the backlog then) and marks it `frozen` with the date (`frozen: YYYY-MM-DD` in its frontmatter); a frozen plan is never refreshed again and is the record of that week.
- Weeks without a session get no file. After a break, the last existing plan is frozen with what the vault knows and the current week is built; the return mode handles the rest.
- With `week_plan: false` there are no week files; the views and the plugin still show the week live. The plugin is the live view, the week plan the frozen record.

**Break marks** (system 4.7): one tag per mark, the same on lines and notes.
- Set aside "from your break": tag `from-break` (a line: `- [ ] Clean the gutters #from-break`; a note: `tags: [from-break]`). The tag is removed when the item is sorted (done, new date, dropped or kept); the weekly review brings back a few each time.
- A past one-off appointment archived during a break: tag `unconfirmed`, until you confirm it or say it didn't happen.
- Breaks themselves aren't stored: every session ends with a saved version, so a gap of more than a week between saved versions is a break, and "stalled" skips those gaps.

**Privacy:** a vault is seen by the provider of each agent tool you use in it, under that tool's terms: Anthropic for Claude Code, OpenAI for Codex. Memory adds no provider. Nothing extra blocks web tools or global MCP servers in vault sessions; the system's rule that vault content goes nowhere unapproved (system 6.5) stays an instruction to the agent.

**Agent memory** (see [Agent memory research]({{ '/research/2026-10-13-agent-memory-research/' | relative_url }})):
- Plain markdown, no memory service: one file, `.memory/MEMORY.md`, in each vault. Git-ignored, so it stays out of saved versions and a wipe is a real wipe.
- The memory rules live in the Memory section of `AGENTS.md`. Every session reads the file at the start, saving is a step at the end of each batch, and merging and pruning are part of the weekly review. Claude Code imports the file so it's loaded from the first message; Codex and Copilot read it because `AGENTS.md` says so, and a tool gets a session-start hook only if a test shows it skips the file.
- Agent tools' own memories are off inside vaults and stay on elsewhere (settings in the table above).
- No search index in v1. Upgrade path, only when real use shows the need: qmd for search (vault and memory indexed separately), a reminder hook if a tool forgets to save, Engram if memory outgrows one file, Hindsight (sessions only, one local server per vault) for patterns across many sessions.

**Routines and tools are skills** (a folder with a `SKILL.md`), installed inside the vault at `.agents/skills/`, which Codex and VS Code read directly. Claude Code only reads `.claude/skills/`, so `.claude/skills` is a link to `.agents/skills`; if a test shows Claude Code doesn't follow a folder link, each skill gets its own link instead (documented to work), created by install and updates and flagged by the check when missing. VS Code may then list each skill twice, which is harmless.

```
.agents/skills/
  brain/                        the toolbox
    SKILL.md                    how to use the scripts; also used for direct questions
    scripts/brain                 one command: query, check, complete, hours
  brain-catch-up/               incl. building and freezing week plans
  brain-return/
  brain-organize/
  brain-conversation/
  brain-daily/
  brain-weekly/
  brain-log-time/               Capacity add-on
  brain-setup/                  new vault, updates, format migration, add-ons on/off
  <your own skills>/            no `brain` prefix
```

- Skills whose name starts with `brain` are the installed copy of the system and are replaced by updates; any other skill is yours. Tools only find skills directly under `skills/`, so the split is by name, not by subfolder. The prefix is `brain`.
- Add-on skills are installed only while their add-on is on.
- The tools are one command, `brain`, in the toolbox skill, called from the vault's top folder, e.g. `.agents/skills/brain/scripts/brain query tasks --status open --area Health --due-before 2026-10-17`.
- `brain` is Python 3.14 or newer with one library, PyYAML, to read frontmatter in any form Obsidian writes. Both are declared in an inline script header (PEP 723: `requires-python = ">=3.14"`, `dependencies = ["pyyaml"]`), so `uv` picks or fetches a matching Python and the library; its first line runs it through `uv run --script`. When a script changes a note, it edits only the lines that change and leaves the rest of the formatting alone.
- Subcommands: `query <type> [filters]`, `check [file]` (non-zero exit code on problems), `complete <file> [--date <date>]`, `state <file>[:<line>] <state>`, `plan <file>[:<line>] <date|YYYY-Www|none>` (on a day, for a week, or unplanned), `due <file>[:<line>] <date|none>` (sets or removes a deadline), `points <file> <1|2|3|5|8|none>` (a story's points; a note, so no line), `hours --week <week>`, `week [<week>]` (builds or refreshes a week plan). `complete`, `state`, `plan`, `due` and `points` make the same edits as Ninja Board (the Edits in section 2); for a repeating task note, `state … done` is `complete`. `<line>` is 1-based, as editors show it. `state` takes these words for a task line: `todo`, `doing`, `waiting`, `done` or `dropped`. A task note keeps its status values (`open`, `doing`, `waiting`, `someday`, `done`, `dropped`). Output is plain text; a machine-readable format can come when a UI needs it.

Example skill:

```
---
name: brain-organize
description: Process the inbox. Use when the user asks to process the inbox,
  when the catch-up offers it, or at the start of the weekly review.
---
1. List what's waiting: `.agents/skills/brain/scripts/brain query inbox`
2. For each item, decide its kind (see 99 System/types/) and check 99 System/rules.md.
   Clear: file it as a new note or update an existing one, linking back to the item.
   Unclear: keep it in the inbox and save the question.
3. Ask all saved questions at once.
4. Run `.agents/skills/brain/scripts/brain check` and fix what it reports.
5. Save a version, then summarize what moved where.
```

**Installing a vault:**
- `uv run install.py <folder>`, run from the setup kit's repository, does the mechanical part: the folder skeleton, the `brain` skills, the files for the chosen agent tools, `AGENTS.md`, `.gitignore` (with `.memory/`), an empty `.memory/MEMORY.md`, `99 System/` (config, rules, type definitions), `git init` and the first saved version. It refuses a folder that isn't empty.
- It writes no plugin code. It writes Tasks' settings, the list of enabled plugins and Ninja Board's five dashboard notes (from a pinned release, checked by sha256). At the end of setup, you install Tasks and Ninja Board from Obsidian's community plugins, or the agent does it through Obsidian's command line interface (Obsidian 1.12.4 or newer). Obsidian updates the plugins; an update of the vault never touches them.
- `AGENTS.md` is out of sight in Obsidian: a CSS snippet, `hide-agent-files`, hides it from the file list, and Excluded files keeps it out of search, the graph and Bases. Agents still find it at the top folder.
- Then, in the vault, `brain-setup` asks the personal questions: your name (for your person note), timezone, add-ons (Capacity: available hours and days), daily briefing.

**Updates:**
- *What:* a newer version of the `brain` skills, and sometimes the format (then existing notes are migrated). *Why:* fixes, better routines, new add-ons or fields.
- *Promises:* only when you ask; you see what changed, and whether notes need migrating, before anything happens; a version of the vault is saved first and undoing an update is restoring it; notes change only through a migration you approved; your own skills, rules and settings are never changed (an update only records the new version numbers in config); an edited installed skill is kept aside, not overwritten.
- *Steps:* fetch the new version → show changes and wait for yes → save a version → replace the `brain` skills → migrate if the format changed, then `check` → record the new version in config, save, summarize.
- *Source:* config records where updates come from (`update_source`: a folder or a URL).
- *Versions:* `system_version` (`1.0.0`, …) changes with every update; `format_version` (`1`, `2`, …) changes only when notes need migrating, which tells the update whether a migration step is needed.
- The first version of `brain-setup` skips migration until a format change needs one.

## 2. Reference format
The format this implementation uses.

**Frontmatter:** YAML. Links in frontmatter are quoted (`area: "[[Health]]"`); times are written as quoted text (`"10:00"`), because a YAML 1.1 parser reads `10:00` as the number 600; lists use YAML list syntax (`[home, out, computer]`).

**Value formats:**

| Value | Format | Examples |
|---|---|---|
| date | `YYYY-MM-DD` | `2026-10-11` |
| datetime | `YYYY-MM-DDTHH:MM` | `2026-10-11T14:32` |
| time | `"HH:MM"` (24-hour) or a range `"HH:MM-HH:MM"` | `"10:00"`, `"10:00-10:30"` |
| duration | number + `m`, `h`, `d` or `w`; combined largest first | `15m`, `1h30m`, `2w` |
| repeat | `every [n] day(s)/week(s)/month(s)/year(s)`, or `every <weekdays>` | `every month`, `every 6 months`, `every mon, wed, fri` |
| weekdays | `mon`…`sun`; ranges with `-`, lists with `, ` | `mon-fri`, `tue`, `mon, wed, fri` |
| when | weekdays + optional time range | `"tue 20:15-22:15"`, `"mon-fri 08:30-17:00"` |
| week | ISO week `YYYY-Www` | `2026-W42` |
| birthday | `YYYY-MM-DD`, or `MM-DD` without the year | `"03-14"` |
| link | `"[[Name]]"` | `"[[Website for Sam]]"` |
| text | free text | `the plumber` |
| true/false | `true` or `false` | `false` |
| list | YAML list of values or links | `[home, out]` |

**Fields and `type` values:**

| Kind · `type` | Fields (required in bold) |
|---|---|
| every note | **`type`**, **`created`** (date), `tags` (list) |
| Inbox item · `inbox` | `source` (`chat`, `note`, `phone`, `email`, or a feed's name), `received` (datetime), `question` (text). Optional on notes dropped in by hand; the agent fills them in. |
| Area · `area` | none |
| Project · `project` | **`status`** (`active`, `paused`, `someday`, `done`, `dropped`), `area` (link), `due` (date), `done` (date; required when done or dropped) |
| Task · `task` | **`status`** (`open`, `doing`, `waiting`, `someday`, `done`, `dropped`), `due` (date), `lead` (duration), `scheduled` (date), `start` (date; planned for that week, any day: deviation 3), `repeat` (requires `due`), `repeat_from` (`due` default, or `done`), `if_missed` (`carry` or `lapse`; fixed-date repeats only), `estimate` (duration), `context` (one of config's contexts), `waiting_on` (link or text; required when waiting), `chase` (date; required when waiting), `done` (date; required when done or dropped; a completed occurrence of a repeating task note writes none), `points` (1, 2, 3, 5 or 8; stories only, deviation 5) |
| Appointment · `appointment` | **`date`** (first occurrence for a repeating one), `repeat` (repeat), `time` (time), `length` (duration), `where` (text), `with` (links or text), `calendar` (true/false, default false) |
| List · `list` | none |
| Note · `note` | none |
| Person line | in `05 People/People.md`: `- Sam Rivers (birthday 07-02) · a friend`; with its own note: `- [[Robin]]` |
| Person · `person` | `birthday` |
| Conversation · `conversation` | **`date`**, **`with`** (links or text), `about` (links to any notes), **`source`** (`chat`, `transcript`, `notes`) |
| Week plan · `week-plan` | **`week`**, `focus` (text), `updated` (date; set by every refresh), `frozen` (date; set at the freeze, after which the plan is never refreshed), `points_planned` and `points_done` (numbers; set by every refresh, only when a story in that week has points; deviation 5). Budgets in a `## Budgets` section, one line each: `- 3h [[Website for Sam]]`. The overview below is generated; don't edit it by hand. |
| Config · `config` | `system_version` (quoted text, e.g. `"1.0.0"`), `format_version` (number), `update_source` (folder or URL), `agent_tools` (list: `claude-code`, `codex`, `vscode`), `addons` (list), `contexts` (list), `weekly_review` (weekdays), `daily_briefing` (true/false), `week_plan` (true/false, default true), `timezone`, `points_per_week` (number; default 8 when absent); with Capacity: `available` (duration per day, default `16h`), `available_days` (weekdays, default `mon-sun`) |
| Rules · `rules` | Body: `- <when> → <do> (confirmed YYYY-MM-DD)`; under `## Outside the vault`: `- <action> to <destination> [when <condition>] (granted YYYY-MM-DD)` |
| Commitment · `commitment` | **`when`**, `length` (duration; required when `when` has no times), `from`, `until` (dates), `calendar` (true/false, default false) |
| Task line | The Tasks plugin's Dataview format: `- [ ] Call the plumber [due:: 2026-10-17]`. Fields in square brackets: `[due:: date]` (deadline), `[scheduled:: date]` (planned day), `[start:: date]` (planned for that week, any day: the week's Monday; deviation 3). States: to do `[ ]`; doing `[/]`; waiting `[w]`, with the chase date as `scheduled` and who in the text (`- [w] Hear back from the landlord [scheduled:: 2026-10-20]`); done `[x]` with `[completion:: date]`; dropped `[-]` with `[cancelled:: date]`, also when its project is dropped. `w` is a custom status in Tasks' settings: name Waiting, next status `x`, type ON_HOLD. |
| Time log · `time-log` *(Capacity)* | File frontmatter `type` only. Lines: `- 2026-10-11 1h40m [[Website for Sam]] built the header` |
| Type definition · `type` | `name`, `folder`, `filename`, `fields` (each: a value format from the table above, a choice of formats such as link-or-text, or allowed values; `required`, or `required_when: <field> is <value>`; `default`), and a `## Template` section |

**Edits** (the only changes the plugin makes; the agent makes the same ones through `brain` commands):

| Change | Before | After |
|---|---|---|
| Start a task | `- [ ] Send Sam the hosting options [due:: 2026-10-17]` | `- [/] …` (same line, `/`) |
| Wait on someone | `- [/] …` | `- [w] …`; its `[scheduled:: …]` is the chase date |
| Complete a task (done through Tasks) | `- [ ] … [due:: 2026-10-17]` | `- [x] …  [due:: 2026-10-17]  [completion:: 2026-10-14]`, as Tasks writes it (two spaces before each field) |
| Reopen a done or dropped task | `- [x] … [completion:: 2026-10-12]` | `- [ ] …`; completion and cancelled dates removed |
| Drop a task | `- [ ] …` | `- [-] … [cancelled:: 2026-10-14]` |
| Plan a task on a day | `- [ ] Clean the gutters` | `- [ ] Clean the gutters [scheduled:: 2026-10-21]` (an existing `scheduled` is replaced, a `start` removed; a task note gets `scheduled: 2026-10-21`). A `due` in an earlier ISO week than the day's is removed too, an overdue one included (a task overdue since last week, planned on a day this week, loses its `due`); one in the same week or later stays. |
| Plan a task for a week, any day | `- [ ] Clean the gutters` | `- [ ] Clean the gutters [start:: 2026-10-19]`, that week's Monday (an existing `start` is replaced, a `scheduled` removed; a task note gets `start: 2026-10-19`). A `due` in an earlier ISO week than that week is removed too; one in the same week or later stays. |
| Unplan a task (later, no date) | `- [ ] Clean the gutters [start:: 2026-10-19]` | `- [ ] Clean the gutters`: every `scheduled` and `start` removed, so it's back in the backlog. A `due` on or before this week's Sunday (due this week, or overdue) is removed too; one further out stays. |
| Plan a task out of its deadline's week | `- [ ] Renew passport [due:: 2026-10-15]` | `- [ ] Renew passport [scheduled:: 2026-10-21]`: the day is in a later week than the deadline's, so the `due` goes (a task note's `due` key is deleted, unless the note repeats). Planned on Sat 17 Oct, in the deadline's own week, it would keep `[due:: 2026-10-15]`. |
| Plan a repeating task note, on a day, for a week or to no date yet | `repeat: every month` and `due: 2026-10-15` in the note's frontmatter | `scheduled: 2026-10-21` (or `start`, or neither, as the plan says); `due: 2026-10-15` stays whatever the plan. A repeating task note's `due` is never removed by planning. |
| Set a deadline | `- [ ] Renew passport [scheduled:: 2026-10-20]` | `- [ ] Renew passport [scheduled:: 2026-10-20] [due:: 2026-10-23]` (an existing `due` is replaced; a task note gets `due: 2026-10-23`). Making a day the deadline also stops it being the planned day: a `scheduled` on that same date is removed. |
| Remove a deadline | `- [ ] Renew passport [due:: 2026-10-23]` | `- [ ] Renew passport` (a task note's `due` removed); a repeating task note's `due` is never removed this way |
| Change a task note's or project's state | `status: open` | `status: doing` (task notes: open, doing, waiting, someday, done, dropped; projects: active, paused, someday, done, dropped) |
| Finish a task note or project (not a repeating task note; see the rows below) | `status: doing` | `status: done` and `done: 2026-10-14` (kept if already set) |
| Drop a task note or project | `status: active` | `status: dropped` and `done: 2026-10-14` (kept if already set) |
| Move it out of done or dropped again | `status: done`, `done: …` | the new `status`; `done` removed |
| Set story points | `status: open`, no `points` | `points: 3` added to the note's frontmatter, one of 1, 2, 3, 5 or 8 (an existing `points` is replaced). Stories only: a task note inside a project. |
| Remove story points | `points: 3` | The `points` key removed |
| Complete a repeating task note: counted from the due date, a missed fixed date carries over | **Rent.** `repeat: every month`, `repeat_from: due`, `if_missed: carry`, `due: 2026-10-01`, `status: open`; done on 2026-11-16 | `due: 2026-11-01`, `status: open`; no `done`. Counted from 1 October, not from the day it was done (that would give 16 December). The 1 November occurrence carries over and stays due until it is done. Log line: `- 2026-11-16 Done: the occurrence due 2026-10-01. Next due 2026-11-01.` |
| Complete a repeating task note: counted from the done date | **Dentist.** `repeat: every 6 months`, `repeat_from: done`, `due: 2026-10-16`, `status: open`; done on 2026-10-20 | `due: 2027-04-20`, `status: open`; no `done`. Log line: `- 2026-10-20 Done: the occurrence due 2026-10-16. Next due 2027-04-20.` |
| Complete a repeating task note: a missed fixed date lapses | **Bins.** `repeat: every tue`, `repeat_from: due`, `if_missed: lapse`, `due: 2026-10-06`, `status: open`; done on 2026-10-20 | `due: 2026-10-27`, `status: open`; no `done`. The 13 October occurrence lapses. 20 October, the day it was done, is covered by the completion, not lapsed. Log line: `- 2026-10-20 Done: the occurrence due 2026-10-06. Next due 2026-10-27.` |
| Drop a repeating task note | `repeat: every 6 months`, `due: 2026-10-16`, `status: open` | `status: dropped` and `done: 2026-10-14` (today; kept if already set). The `repeat` and `due` keys stay; a dropped note shows no repeat. No Log line, as for any dropped task note. |

`brain complete` writes a completed line in exactly this shape, as Tasks does.

A date field written as a wikilink, such as `[due:: [[2026-10-17]]]`, is one value: an edit replaces or removes all of it.

**Repeating task notes.** Ninja Board shows every state for them, like any task note, and completes them exactly as `brain complete` does (the Edits rows above). Done means this occurrence is done, not the task: the note stays open with its next due date. Dropped stops the repeat: the note is dropped and `done` is set to that day, as for any task note. A repeating note's plan decides its week, and its deadline counts only when it has no plan. Planning never removes its deadline (the Edits).
- **No `if_missed` on a fixed-date note: it carries.** A missed occurrence is never skipped silently, as the system's catch-up never sorts away a repeat that carries over; write `if_missed: lapse` to skip instead.
- **Month ends drift, and that is accepted.** Each step counts from the due date being completed, so 31 Jan, then 28 Feb, then 28 Mar. Avoiding the drift would need a new field.
- **A waiting repeating note.** Ticking it sets it open and removes `waiting_on` and `chase`, as well as `scheduled` and `start`.

**The next date.** With D the due date of the occurrence being completed and C the day it was done (today, or `--date`):
- *Counted from the due date* (`repeat_from: due`, the default; these are the fixed-date repeats). The next date is one repeat step after D. A missed occurrence that **carries over** (`if_missed: carry`) stays due: the next date is the first occurrence after D, even if it has passed. One that **lapses** (`if_missed: lapse`) is skipped: the next date is the first occurrence after the later of D and C.
- *Counted from the done date* (`repeat_from: done`, "from last time"). The next date is one repeat step after C. Nothing is missed, so `if_missed` does not apply.
- A repeat step is `every n` days, weeks, months or years from the anchor; a day a month doesn't have becomes that month's last day. For `every <weekdays>`, the next listed weekday after the anchor.
- The occurrence's planned day or week (`scheduled`, `start`) is removed. `status` becomes `open` with the new `due`. No `done` is written, because the note doesn't finish.
- **The Log.** `complete` adds one line at the top of the note's `## Log` section (newest first, system 5.6), dated with the day it was done: `- 2026-10-20 Done: the occurrence due 2026-10-16. Next due 2027-04-20.` A note with no `## Log` section gets one at the end. A drop adds no Log line, as for any task note.

Task lines don't repeat; repeats live on task notes. A task set to waiting from Ninja Board may lack who or when (a task note's `waiting_on` or `chase`, a line's `scheduled`): `brain check` reports it, and the catch-up asks.

**File names:**
- Inbox items `YYYY-MM-DD HHMM <short title>.md`; conversations `YYYY-MM-DD <who> about <what>.md` (or `YYYY-MM-DD <who>.md`); one-off appointments `YYYY-MM-DD <what>.md` (repeating appointments and commitments are named for what they are); week plans `YYYY-Www.md`; logs `09 Logs/<log>/YYYY-MM <log>.md`. The archive keeps the active paths below `10 Archive/` (processed inbox items: `10 Archive/02 Inbox/<year>/`).
- Names never contain `/ \ : * ? " < > | # ^ [ ]`. Uniqueness ignores case (as macOS does).

**What the check covers:** markdown notes outside hidden folders and `99 System/`, except the entry point; inbox notes dropped in by hand get their fields when they're organized. Attachments (PDFs, images) sit next to the note that links them and are checked only for unique names and links. Log lines are checked against their log's line format, and task and person lines against their line formats.

## 3. Deviations from system v1
Where this implementation deliberately differs from the system. Each one says what and why.

1. **A "doing" state for tasks.** The system's task states are open, waiting, someday, done and dropped (system 5.4). This implementation adds doing (a line shows `[/]`, a task note `status: doing`), so boards can show To do / Doing / Done.

2. **Numbered folders.** The system's layout names the folders without numbers (system 5.1). This implementation numbers them by importance, starting with the dashboard, and renames `_system` to `99 System`, so Obsidian shows them in that order.

3. **Planned for a week, any day.** The system plans a task on a day (`scheduled`, "planned") or not at all (system 5.4). This implementation adds a week-level plan: `start` set to that week's Monday (the Tasks plugin's "work on it from" date), so a task can be planned for a week without tying it to a day or turning it into a deadline. A task has a week plan or a day plan, never both: a new plan replaces the old one. Planning removes a `due` only when the plan leaves it behind: a day or week in a later ISO week than the deadline's, or no date yet while the deadline is on or before this week's Sunday (see the Edits). The time words treat a task starting this week as "this week".

4. **Today keeps a missed plan.** The system puts a task on Today when its deadline or planned day is today (system 3.4). This implementation also keeps a task planned on an earlier day that is still open, labelled with that day ("Planned yesterday", "Planned 9 Oct"), until it's done or replanned, so nothing you meant to do silently drops off.

5. **Story points.** The system has no size field and no story points: an optional estimate covers size, and capacity comes from real hours and the week plan (system section 7). This implementation adds an optional estimate on **stories only** (task notes inside a project): `points`, one of 1, 2, 3, 5 or 8, absent by default. It is for work. With no points anywhere, nothing about points shows. Only stories carry points, never their tasks: a story's points estimate the whole piece of work, so pointing its tasks would count it twice, and Fibonacci values don't add up. The target is `points_per_week` (default 8; a week may be planned and done past it). Each week's record stores its planned and done points, so the agent can learn to estimate better.

