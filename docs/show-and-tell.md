# Show and Tell — Storybook for BOPS

### Introduction (~1 min)

Hi everyone. For those who might not know me, I'm Fede, one of the designers at Unboxed working on BOPS.

What I'm going to share today is a little different from what we usually present. At Unboxed we're always looking for ways to improve how we work, and sometimes that means reaching for different tools.

For anyone who hasn't used BOPS before - case officers work through planning applications in stages. There's validation, consultation, assessment, and so on. Each stage has a task list, and each task can have quite a few steps and states. Validation alone has 14 tasks. Some are straightforward yes/no checks, but others involve change requests going out to applicants, emails, responses coming back, officer reviews — there's a lot of UI across the whole journey.

### The problem (~1 min)

In agile ways of working, we try to build fast so we can learn quickly, and that means a lot of iterations as we go. We use Figma to get our initial designs out there and to communicate ideas — and that works well for the early stages.

But at the end of the day, the source of truth lies in the actual code. The real UI. And we spend time going through workflows in the app, trying to get things into the right state to review a specific screen. If you want to see what happens when an applicant responds to a change request and the officer is reviewing it — you need to set up the environment to go through the workflow. That's fiddly and time-consuming.

So I wanted something that gives you the real UI, all the states, browsable, without needing to run the app and set up the right environment.

### What is Storybook (~30 sec)

For anyone who hasn't come across Storybook before — it's an open-source tool for building and documenting UI in isolation. It's widely used in frontend development. You define "stories" — each one is a specific state of a piece of UI — and Storybook gives you a browsable catalogue of all of them. It's typically used for component libraries, but I've used it a bit differently here.

### The AI angle (~30 sec)

Now, the interesting thing is how I've been able to set this up. Traditionally, something like this would require a frontend developer to extract the HTML from the Rails app, set up the build tooling, wire everything together. That's a decent chunk of work.

What I've been doing is using AI to extract the component markup directly from the codebase. It means I can take a complex Rails view, get the HTML out, and have a browsable story for it without needing to be deep in the Rails codebase myself. It's made something that would normally sit in developer territory much more accessible for a designer to set up and maintain.

### Demo — stories and states (~2 min)

**[show Storybook, sidebar visible]**

So here it is. It's organised by workflow stage — you can see validation and consultation in the sidebar.

I've set it up not as a component library, but as a workflow documentation tool. Every task has stories for each state it can be in.

Let me show you Check Description as an example. **[click through variants]**

Here's the initial view — the officer lands on the page. They select "No, it needs changing" — a conditional reveal shows the change request form. Here's the email preview before it's sent. **[show email]** Here's what happens on the applicant's side — they get the email, click through, see this form. **[show applicant form]** Then back to the officer — the response has come in, they review it, accept or reject. **[show review state]** And here's the completed state. That's about 11 variants for just one task, all browsable, all using real GOV.UK components.

### Demo — journey docs (~1.5 min)

Now the thing that's had the biggest impact is what I'm calling journey docs. **[open a journey doc, e.g. Press Notice]**

These are narrative walkthroughs — step by step, who does what, in what order — with live story previews embedded inline. So for Press Notice: step 1, the case officer decides a press notice is needed. Step 2, an email goes to the press team — and you can see the actual email right here. Step 3, the press team confirms, step 4, evidence gets uploaded. It reads like a user journey map but with real UI at every step.

This has changed how we have design conversations. Instead of someone asking "can you show me what happens when..." — they just browse. New stakeholders can understand a workflow by reading through the journey doc. And we've spotted inconsistencies — places where similar tasks handle states differently — just by having them side by side.

### Wrap up (~1 min)

Under the hood it's fairly straightforward. Stories are just HTML strings — using Storybook's HTML renderer, no React. GOV.UK Frontend is loaded so all the interactive components work. There's shared mock data so every story references the same application, same applicant, same constraints — it feels cohesive.

It's become a really useful reference — for design reviews, for onboarding, and just for answering "what does this page actually look like when..." without having to fire up the app.

And the fact that AI has made this kind of tooling accessible to designers — not just developers — I think that's worth exploring more broadly. Happy to chat about it afterwards or show anyone how to get something similar going.
