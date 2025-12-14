---
template: article
date: 2025-12-13
title: AI-Assisted Project Scaffolding with Persistent Memory
stage: published
tags:
  - ai
  - automation
  - developer-experience
  - llm
---

Making an AI agent scaffold a new project is easy. Making it remember what it did last time? Not so much.

So if you want to build something more complex than a landing page, you'll need a way to guide the llm with a consistent strategic plan.

Every time I started a new session with an LLM to scaffold a project, I'd spend the first ten minutes re-explaining context. What we'd decided. What we'd tried. What didn't work. The model had no memory, and neither did I, not reliably anyway.

So I started writing things down. Not for me. For the agent.

## Who This Is For

This pattern works anywhere you need to break complex work into chunks and iterate across multiple sessions, whether with an AI agent, a team, or both.

- **Researchers & Writers**: Cover deep, complex topics across a series of chat sessions without losing context or repeating yourself
- **Story Writers**: Research and explore the behavioral nuances of characters across multiple conversations
- **Developers**: Scaffold and iterate on applications with consistent strategic direction across sessions
- **Managers**: Explore process changes and organizational decisions with continuity and documented reasoning

## The Pattern

A `.memory/` directory at the project root. Simple markdown files:

- `summary.md`: project overview, current state, key decisions
- `todo.md`: pending work, with `[NEEDS-HUMAN]` markers for things the agent shouldn't decide alone
- `team.md`: which agents have touched this project and what they contributed

Plus typed artifacts: `research-`, `phase-`, `guide-`, `notes-`, `implementation-`, `task-`. Each gets an 8-character hash and a title. The naming convention isn't clever, it's just greppable.

The agent's first job in any session: read `summary.md`. Its last job: update it.

![Mainthread and subthread workflow diagram showing iterations with parallel work and feedback loops](/images/workflow-diagram.svg)

## The Agent and Command

Below you'll find a reference to the the agent and command file I use. 
The Agent can be used directly if you want to do continuous work in that context.
However, the main way I use `miniproject` is via the command, which has a bit of a secret sause: `subagent:true` causes it to spawn a subthread with the MiniProject agent mode active, preserving the main thread for other work.

(Scroll to the appendix for the full code.)

What follows are some example workflows showing how I use this pattern in practice.


## Examples

### Starting a New Project

<Chat>

  <Chat.AgentMode color="blue">Build</Chat.AgentMode>

  <Chat.User>/miniproject</Chat.User>
  
  <Chat.AgentMode>Miniproject</Chat.AgentMode>

  <Chat.User>
  Lets create a spec for a new Node.js project with user authentication
  and a REST API.
  </Chat.User>

  <Chat.ToolUse>write .memory/summary.md</Chat.ToolUse>
  <Chat.ToolUse>write .memory/todo.md</Chat.ToolUse>
  <Chat.ToolUse>write .memory/team.md</Chat.ToolUse>

  <Chat.Assistant>
   Now I'll look for any related files to understand the context better.
  </Chat.Assistant>

  <Chat.ToolUse>read package.json</Chat.ToolUse>
  <Chat.ToolUse>read README.md</Chat.ToolUse>

  <Chat.Assistant>
  I've reviewed the existing files. Now, I'll break down the project into manageable phases.
  </Chat.Assistant>

  <Chat.ToolUse>write .memory/phase-1-initial-setup.md</Chat.ToolUse>
  <Chat.ToolUse>write .memory/phase-2-authentication-layer.md</Chat.ToolUse>
  <Chat.ToolUse>write .memory/phase-3-rest-api.md</Chat.ToolUse>
  <Chat.ToolUse>write .memory/phase-4-testing-and-documentation.md</Chat.ToolUse>

  <Chat.User>
  Great! Let's start with the initial setup phase.
  </Chat.User>

  <Chat.Assistant>
  I'll begin implementing the initial setup phase and document my decisions as I go.
  </Chat.Assistant>

  <Chat.ToolUse>write implementation-1a2b3c4d-initial-setup.md</Chat.ToolUse>
  <Chat.ToolUse>update .memory/summary.md</Chat.ToolUse>
  <Chat.ToolUse>update .memory/todo.md</Chat.ToolUse>
  
