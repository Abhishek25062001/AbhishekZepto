# Start New Codex Chat Prompt

Paste this into every new Codex chat:

```text
Read all files under /project-context before doing anything. Then read CURRENT_PROGRESS.md and AI_AGENT_INSTRUCTIONS.md. Continue only after understanding the project context, current phase, module dependencies, architecture standards, API standards, DB standards, security rules, testing rules, and production quality expectations. Current task: [PASTE TASK HERE]
```

Path note: `/project-context` means the `project-context` folder at the `ZeptoProject` root. If the new chat starts in the parent workspace, use `ZeptoProject/project-context`.
