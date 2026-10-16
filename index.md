---
layout: default
title: "Second Brain"
---

# Second Brain

A second brain is a trusted place outside your head for what you know, what happened, and what you've committed to. It gives these back when you ask, and before you need to ask, so your mind is free to think and to live.
{: .lead}

This is a framework for keeping one with an AI agent. The agent files, links, reminds and reviews, so the upkeep that killed earlier second brains is no longer your job. Everything lives in plain markdown files in a folder you own, and you can read and fix every one of them by hand.

## Where to start

To see what it's like day to day, read [Using it]({{ '/using-it/' | relative_url }}): what you say to your agent, and how a week with it goes.

<ol class="start wide">
<li><p class="top"><span class="n" aria-hidden="true">1</span><svg class="go" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 8h10M9 4l4 4-4 4"/></svg></p><p><a href="{{ '/system-design/' | relative_url }}">System design</a> is the framework. It says what the system is and why: the kinds of things it holds, the routines, the rules and the boundaries. It does not depend on any tool.</p></li>
<li><p class="top"><span class="n" aria-hidden="true">2</span><svg class="go" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 8h10M9 4l4 4-4 4"/></svg></p><p><a href="{{ '/implementation/' | relative_url }}">Implementation</a> is one way to run it: the author's own setup, with the tools, scripts and file format. Use it as a template, or write your own.</p></li>
<li><p class="top"><span class="n" aria-hidden="true">3</span><svg class="go" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 8h10M9 4l4 4-4 4"/></svg></p><p><a href="#research">Research</a> is what the choices rest on.</p><p class="docs-in">Landscape survey · Agent memory · Obsidian plugins</p></li>
</ol>

## Routines (CORD)

{% include fig-cord.html %}

## Kinds of things in a life

{% include fig-kinds.html %}

## The vault

The vault is one folder, called `second-brain` by default.

{% include fig-vault.html %}

## Ready to use

<div class="ready" markdown="1">

[Ninja Board](https://github.com/AlexSendula/ninja-board) is an Obsidian plugin built for the implementation. It shows your vault as Today, Week, Projects, Backlog & Waiting and Guide views, where you mark tasks done, drag cards and plan your week. Use it as it is, or change it to fit your own setup.

[Second Brain Setup](https://github.com/AlexSendula/second-brain-setup) sets up a working vault from one sentence to your AI agent: `Install this second brain for me: https://github.com/AlexSendula/second-brain-setup`.

For agents: to install this system, follow <https://github.com/AlexSendula/second-brain-setup/blob/main/SETUP.md>.

</div>

## Research

- [Landscape survey]({{ '/research/2026-10-11-landscape-survey/' | relative_url }}): what already exists, from markdown apps and task managers to agent memory layers.
- [Agent memory]({{ '/research/2026-10-13-agent-memory-research/' | relative_url }}): eleven memory systems compared against the rules of the design, and what was decided.
- [Obsidian plugins]({{ '/research/2026-10-13-obsidian-plugins/' | relative_url }}): which plugins are trusted and fit a vault like this one.
{: .docs}

## Good to know

The system is built for one person's private life first. The same system should work for a work vault, kept separately.

The files are released under the MIT licence.
