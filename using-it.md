---
layout: default
title: "Using it"
---

# Using your second brain

You keep this second brain by talking to an AI agent. You tell it what happened and what you need to do, and it files, links, reminds and reviews. You read and plan in your views, and you can always open a note and fix it yourself.
{: .lead}

This page shows what that looks like from day to day.

## Start a session

Open your agent in the folder that holds your vault. It first reads the vault's instructions and what it remembers about how you like things. Then it tells you in a few lines what needs you today. If nothing does, it says nothing.

Inside the vault, the agent creates and edits notes on its own. After each batch it saves a version, so you can always undo. It asks you first before changing your rules, before deleting a note, and before anything outside the vault, like sending a message or booking something.

## Get things in

One sentence is enough. Say it the way it comes to you:

```text
remind me to call the plumber
Sam's birthday is 2 July
dentist on 14 November at 10:00
```

After a meeting or a call, hand over what you have: a transcript, your notes, or a single line.

```text
here's the transcript of my meeting with Sam, update the vault
talked to Sam, the website deadline moved to 1 December
```

The agent keeps the conversation and files what came out of it: tasks, dates, and things worth remembering about people. What it can't place waits in your inbox with a question. You get one short summary of what went where.

You can also drop notes in the inbox yourself, in any form. Say `process the inbox` when you want them sorted. Just thinking out loud? Nothing is saved unless you ask.

## Ask

```text
what am I waiting on?
when did I last talk to Sam?
I have an hour at home, what can I do?
```

Answers come from your notes, with links to them. If the agent can't find something, it tells you where it looked instead of guessing.

## Plan your week

At the start of each week the agent builds an overview from what the vault already knows: appointments, deadlines, repeating tasks and birthdays. Planning on top of that is up to you.

```text
help me plan this week
this week I want to choose the hosting for Sam's site
```

## Do, and mark it done

Work from your views: today, this week, each project's next step, and what you're waiting for. When something is done, mark it done in a view, or tell your agent.

```text
I called the plumber
paid the rent yesterday
sent the landlord the form, waiting for a reply
```

Either way, your notes stay in step. A repeating task moves to its next date, and anything you're waiting on gets a date to chase it.

## Review

Once a week, the agent leads a review of about twenty minutes. You empty the inbox, look back, check each project's next step, look two weeks ahead, and plan the week. On a busy day there's a five-minute version.

```text
let's do the weekly review
just the short review today
```

The agent prepares, and you decide. Skipping a review loses nothing.

## After a break

Back after a week or more away? The agent doesn't hand you a long list. It says something like "Welcome back. 3 things need you now; 14 others can wait." Then you choose: just what matters, small batches, or not now.

It never quietly settles a deadline, a bill, or anything someone else is waiting on. What was set aside comes back a few at a time in later reviews.

## A week with it

{% include fig-week.html %}

The rhythm is a guide, not a rule. Miss a day or a few weeks, and nothing is lost.

## It learns your ways

Correct the agent the same way twice, or say "always do this", and it proposes a rule. It adds the rule only after your yes. Until then, what it noticed stays in its memory, and memory never decides what is true. Your notes do.

## Go deeper

Each flow here comes from the [system design]({{ '/system-design/' | relative_url }}): [capture]({{ '/system-design/#41-capture' | relative_url }}), [organize]({{ '/system-design/#42-organize-the-agents-job' | relative_url }}), [conversations]({{ '/system-design/#43-conversations' | relative_url }}), [the catch-up]({{ '/system-design/#44-catch-up' | relative_url }}), [reviews]({{ '/system-design/#45-reviews' | relative_url }}), [the week plan]({{ '/system-design/#46-the-week-plan' | relative_url }}), [coming back after a break]({{ '/system-design/#47-coming-back-after-a-break' | relative_url }}) and [doing]({{ '/system-design/#48-do' | relative_url }}). What the agent may and may not do is in [boundaries]({{ '/system-design/#65-boundaries' | relative_url }}).

## In the author's implementation

<div class="ready" markdown="1">

How the author runs it. This is one example, not part of the framework. The details are in [Implementation]({{ '/implementation/' | relative_url }}).

- **Agent:** Claude Code, Codex, or VS Code with GitHub Copilot, started in the vault folder. The vault's instructions live in `AGENTS.md`.
- **Views:** Obsidian with [Ninja Board](https://github.com/AlexSendula/ninja-board), which shows Today, Week, Projects, Backlog & Waiting, and a Guide. Marking something done there makes the same edit the agent would.
- **Getting started:** [Second Brain Setup](https://github.com/AlexSendula/second-brain-setup) sets up a vault from one sentence to your agent.

Today Second Brain Setup's agent edits notes when you ask, and you plan and mark things done on the boards. The catch-up, the reviews and the week overview come in later versions.

</div>
