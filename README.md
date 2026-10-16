# Second Brain

Second Brain is a framework for a second brain that an AI agent keeps for you. It is for people who want their notes, tasks and plans in plain markdown files they own, with an agent doing the filing, linking, reminding and reviewing.

Read it on the website: <https://alexsendula.github.io/second-brain/>

## What's here

- **[System design](https://alexsendula.github.io/second-brain/system-design/)** (`system-design.md`): the framework itself (system v1, frozen: it changes only by the author's explicit decision). What the system is and why, independent of any tool: the kinds of things it holds, the routines, the rules and the boundaries. Read this first.
- **[Implementation](https://alexsendula.github.io/second-brain/implementation/)** (`implementation.md`): one way to run the system, the author's own setup, with its tools, scripts and file format. Use it as a template, or write your own.
- **Research** (`research/`): what the choices rest on.
  - [Landscape survey](https://alexsendula.github.io/second-brain/research/2026-10-11-landscape-survey/): existing tools, from markdown apps and task managers to agent memory layers.
  - [Agent memory](https://alexsendula.github.io/second-brain/research/2026-10-13-agent-memory-research/): memory systems compared, and what was chosen.
  - [Obsidian plugins](https://alexsendula.github.io/second-brain/research/2026-10-13-obsidian-plugins/): which plugins are trusted and fit a vault like this one.

## Ready to use

- **[Ninja Board](https://github.com/AlexSendula/ninja-board)** is an Obsidian plugin built for the implementation. It shows a vault as Today, Week, Projects, Backlog & Waiting and Guide views. Use it as it is, or change it to fit your own setup.
- **[Second Brain Setup](https://github.com/AlexSendula/second-brain-setup)** sets up a working vault from one sentence to your AI agent. Ask your agent:

```text
Install this second brain for me: https://github.com/AlexSendula/second-brain-setup
```

For agents: to install this system, follow <https://github.com/AlexSendula/second-brain-setup/blob/main/SETUP.md>.

## How the site is built

The site is these markdown files, built by Jekyll on GitHub Pages, with no build step or plugins. `_config.yml` holds the title, the base path and the files kept out of the site, and `_includes/` holds the `fig-*.html` figures. The page frame is `_layouts/default.html`, the style, script and fonts are in `assets/`, and the reading order is `_data/nav.yml`. When you change a heading, change it in `nav.yml` too.

To preview the site, install Jekyll and run this in this folder:

```bash
jekyll serve
```

## Licence

MIT, Copyright (c) 2026 AlexSendula. See [LICENSE](LICENSE). The fonts in `assets/fonts/` (Geist, Geist Mono and EB Garamond) are under the SIL Open Font License, and each licence sits beside its font.
