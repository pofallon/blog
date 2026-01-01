# AI Prompt for Project Documentation

Use this prompt with an AI assistant that has access to the project's source code repository.

---

## The Prompt

Copy everything below the line and paste it into your AI assistant:

---

I need you to analyze this codebase and generate documentation for a project landing page. Please explore the repository thoroughly to understand what this project does, then fill out the template below.

### Instructions

1. **Explore the codebase**: Read the README, look at package.json/setup.py/Cargo.toml (depending on language), examine the main source files, and understand the project structure.

2. **Identify key information**:
   - What problem does this solve?
   - Who is the target audience?
   - What are the main features and capabilities?
   - What technologies/patterns does it use?
   - What makes it different from alternatives?

3. **Fill out the template** below with specific, accurate information based on your analysis. Be concrete and specific - avoid generic marketing language.

4. **Output two things**:
   - The filled template in human-readable markdown
   - A JSON snippet ready to paste into `projects.json`

### Template to Fill

```markdown
## Project Metadata

- **Slug**: [lowercase-kebab-case, e.g., "my-project"]
- **Name**: [Display name]
- **Summary**: [One compelling sentence - what it is and what it does]
- **Tags**: [5-6 relevant technology/category tags]
- **Primary Link**: [Usually GitHub URL]
- **Secondary Links**: [Docs, package registry, demo, etc.]

## Overview

[2-3 sentences: What is this project? Who is it for? What core problem does it solve?]

## Key Features

[List 4-6 key features. For each: Feature Name - what it does and why it matters]

## Use Cases

[4-6 specific scenarios where this project excels. Be concrete about the types of problems it solves.]

## Technical Highlights

[2-3 sentences about the technical approach. What patterns, technologies, or design decisions make this interesting? What does it integrate with?]

## Getting Started

[2-3 sentences about how to get started. Installation method, first steps, where to find docs.]
```

### Output Format

After filling the template, also provide this JSON ready for projects.json:

```json
{
  "slug": "project-slug",
  "name": "Project Name",
  "summary": "One-sentence summary.",
  "details": "Overview\n\n[Overview text]\n\nKey Features\n\n- Feature 1: Description\n- Feature 2: Description\n...\n\nUse Cases\n\n[Intro]\n\n- Use case 1\n- Use case 2\n...\n\nTechnical Highlights\n\n[Technical text]\n\nGetting Started\n\n[Getting started text]",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "links": [
    {
      "label": "GitHub",
      "url": "https://github.com/...",
      "type": "primary"
    },
    {
      "label": "Documentation",
      "url": "https://..."
    }
  ]
}
```

### Quality Guidelines

- **Be specific**: Use actual class names, function names, and terminology from the code
- **Be accurate**: Only claim features that actually exist in the codebase
- **Be concise**: Each section should be scannable, not a wall of text
- **Be honest**: If something is experimental or limited, say so
- **Avoid buzzwords**: Skip "revolutionary", "game-changing", etc. - describe what it actually does

---

## Usage Examples

### For Claude Code / Cursor / Aider

1. Open the project repository in your AI-enabled editor
2. Paste the prompt above
3. The AI will explore the codebase and generate the documentation
4. Review and edit as needed
5. Copy the JSON output into your blog's `content/projects.json`

### For ChatGPT / Claude.ai with file upload

1. Download or zip the repository's key files (README, package.json, main source files)
2. Upload to the chat
3. Paste the prompt
4. Review the generated documentation

### For GitHub Copilot Chat

1. Open the repository in VS Code with Copilot
2. Use `@workspace` to give it context
3. Paste the prompt with `@workspace` prefix
4. Review output

---

## Tips for Best Results

1. **Ensure the README exists and is up-to-date** - AI assistants heavily rely on it
2. **Have clear entry points** - main.py, index.ts, lib.rs, etc.
3. **Review for accuracy** - AI may misunderstand complex architectures
4. **Add context if needed** - "This is a CLI tool" or "This is a React component library"
5. **Iterate** - Ask follow-up questions to improve specific sections