</Chat>

The agent will:
1. Create `.memory/summary.md` with project goals
2. Create `.memory/todo.md` with initial tasks
3. Create `.memory/team.md` to track session work
4. Break down the project into phases
5. Start planning implementation steps, documenting decisions as it goes

### Resuming Work

<Chat title="Pick up where you left off">

  <Chat.AgentMode color="blue">Build</Chat.AgentMode>

  <Chat.User>/miniproject Continue working on the authentication layer</Chat.User>

  <Chat.AgentMode>Miniproject</Chat.AgentMode>

  <Chat.Assistant>
  I'll start by reviewing the current project summary and pending tasks.
  </Chat.Assistant>

  <Chat.ToolUse>read .memory/summary.md</Chat.ToolUse>
  <Chat.ToolUse>read .memory/todo.md</Chat.ToolUse>

  <Chat.Assistant>
  I've reviewed the project summary and pending tasks. Now, I'll continue working on the authentication layer.
  </Chat.Assistant>

  <Chat.ToolUse>write implementation-5e6f7g8h-authentication-layer.md</Chat.ToolUse>
</Chat>

The agent reads `.memory/summary.md` first, sees what's been done, checks `.memory/todo.md` for pending work, and continues from there. No re-explanation needed.

### Research Phase

<Chat title="Research Password Hashing">

  <Chat.AgentMode color="blue">Build</Chat.AgentMode>

  <Chat.User>
  /miniproject Research the best approach for password hashing in Node.js
  </Chat.User>

  <Chat.AgentMode>Miniproject</Chat.AgentMode>

  <Chat.Assistant>
  I'll research the best password hashing methods for Node.js and document my findings.
  </Chat.Assistant>

  <Chat.ToolUse>write research-a3f8b2c1-password-hashing.md</Chat.ToolUse>
  <Chat.ToolUse>update .memory/summary.md</Chat.ToolUse>
</Chat>


The agent creates `research-a3f8b2c1-password-hashing.md` with findings:
- Compares bcrypt vs argon2 vs scrypt
- Documents pros/cons
- Makes a recommendation
- Updates `summary.md` with the decision

### Hitting a Decision Point

While working, the agent encounters a tradeoff:

```markdown
## .memory/todo.md

- [NEEDS-HUMAN] Choose database: PostgreSQL (mature, good tooling) vs MongoDB (flexible schema)
  - PostgreSQL: Better for relational data, ACID guarantees
  - MongoDB: Easier for rapid prototyping, schema flexibility
  - Context: User management typically benefits from relational model
```

The agent stops. You review, decide, remove the `[NEEDS-HUMAN]` marker, and the next session implements your choice.

### Compact and Continue

After several research phases, `.memory/` has 10+ files. The agent runs a compaction:

<Chat>

  <Chat.AgentMode color="blue">Build</Chat.AgentMode>

  <Chat.User>
  /miniproject Compact research findings and proceed with implementation
  </Chat.User>

  <Chat.AgentMode>Miniproject</Chat.AgentMode>

  <Chat.Assistant>
  I'll summarize the key research findings and clean up obsolete artifacts before continuing with implementation.
  </Chat.Assistant>

  <Chat.ToolUse>write .memory/summary.md</Chat.ToolUse>
  <Chat.ToolUse>delete research-*.md</Chat.ToolUse>
  <Chat.ToolUse>write implementation-9i0j1k2l-continued-implementation.md</Chat.ToolUse>
</Chat>

It distills successful outcomes into `summary.md`, deletes obsolete research artifacts, and starts implementing with a cleaner context.

## Multi-Agent Handoffs

You might not use a single thread to do everything. Some people might prefer to delegate implementation tasks in parallel.

One agent doesn't do everything. A planning agent thinks through architecture. A build agent writes code. A research agent digs into documentation.

Who knows? How you do this is up to you, but the key is that each agent works within the same `.memory/` context and we need a way to let each know what's going on.

Opencode provides a single tool to allow this pattern: The `task` tool.

