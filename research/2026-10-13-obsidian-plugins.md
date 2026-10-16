---
layout: default
title: "Obsidian plugins for the second brain"
---

# Obsidian plugins for the second brain

**Date:** 2026-10-13. **Question:** which Obsidian plugins are popular, trusted and reviewed, and fit a vault where tasks are checkbox lines inside notes and projects, appointments and bigger tasks are notes with frontmatter. Everything should stay inside Obsidian: live views where ticking a box edits the source, a weekly sense of progress, and appointments next to tasks, without planning the day to the minute.

Download counts come from Obsidian's stats file (<https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json>). Stars, release dates and open issues come from the GitHub API. Health and Review ratings come from each plugin's page on community.obsidian.md.

## Trust model

- **Reviews (since 2026-05-12, <https://obsidian.md/blog/future-of-plugins/>).**
  - Every version, updates included, is scanned automatically for policy compliance, code practices, known vulnerabilities and malware.
  - Manual review continues only for popular, featured and flagged plugins.
  - Failing new plugins and updates are removed from search within 24 hours.
  - Closed-source plugins are no longer accepted.
- **Plugin pages show** (<https://obsidian.md/help/community-directory>):
  - downloads;
  - an **Official** badge, which only Obsidian staff can grant;
  - payment labels;
  - a version history;
  - a scorecard with two parts:
    - **Health:** hygiene, maintenance, responsiveness and adoption.
    - **Review:** the latest automated scan. Labels seen: Passed, Satisfactory, Caution, Risks. Disclosures cover network calls, shell access, `eval` and similar.
- **Caveats seen on the pages:**
  - Every page currently says "Malware scan not available".
  - The Review labels are driven mostly by lint findings (code-style warnings), so read the findings, not the label.
  - "Build reproduced the release main.js byte-for-byte" is a strong positive signal. It means the published plugin was built from the public source.
- **Not built yet:** verified authors, permission declarations and privacy labels.
- **No sandbox.** A plugin can read any file on the computer, use the internet and run programs (<https://obsidian.md/help/plugin-security>). Community plugins do not update themselves.
- **Restricted mode** is on by default and blocks all community plugins. Never trust plugins in a vault someone else made: the April 2026 attack used a shared vault with the Shell Commands plugin (<https://www.elastic.co/security-labs/phantom-in-the-vault>).
- **Audits.** The third-party audits (Cure53, Trail of Bits) cover the app and Sync, not community plugins (<https://obsidian.md/security>).

## Bases (core) in 2026

- **Layouts:** table, cards, list, map, and, since 1.14 (public 2026-10-05), **kanban**. Dragging a card to another column updates the grouped property in that note (<https://obsidian.md/help/bases/views/kanban>).
- **Limits:**
  - Rows are **notes only**. Bases cannot show checkbox lines (<https://obsidian.md/help/bases/functions>).
  - One grouping property per view.
  - No manual order within a column.
- **Calendar view:** "planned" on the roadmap (<https://obsidian.md/roadmap/>).
- **Embedding:** a note can embed a Bases view (a ```` ```base ```` block or `![[File.base#View]]`) next to a ```` ```tasks ```` query (<https://obsidian.md/help/bases/create-base>).
- **Startup note:** opening a chosen note when Obsidian starts is a core setting since 1.11.4, under Files & links › Default file to open.

## Candidates

All community pages are at `https://community.obsidian.md/plugins/<id>`.

| Plugin | License | Downloads / stars | Latest release | Maintained | Health / Review |
|---|---|---|---|---|---|
| [Tasks](https://github.com/obsidian-tasks-group/obsidian-tasks) (obsidian-tasks-plugin) | MIT | 4.40M / 4.05k | 8.5.0, 2026-10-10 | Yes, team of two | Excellent / Caution (61 lint items; build reproduced) |
| Kanban (obsidian-kanban), GitHub: mgmeyers, now community-archive | GPL-3.0 | 2.75M / 4.53k | 2.0.51, 2024-05-31 | No; maintainer call 2026-01 | Good / Risks |
| [Task List Kanban](https://github.com/erikars/task-list-kanban) (task-list-kanban) | MIT | 44k / 108 | 2.21.0, 2026-09-30 | Yes | Excellent / Satisfactory (build reproduced) |
| [Task Board](https://github.com/tu2-atmanand/Task-Board) (task-board) | GPL-3.0 | 77k / 458 | 1.10.11, 2026-06-07 | Yes, slower | Excellent / Risks (7 high findings) |
| [CardBoard](https://github.com/roovo/obsidian-card-board) (card-board) | MIT | 182k / 638 | 0.7.9, 2024-02-25 | No | Fair / Caution |
| [Dataview](https://github.com/blacksmithgu/obsidian-dataview) (dataview) | MIT | 5.13M / 9.39k | 0.5.68, 2025-03-15 | Effectively no (successor Datacore in progress) | Good / Risks (eval) |
| [Homepage](https://github.com/mirnovov/obsidian-homepage) (homepage) | MIT | 1.38M / 725 | 4.5.0, 2026-09-02 | Yes | Excellent / Passed |
| [Full Calendar Remastered](https://github.com/obsidian-full-calendar-remastered/plugin-full-calendar) (full-calendar-remastered) | GPL-3.0 | 49.7k / 180 | 0.13.6, 2026-09-07 | Yes | Excellent / Passed |
| [Calendar Bases](https://github.com/edrickleong/obsidian-calendar-bases) (calendar-bases) | MIT | 123k / 186 | 0.2.8, 2026-04-06 | Slow | Good / Risks (lint) |
| [Day Planner](https://github.com/ivan-lednev/obsidian-day-planner) (obsidian-day-planner) | MIT | 902k / 2.73k | 0.35.1, 2026-07-31 | Yes | Excellent / Caution |
| [Git](https://github.com/Vinzent03/obsidian-git) (obsidian-git) | MIT | 3.28M / 12.1k | 2.41.1, 2026-10-02 | Yes | Excellent / Caution (shell disclosures) |
| [TaskNotes](https://github.com/callumalpass/tasknotes) (tasknotes) | MIT | 2.09M / 2.21k | 4.13.8, 2026-10-02 | Yes | Excellent / Satisfactory |
| [Task Genius](https://github.com/taskgenius/taskgenius-plugin) (obsidian-task-progress-bar) | FSL-1.1 (not open source) | 173k / 577 | 9.13.1, 2025-12-11 | Slowing | Good / Risks |
| Full Calendar, Calendar, Periodic Notes, GitHub: archived or stale since 2021–2023 |  |  |  | No |  |

**How each one fits**

- **Tasks** (obsidian-tasks-plugin): Live queries over task lines; ticking in a query edits the source line. Custom statuses such as `[/]` map to IN_PROGRESS. Reads one format at a time: emoji or Dataview (`[due:: 2026-10-17]`). JavaScript in queries is off by default since 8.0. No board layout.
- **Kanban** (obsidian-kanban): Cards live in its own board file and can't show task lines from other notes live. Avoid.
- **Task List Kanban** (task-list-kanban): Drag-and-drop board of task lines that stay in their notes; columns by tag or checkbox marker; reads Tasks and Dataview dates. Small user base.
- **Task Board** (task-board): Board of task lines from the whole vault; edits the source.
- **CardBoard** (card-board): Stale; no drag-and-drop; no custom statuses. Avoid.
- **Dataview** (dataview): Not needed: Tasks plus Bases cover it. Avoid.
- **Homepage** (homepage): Optional now that the core startup setting exists.
- **Full Calendar Remastered** (full-calendar-remastered): Calendar of dated notes and Tasks lines, two-way. Small user base.
- **Calendar Bases** (calendar-bases): Month-calendar layout for Bases.
- **Day Planner** (obsidian-day-planner): Time blocking to the minute; doesn't fit.
- **Git** (obsidian-git): Desktop versioning; its own README calls mobile "very unstable".
- **TaskNotes** (tasknotes): One note per task, plus network features; wrong model here.
- **Task Genius** (obsidian-task-progress-bar): Avoid.
- **Full Calendar, Calendar, Periodic Notes**: Avoid.

## Recommended set

- **Core:** Bases (including kanban), Properties view, Bookmarks, File recovery, Backlinks, Workspaces, and the core startup note.
- **Community:** Tasks. It has the strongest trust signals of any candidate.
- **Optional, only if needed:**
  - Task List Kanban, for a drag-and-drop board of task lines.
  - Full Calendar Remastered, or wait for the native Bases calendar.
  - Git, for desktop history (the agent already saves versions).
- **Avoid:** Kanban, CardBoard, Dataview, the abandoned calendar plugins, Day Planner, TaskNotes and Task Genius.