(There are other tools to enhance this, I'll mention them later and go into more detail in a follow-up post.)


<Chat title="Delegate Implementation to Build Agent">

  <Chat.AgentMode color="yellow">Plan</Chat.AgentMode>

  <Chat.User>
  /miniproject List the remaining tasks for the authentication phase and delegate to sub-agents via the task tool.
  </Chat.User>

  <Chat.AgentMode>Miniproject</Chat.AgentMode>

  <Chat.Assistant>
  I'll review the current state and create tasks for the remaining work in the authentication phase.
  </Chat.Assistant>

  <Chat.ToolUse>read .memory/summary.md</Chat.ToolUse>
  <Chat.ToolUse>read .memory/todo.md</Chat.ToolUse>
  <Chat.ToolUse>read .memory/phase-2-authentication-layer.md</Chat.ToolUse>
  <Chat.ToolUse>read .memory/task-23-auth-endpoints.md</Chat.ToolUse>
  <Chat.ToolUse>read .memory/task-24-token-management.md</Chat.ToolUse>
  <Chat.Assistant>
  I've identified the remaining tasks for the authentication phase. Now, I'll delegate the implementation to some sub-agents.
  </Chat.Assistant>

</Chat>


The `[NEEDS-HUMAN]` marker is the escape hatch. When an agent hits something consequential (a design tradeoff, a risky deletion, an ambiguous requirement), it tags the item and stops. I review, decide, and the next session picks up where we left off.

## What I Learned

1. **Simple beats clever for small projects.** A vector database gives you semantic search, but it also gives you infrastructure to maintain. For a project with fewer than 50 files, grepping markdown is fast enough and infinitely more debuggable.

2. **Git history of AI decisions is useful.** Each session commits its changes. I can `git log` through the project's evolution and see what the agent was thinking at each step. When something goes wrong, I can trace it back.

3. **This breaks down at scale.** Once you're past a few dozen `.memory/` files, the pattern needs pruning logic. I haven't solved that yet, for now I just delete old research artifacts manually when they stop being relevant.

4. **The human-in-the-loop marker works.** `[NEEDS-HUMAN]` is a forcing function. It makes the agent's uncertainty explicit instead of letting it guess at things it shouldn't.

## When This Fits

- Iterative scaffolding over days or weeks
- Projects where you want an audit trail of AI-assisted decisions
- Situations where context exceeds a single session's window
- You're using this in a git repo and you're the only one working on it

## When it doesn't fit

- You're working with many git repos and need cross-repo context. This pattern is per-repo.
- You work in a team where the presence of the `.memory/` directory would confuse collaborators unfamiliar with the pattern.
- You rely on a git worktree workflow that doesn't store the worktrees inside the main project directory.

## Alternatives

- **BasicMemory**: we could rewrite the prompts to use the BasicMemory tool. This would instruct the LLM to search, write and read notes via the mcp server.
- **ZK cli**: Same as above, but using the ZK cli tool to read and write notes.

Both of these alternatives would require more prompt engineering and careful instruction to ensure the agent maintains context across sessions. Which shouldn't be that difficult.

The `.memory/` directory approach is more straightforward and easier for newcomers to get started with. In a follow up post I'll explore these alternatives in more detail.

---

## Appendix: Implementation

### MIniProject Agent

This is the agent I built to follow this pattern. It uses the `file`, `session`, and `task` tools to read/write `.memory/` files, communicate with subagents, and delegate tasks.

<GithubEmbed 
  repo="zenobi-us/dotfiles"
  ref="1f0aac29223f7c954702ef61a892862b19bd607f"
  path="devtools/files/opencode/agent/miniproject.md"
  language="markdown"
/>

### MiniProject Command 

Mainly just to allow you to site in another mode and spawn a subthread with instructions that will be confined to the MiniProject agent mentality.

<GithubEmbed 
  repo="zenobi-us/dotfiles"
  ref="1f0aac29223f7c954702ef61a892862b19bd607f"
  path="devtools/files/opencode/command/miniproject.md"
  language="markdown"
/>
